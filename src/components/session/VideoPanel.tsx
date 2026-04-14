import { useEffect, useRef } from "react";
import { ICameraVideoTrack, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { Loader2, VideoOff } from "lucide-react";

interface LocalVideoProps {
  videoTrack: ICameraVideoTrack | null;
  label: string;
  initials: string;
  camOn: boolean;
}

export function LocalVideo({ videoTrack, label, initials, camOn }: LocalVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoTrack && containerRef.current && camOn) {
      videoTrack.play(containerRef.current);
      return () => {
        videoTrack.stop();
      };
    }
  }, [videoTrack, camOn]);

  return (
    <div className="bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
      {camOn && videoTrack ? (
        <div ref={containerRef} className="w-full h-full" />
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-primary">{initials}</span>
          </div>
          <p className="text-sm text-primary-foreground/70">{label}</p>
          {!camOn && (
            <p className="text-xs text-primary-foreground/40 mt-1 flex items-center justify-center gap-1">
              <VideoOff className="h-3 w-3" /> Camera Off
            </p>
          )}
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-xs text-white">
        {label}
      </div>
    </div>
  );
}

interface RemoteVideoProps {
  user: IAgoraRTCRemoteUser;
  label: string;
  avatar: string;
}

export function RemoteVideo({ user, label, avatar }: RemoteVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user.videoTrack && containerRef.current) {
      user.videoTrack.play(containerRef.current);
      return () => {
        user.videoTrack?.stop();
      };
    }
  }, [user.videoTrack]);

  useEffect(() => {
    if (user.audioTrack) {
      user.audioTrack.play();
      return () => {
        user.audioTrack?.stop();
      };
    }
  }, [user.audioTrack]);

  return (
    <div className="bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
      {user.videoTrack ? (
        <div ref={containerRef} className="w-full h-full" />
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">{avatar}</span>
          </div>
          <p className="text-sm text-primary-foreground/70">{label}</p>
          <p className="text-xs text-primary-foreground/40 mt-1">Audio Only</p>
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-xs text-white">
        {label}
      </div>
    </div>
  );
}

interface WaitingPanelProps {
  joining: boolean;
  error: string | null;
}

export function WaitingPanel({ joining, error }: WaitingPanelProps) {
  return (
    <div className="bg-white/5 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        {joining ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-primary-foreground/70">Connecting…</p>
          </>
        ) : error ? (
          <>
            <p className="text-sm text-destructive mb-1">Connection failed</p>
            <p className="text-xs text-primary-foreground/40">{error}</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-sm text-primary-foreground/70">Waiting for participant…</p>
          </>
        )}
      </div>
    </div>
  );
}
