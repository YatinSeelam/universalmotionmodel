"use client"

import { Sparkles } from "@/components/ui/sparkles"
import { useState } from "react"

export function SparklesDemo() {
  const [hasError, setHasError] = useState(false)

  // Fail silently if sparkles don't work
  if (hasError) {
    return null
  }

  return (
    <div className="relative w-full overflow-visible mt-0 pb-4">
      <div className="relative mt-0 h-32 w-full overflow-visible [mask-image:radial-gradient(50%_50%,white,transparent)]">
        <div className="absolute -left-1/2 bottom-[-20px] aspect-[1/0.7] z-10 w-[200%] rounded-[100%] border-t border-white/20 bg-transparent" />
        <div onError={() => setHasError(true)}>
          <Sparkles
            density={1200}
            className="absolute inset-x-0 -bottom-20 h-[calc(100%+80px)] w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
            color="#ffffff"
          />
        </div>
      </div>
    </div>
  )
}

