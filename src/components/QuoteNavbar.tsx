import React from 'react';
import { Sparkles, FileCheck2, Calculator } from 'lucide-react';
import { motion } from 'motion/react';
import NextLogo from './NextLogo';

interface NavbarProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  totalAmount: number;
  itemCount: number;
  onCompilePDF: () => void;
  activePanel?: string;
}

export default function QuoteNavbar({
  isDarkTheme,
  onToggleTheme,
  totalAmount,
  itemCount,
  onCompilePDF,
  activePanel
}: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
      className="sticky top-0 z-30 px-4 pt-4 pb-2"
      id="quote-navbar"
    >
      <div className="glass-panel rounded-2xl px-5 py-3 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-3" id="navbar-brand">
          <NextLogo className="h-7 w-7 text-white shrink-0 drop-shadow-sm" />
          <div className="flex flex-col select-none">
            <span className="font-display font-black text-sm tracking-tight text-white leading-none">
              NEXT STUDIO
            </span>
            <span className="text-[9px] font-mono text-white/30 tracking-[0.2em] uppercase leading-none mt-0.5">
              Project Costing Engine
            </span>
          </div>
        </div>

        {/* Center: live metrics */}
        <div className="hidden md:flex items-center gap-4" id="navbar-metrics">
          <div className="glass-pill flex items-center gap-3 px-4 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-medium">
              <Calculator className="h-3.5 w-3.5" />
              <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </div>
            <span className="h-3 w-px bg-white/10" />
            <div className="flex items-center gap-1">
              <span className="text-[9px] uppercase font-bold text-white/25">Total:</span>
              <motion.span
                key={totalAmount}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="font-mono font-bold text-sm text-white"
              >
                ₱{totalAmount.toLocaleString()}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2" id="navbar-actions">
          <button
            type="button"
            onClick={onCompilePDF}
            className="glass-btn-primary py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
            id="navbar-export-btn"
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
