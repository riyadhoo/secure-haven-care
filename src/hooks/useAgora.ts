import { useState, useEffect, useCallback, useRef } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
import { supabase } from "@/integrations/supabase/client";

interface UseAgoraOptions {
  channelName: string;
  enabled?: boolean;
}

interface AgoraState {
  client: IAgoraRTCClient | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  localVideoTrack: ICameraVideoTrack | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  joined: boolean;
  joining: boolean;
  error: string | null;
}

export function useAgora({ channelName, enabled = true }: UseAgoraOptions) {
  const [state, setState] = useState<AgoraState>({
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
    remoteUsers: [],
    joined: false,
    joining: false,
    error: null,
  });

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoRef = useRef<ICameraVideoTrack | null>(null);

  const join = useCallback(async () => {
    if (!enabled || !channelName) return;

    setState((s) => ({ ...s, joining: true, error: null }));

    try {
      // Fetch token from edge function
      const { data, error } = await supabase.functions.invoke("agora-token", {
        body: { channelName, uid: 0, role: 1 },
      });

      if (error) throw new Error(error.message || "Failed to get Agora token");

      const { token, appId, uid } = data;

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // Listen for remote users
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        setState((s) => ({
          ...s,
          remoteUsers: Array.from(client.remoteUsers),
        }));
      });

      client.on("user-unpublished", () => {
        setState((s) => ({
          ...s,
          remoteUsers: Array.from(client.remoteUsers),
        }));
      });

      client.on("user-left", () => {
        setState((s) => ({
          ...s,
          remoteUsers: Array.from(client.remoteUsers),
        }));
      });

      await client.join(appId, channelName, token, uid);

      // Create local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
        { ANS: true, AEC: true },
        { encoderConfig: "720p_2" }
      );

      localAudioRef.current = audioTrack;
      localVideoRef.current = videoTrack;

      await client.publish([audioTrack, videoTrack]);

      setState({
        client,
        localAudioTrack: audioTrack,
        localVideoTrack: videoTrack,
        remoteUsers: Array.from(client.remoteUsers),
        joined: true,
        joining: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Agora join error:", err);
      setState((s) => ({
        ...s,
        joining: false,
        error: err.message || "Failed to join video call",
      }));
    }
  }, [channelName, enabled]);

  const leave = useCallback(async () => {
    localAudioRef.current?.close();
    localVideoRef.current?.close();
    await clientRef.current?.leave();

    localAudioRef.current = null;
    localVideoRef.current = null;
    clientRef.current = null;

    setState({
      client: null,
      localAudioTrack: null,
      localVideoTrack: null,
      remoteUsers: [],
      joined: false,
      joining: false,
      error: null,
    });
  }, []);

  const toggleMic = useCallback((enabled: boolean) => {
    localAudioRef.current?.setEnabled(enabled);
  }, []);

  const toggleCam = useCallback((enabled: boolean) => {
    localVideoRef.current?.setEnabled(enabled);
  }, []);

  // Auto-join on mount
  useEffect(() => {
    if (enabled && channelName) {
      join();
    }
    return () => {
      leave();
    };
  }, []);

  return {
    ...state,
    join,
    leave,
    toggleMic,
    toggleCam,
  };
}
