import { Mic, MicOff, VideoIcon, VideoOff, Phone, MessageSquare, Brain } from "lucide-react";

interface SessionControlsProps {
  micOn: boolean;
  camOn: boolean;
  chatOpen: boolean;
  aiOpen: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleChat: () => void;
  onToggleAI: () => void;
  onEndSession: () => void;
}

export default function SessionControls({
  micOn, camOn, chatOpen, aiOpen,
  onToggleMic, onToggleCam, onToggleChat, onToggleAI, onEndSession,
}: SessionControlsProps) {
  const btn = (active: boolean, activeClass: string) =>
    `w-12 h-12 rounded-full flex items-center justify-center transition-colors active:scale-[0.95] ${
      active ? activeClass : "bg-white/10 hover:bg-white/15 text-primary-foreground"
    }`;

  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <button onClick={onToggleMic} className={btn(!micOn, "bg-[hsl(var(--crisis))] text-white")}>
        {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </button>
      <button onClick={onToggleCam} className={btn(!camOn, "bg-[hsl(var(--crisis))] text-white")}>
        {camOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </button>
      <button onClick={onToggleChat} className={btn(chatOpen, "bg-primary text-primary-foreground")}>
        <MessageSquare className="h-5 w-5" />
      </button>
      <button onClick={onToggleAI} className={btn(aiOpen, "bg-primary text-primary-foreground")}>
        <Brain className="h-5 w-5" />
      </button>
      <button
        onClick={onEndSession}
        className="w-12 h-12 rounded-full bg-[hsl(var(--crisis))] hover:bg-[hsl(var(--crisis))]/90 text-white flex items-center justify-center transition-colors active:scale-[0.95]"
      >
        <Phone className="h-5 w-5 rotate-[135deg]" />
      </button>
    </div>
  );
}
