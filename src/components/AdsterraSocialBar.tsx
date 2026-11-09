"use client";

import { useEffect, useRef } from "react";

/**
 * Renders Adsterra Social Bar / In-Page Push widget directly above the player.
 * Injects the raw script tag from the admin-configured socialBarCode.
 * Sits over/above the video without redirecting the user.
 */
export default function AdsterraSocialBar({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!code || !containerRef.current || injectedRef.current) return;

    // Only inject once per mount
    injectedRef.current = true;

    // Parse the HTML string and inject scripts properly
    const fragment = document.createRange().createContextualFragment(code);

    // Extract script elements and re-create them so the browser actually executes them
    const scripts = fragment.querySelectorAll("script");
    const container = containerRef.current;

    // Append non-script nodes first
    const nonScriptNodes = Array.from(fragment.childNodes).filter(
      (node) => !(node instanceof HTMLScriptElement)
    );
    nonScriptNodes.forEach((node) => container.appendChild(node.cloneNode(true)));

    // Now re-create and inject script elements so they execute
    scripts.forEach((oldScript) => {
      const src = oldScript.getAttribute("src");
      if (src && document.querySelector(`script[src="${src}"]`)) {
        return; // Avoid duplicate loading if already present
      }

      const newScript = document.createElement("script");
      // Copy all attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      // Copy inline script content
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }
      container.appendChild(newScript);
    });

    return () => {
      // Cleanup on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      injectedRef.current = false;
    };
  }, [code]);

  if (!code) return null;

  return (
    <div
      ref={containerRef}
      className="w-full z-40 relative"
      style={{ minHeight: "1px" }}
    />
  );
}
