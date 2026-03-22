'use client';

import Image, { type ImageProps } from 'next/image';
import { useRef, useState, useEffect } from 'react';

interface LazyImageProps extends Omit<ImageProps, 'loading'> {
  /**
   * Set to true ONLY for the above-the-fold LCP image on a given page.
   * When true: injects a <link rel="preload"> (via next/image priority prop),
   * skips IntersectionObserver, and renders eagerly.
   * When false (default): lazy-loads the image and fades it in on entry.
   */
  priority?: boolean;
  /** Optional wrapper className for the fade-in container */
  wrapperClassName?: string;
}

/**
 * LazyImage — correct lazy loading without hurting LCP.
 *
 * Pattern:
 *  - LCP images   → priority={true}  → preloaded, no lazy loading
 *  - Below-fold   → priority={false} → loading="lazy" + fade-in on IntersectionObserver
 *
 * Usage examples:
 *
 *   // Hero / LCP image — eagerly preloaded
 *   <LazyImage priority src="/images/hero.webp" alt="Hero" width={1200} height={630} />
 *
 *   // Tool icon — lazy loaded, fades in on scroll
 *   <LazyImage src="/images/icons/compress.svg" alt="Compress" width={48} height={48} />
 *
 *   // Blog card thumbnail — lazy loaded
 *   <LazyImage src={post.image} alt={post.title} fill className="object-cover" />
 */
export function LazyImage({
  priority = false,
  wrapperClassName,
  className,
  alt,
  ...props
}: LazyImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(priority); // LCP images start visible immediately

  useEffect(() => {
    // LCP images don't need observation — they're already visible
    if (priority) return;

    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true); // SSR / unsupported browser fallback
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        // Start loading 200px before the image enters the viewport
        // so there's no visible delay on scroll
        rootMargin: '200px 0px',
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  if (priority) {
    // Pure next/image with priority — injects <link rel="preload">, no wrapper needed
    return (
      <Image
        alt={alt}
        priority
        loading="eager"
        className={className}
        {...props}
      />
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{ display: 'contents' }}
    >
      <Image
        alt={alt}
        loading="lazy"
        className={[
          className,
          'transition-opacity duration-500 ease-in-out',
          isVisible ? 'opacity-100' : 'opacity-0',
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    </div>
  );
}
