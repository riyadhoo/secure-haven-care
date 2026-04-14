import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Agora token generation using HMAC-based approach
// Based on https://github.com/AgoraIO/Tools/tree/master/DynamicKey/AgoraDynamicKey

const VERSION = "007";
const PRIVILEGE_JOIN_CHANNEL = 1;
const PRIVILEGE_PUBLISH_AUDIO = 2;
const PRIVILEGE_PUBLISH_VIDEO = 3;
const PRIVILEGE_PUBLISH_DATA = 4;

function encodeUint16(value: number): Uint8Array {
  const buf = new Uint8Array(2);
  buf[0] = value & 0xff;
  buf[1] = (value >> 8) & 0xff;
  return buf;
}

function encodeUint32(value: number): Uint8Array {
  const buf = new Uint8Array(4);
  buf[0] = value & 0xff;
  buf[1] = (value >> 8) & 0xff;
  buf[2] = (value >> 16) & 0xff;
  buf[3] = (value >> 24) & 0xff;
  return buf;
}

function encodeString(str: string): Uint8Array {
  const encoder = new TextEncoder();
  const strBytes = encoder.encode(str);
  const lenBytes = encodeUint16(strBytes.length);
  const result = new Uint8Array(lenBytes.length + strBytes.length);
  result.set(lenBytes, 0);
  result.set(strBytes, lenBytes.length);
  return result;
}

function encodeMap(map: Map<number, number>): Uint8Array {
  const parts: Uint8Array[] = [];
  parts.push(encodeUint16(map.size));
  for (const [key, value] of map) {
    parts.push(encodeUint16(key));
    parts.push(encodeUint32(value));
  }
  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, a) => sum + a.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function hmacSign(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, message);
  return new Uint8Array(signature);
}

async function generateAccessToken(
  appId: string,
  appCertificate: string,
  channelName: string,
  uid: number,
  role: number,
  privilegeExpiredTs: number
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const salt = Math.floor(Math.random() * 0xFFFFFFFF);

  const privileges = new Map<number, number>();
  privileges.set(PRIVILEGE_JOIN_CHANNEL, privilegeExpiredTs);
  if (role === 1) { // publisher
    privileges.set(PRIVILEGE_PUBLISH_AUDIO, privilegeExpiredTs);
    privileges.set(PRIVILEGE_PUBLISH_VIDEO, privilegeExpiredTs);
    privileges.set(PRIVILEGE_PUBLISH_DATA, privilegeExpiredTs);
  }

  const messageContent = concat(
    encodeUint32(salt),
    encodeUint32(timestamp),
    encodeMap(privileges)
  );

  const toSign = concat(
    new TextEncoder().encode(appId),
    new TextEncoder().encode(channelName),
    encodeUint32(uid),
    messageContent
  );

  const signature = await hmacSign(
    new TextEncoder().encode(appCertificate),
    toSign
  );

  const content = concat(
    encodeString(appId),
    encodeUint32(timestamp),
    encodeUint32(salt),
    encodeUint16(signature.length),
    signature,
    encodeUint16(messageContent.length),
    messageContent
  );

  return VERSION + bytesToBase64(content);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { channelName, uid = 0, role = 1 } = await req.json();

    if (!channelName || typeof channelName !== "string") {
      return new Response(JSON.stringify({ error: "channelName is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const appId = Deno.env.get("AGORA_APP_ID");
    const appCertificate = Deno.env.get("AGORA_APP_CERTIFICATE");

    if (!appId || !appCertificate) {
      return new Response(JSON.stringify({ error: "Agora credentials not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Token valid for 1 hour
    const privilegeExpiredTs = Math.floor(Date.now() / 1000) + 3600;
    const agoraToken = await generateAccessToken(
      appId, appCertificate, channelName, uid, role, privilegeExpiredTs
    );

    return new Response(JSON.stringify({
      token: agoraToken,
      appId,
      channel: channelName,
      uid,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate token" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
