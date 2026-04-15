"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  const [hasIntersected, setHasIntersected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        rootMargin: "100px",
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        hasIntersected
          ? `animate-in fade-in slide-in-from-bottom-4 duration-700 ${className}`
          : `opacity-0 translate-y-4 ${className}`
      }
    >
      {children}
    </div>
  );
}
