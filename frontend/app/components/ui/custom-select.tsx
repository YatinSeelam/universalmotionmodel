"use client";

import { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  className?: string;
}

export function CustomSelect({ value, onChange, options, required, className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div ref={selectRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white",
          "focus:ring-2 focus:ring-white/50 focus:border-white/40 focus:outline-none",
          "transition-all appearance-none cursor-pointer pr-9",
          "hover:bg-white/15 hover:border-white/30",
          "flex items-center justify-between"
        )}
      >
        <span className="text-left">{selectedOption.label}</span>
        <svg
          className={cn(
            "w-4 h-4 text-white/80 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white/95 backdrop-blur-md border border-white/30 rounded-lg shadow-2xl overflow-hidden" style={{ 
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)'
        }}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-sm text-left transition-all",
                "hover:bg-white/20",
                value === option.value ? "bg-white/10 text-gray-900 font-medium" : "text-gray-700",
                "flex items-center gap-2"
              )}
            >
              {value === option.value && (
                <svg className="w-3.5 h-3.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span className={value === option.value ? "" : "ml-5"}>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

