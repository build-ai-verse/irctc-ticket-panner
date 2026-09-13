"use client";

import { useEffect } from "react";

/**
 * Two atmospheric touches for the hero. Renders nothing.
 *
 * Both are strictly additive: the header's readable state and the scene's
 * neutral position are what the CSS already gives you, and this only moves them
 * *away* from that when it can confirm the conditions. If this component never
 * runs — blocked script, failed hydration, no JS at all — the page is still
 * correct, just static. (The scroll reveals are pure CSS for the same reason.)
 */
export default function Enhancements() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".site-header");
    const hero = document.querySelector(".hero");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Header floats over the hero, then settles into glass ---------------
    let headerFrame = 0;
    const syncHeader = () => {
      headerFrame = 0;
      header?.classList.toggle("is-floating", !!hero && window.scrollY <= 24);
    };
    const onScroll = () => {
      if (headerFrame) return;
      headerFrame = requestAnimationFrame(syncHeader);
    };

    syncHeader();
    window.addEventListener("scroll", onScroll, { passive: true });

    const cleanupHeader = () => {
      window.removeEventListener("scroll", onScroll);
      if (headerFrame) cancelAnimationFrame(headerFrame);
      header?.classList.remove("is-floating");
    };

    // --- Pointer parallax on the 3D scene ----------------------------------
    // Fine pointers only: on a phone there is no hover, and the work is wasted.
    if (reduced || !window.matchMedia("(pointer: fine)").matches) {
      return cleanupHeader;
    }

    let frame = 0;
    let px = 0;
    let py = 0;

    const onMove = (event: PointerEvent) => {
      // Normalise to -1..1 around the viewport centre.
      px = (event.clientX / window.innerWidth) * 2 - 1;
      py = (event.clientY / window.innerHeight) * 2 - 1;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        root.style.setProperty("--px", px.toFixed(3));
        root.style.setProperty("--py", py.toFixed(3));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      root.style.removeProperty("--px");
      root.style.removeProperty("--py");
      cleanupHeader();
    };
  }, []);

  return null;
}
