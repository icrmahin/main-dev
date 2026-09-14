"use client";

import { useEffect } from "react";
import { Lenis as ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------------------
   GSAP ↔ Lenis sync
   ---------------------------------------------------------------------------
   A single, stable Lenis instance lives in <ReactLenis root> above the whole
   app. This child drives Lenis's rAF loop from GSAP's global ticker so the
   smooth scroll and every ScrollTrigger animation share one clock. Lenis
   (root mode) writes to the native window scroll each frame, so ScrollTrigger
   reads smoothed positions and stays perfectly in step.
   --------------------------------------------------------------------------- */

function GsapLenisSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => ScrollTrigger.update();
    const onRaf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", onScroll);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refresh);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(onRaf);
    };
  }, [lenis]);

  return null;
}

/* ---------------------------------------------------------------------------
   Provider
   --------------------------------------------------------------------------- */

interface SmoothScrollProps {
  readonly children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.09,
        wheelMultiplier: 1,
        respectReducedMotion: true,
        stopInertiaOnNavigate: true,
      }}
    >
      <GsapLenisSync />
      {children}
    </ReactLenis>
  );
}