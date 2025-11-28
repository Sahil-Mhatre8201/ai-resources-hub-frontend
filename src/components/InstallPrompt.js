'use client';

import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    console.log("[PWA] Waiting for beforeinstallprompt…");

    const handler = (e) => {
      console.log("[PWA] beforeinstallprompt fired", e);
      e.preventDefault(); // prevent default browser prompt
      setPromptEvent(e);
      setSupportsPWA(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  if (!supportsPWA) return null;

  return (
    <button
      onClick={() => {
        console.log("[PWA] Triggering install prompt…");
        promptEvent.prompt();
      }}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px 18px",
        background: "black",
        color: "white",
        borderRadius: "10px",
        zIndex: 9999
      }}
    >
      Install App
    </button>
  );
}
