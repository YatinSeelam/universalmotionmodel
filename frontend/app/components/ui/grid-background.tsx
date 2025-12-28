"use client";

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const GridBackground = ({ className, children }: GridBackgroundProps) => {
  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Grid Background with Purple Gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "transparent",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.12) 0%, rgba(109,40,217,0.04) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

