import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface GlassSelectOption {
  value: string | number;
  label: string;
  subLabel?: string;
}

interface GlassSelectProps {
  value: string | number;
  onChange: (val: any) => void;
  options: GlassSelectOption[];
  placeholder?: string;
  className?: string;
  id?: string;
  position?: 'bottom' | 'top';
  align?: 'left' | 'right';
}

export default function GlassSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  id,
  position = 'bottom',
  align = 'left',
}: GlassSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => String(o.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isTop = position === 'top';

  return (
    <div
      ref={containerRef}
      className={`relative w-full text-left select-none transition-all ${
        isOpen ? 'z-[99999]' : 'z-1'
      }`}
      id={id}
    >
      {/* Liquid Glass Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-3.5 py-2 text-xs rounded-xl glass-input border border-white/12 hover:border-white/25 transition-all outline-none flex items-center justify-between gap-2 cursor-pointer shadow-lg backdrop-blur-xl ${className}`}
      >
        <span className="font-sans font-medium text-white truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-white/40 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* 3D Animated Liquid Glass Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateX: isTop ? 10 : -10, y: isTop ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: isTop ? -4 : 4 }}
            exit={{ opacity: 0, scale: 0.96, rotateX: isTop ? 6 : -6, y: isTop ? 2 : -2 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            style={{ transformStyle: 'preserve-3d', perspective: 800 }}
            className={`absolute z-[99999] min-w-full w-max border border-white/20 border-t-white/40 bg-[#0c0c0f]/95 backdrop-blur-3xl shadow-2xl shadow-black/80 p-1.5 rounded-2xl flex flex-col gap-1 max-h-60 overflow-y-auto ${
              align === 'right' ? 'right-0' : 'left-0'
            } ${isTop ? 'bottom-full mb-1.5' : 'top-full mt-1.5'}`}
          >
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-sans transition-all text-left flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-white/15 text-white font-bold border border-white/20 shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/08'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{opt.label}</span>
                    {opt.subLabel && <span className="text-[10px] text-white/30">{opt.subLabel}</span>}
                  </div>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-2 w-2 rounded-full bg-white shadow-sm shadow-white/50 shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
