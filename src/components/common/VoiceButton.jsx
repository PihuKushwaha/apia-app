import { useState } from "react";

export default function VoiceButton({ onRecordToggle }) {
  const [listening, setListening] = useState(false);

  const handleClick = () => {
    const next = !listening;
    setListening(next);
    onRecordToggle?.(next);
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-20 right-4 md:bottom-8 w-14 h-14 rounded-full shadow-lg text-white ${
        listening ? "bg-alertRed animate-pulse" : "bg-navy"
      }`}
      aria-label="Voice command"
    >
      🎙️
    </button>
  );
}