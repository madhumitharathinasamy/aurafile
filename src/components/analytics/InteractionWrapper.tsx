"use client";

import { useState, useEffect, ReactNode } from "react";

interface InteractionWrapperProps {
  children: ReactNode;
}

export function InteractionWrapper({ children }: InteractionWrapperProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (hasInteracted) return;

    const handleInteraction = () => {
      setHasInteracted(true);
    };

    // Listen for common interaction events
    const events = ["scroll", "click", "touchstart", "mousemove", "keydown"];
    
    events.forEach((event) => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    // Fallback: load after a significant delay (e.g., 5 seconds) if no interaction occurs,
    // to ensure analytics might still fire for passive readers.
    const fallbackTimer = setTimeout(() => {
      setHasInteracted(true);
    }, 5000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
      clearTimeout(fallbackTimer);
    };
  }, [hasInteracted]);

  if (!hasInteracted) return null;

  return <>{children}</>;
}
