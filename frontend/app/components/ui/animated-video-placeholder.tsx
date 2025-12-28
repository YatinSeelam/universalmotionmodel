"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedVideoPlaceholder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(35); // Start with initial rotation

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const elementCenter = elementTop + elementHeight / 2;
      
      // Initial rotation
      const initialRotation = 35;
      
      // Animation range: from 80% viewport height to 50% (center)
      const startPoint = windowHeight * 0.8;
      const endPoint = windowHeight * 0.5;
      
      let currentRotation = initialRotation;
      
      // If element center is above start point, keep rotated
      if (elementCenter > startPoint) {
        currentRotation = initialRotation;
      } 
      // If element center is between start and end, animate
      else if (elementCenter > endPoint) {
        const progress = (startPoint - elementCenter) / (startPoint - endPoint);
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const easedProgress = 1 - Math.pow(1 - clampedProgress, 3);
        currentRotation = initialRotation * (1 - easedProgress);
      } 
      // If element center is at or below end point, stay at 0
      else {
        currentRotation = 0;
      }
      
      setRotation(currentRotation);
    };

    // Use requestAnimationFrame for smoother animation
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Call immediately to set initial rotation
    setTimeout(() => handleScroll(), 100);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="mt-0 max-w-3xl mx-auto" 
      style={{ 
        perspective: "1200px",
        perspectiveOrigin: "center center"
      }}
    >
      <div
        className="relative w-full aspect-video rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden"
        style={{
          transform: `rotateX(${rotation}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white/80 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
