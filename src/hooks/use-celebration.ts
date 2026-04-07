import { useCallback } from "react";

/**
 * Lightweight CSS-only confetti celebration.
 * No external library needed — creates DOM elements and removes them after animation.
 */
export function useCelebration() {
  const celebrate = useCallback(() => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden";
    document.body.appendChild(container);

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4;
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const duration = Math.random() * 1.5 + 1;
      const rotation = Math.random() * 720 - 360;

      piece.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        background:${color};
        border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
        left:${left}%;
        top:-10px;
        opacity:1;
        animation:confetti-fall ${duration}s ${delay}s ease-in forwards;
        transform:rotate(0deg);
      `;
      container.appendChild(piece);
    }

    // Inject keyframes once
    if (!document.getElementById("confetti-style")) {
      const style = document.createElement("style");
      style.id = "confetti-style";
      style.textContent = `
        @keyframes confetti-fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(var(--r, 360deg)); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Set random rotation per piece via CSS custom property
    container.querySelectorAll("div").forEach((el) => {
      (el as HTMLElement).style.setProperty("--r", `${Math.random() * 720 - 360}deg`);
    });

    setTimeout(() => container.remove(), 3000);
  }, []);

  return { celebrate };
}
