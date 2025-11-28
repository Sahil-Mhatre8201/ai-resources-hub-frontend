'use client';

import { useEffect, useState } from "react";

export default function IOSInstallMessage() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    const standalone =
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    setIsIOS(ios);
    setIsStandalone(standalone);

    console.log("[PWA] iOS:", ios, "Standalone mode:", standalone);
  }, []);

  if (!isIOS || isStandalone) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      padding: "16px",
      background: "#fff4c2",
      textAlign: "center",
      zIndex: 9999,
      boxShadow: "0 -2px 6px rgba(0,0,0,0.1)"
    }}>
      <p style={{ margin: 0 }}>
        Install this app: Tap <b>Share</b> → <b>Add to Home Screen</b>
      </p>
    </div>
  );
}
