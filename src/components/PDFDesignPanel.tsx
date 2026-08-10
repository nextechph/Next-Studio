import React from 'react';
import { BrandingConfig, BrandingTheme } from '../types';
import { Palette, Check, Cpu, Terminal, Shield, Zap, Building2, MapPin, Mail, Globe, FileText, Sparkles, Eye } from 'lucide-react';

interface PDFDesignPanelProps {
  config: BrandingConfig;
  onUpdateConfig: (config: Partial<BrandingConfig>) => void;
  onCompile: () => void;
  isFormValid: boolean;
}

export default function PDFDesignPanel({
  config,
  onUpdateConfig,
  onCompile,
  isFormValid
}: PDFDesignPanelProps) {

  const themesList: {
    id: BrandingTheme;
    name: string;
    subLabel: string;
    description: string;
    fonts: string;
    colors: string;
    vibe: string;
    bgStyle: string;
    accentColor: string;
    badgeText: string;
  }[] = [
    {
      id: 'next-tech',
      name: 'NEXT_TECH',
      subLabel: 'Cyber Matrix Flagship',
      description: 'Flagship futuristic high-tech matrix layout with obsidian black & glowing emerald code rules.',
      fonts: 'Space Grotesk + JetBrains Mono',
      colors: 'Obsidian Black + Emerald Green',
      vibe: 'Flagship Cyber Tech',
      bgStyle: 'bg-zinc-950 text-emerald-400 border-emerald-500/40',
      accentColor: '#10b981',
      badgeText: 'FLAGSHIP'
    },
    {
      id: 'next-light',
      name: 'NEXT_LIGHT',
      subLabel: 'SaaS Platform Light',
      description: 'Clean future-facing high-tech aesthetic optimized for modern software platforms & startups.',
      fonts: 'Space Grotesk + Inter',
      colors: 'Crisp White + Slate + Emerald',
      vibe: 'Clean SaaS Platform',
      bgStyle: 'bg-white text-zinc-900 border-zinc-200',
      accentColor: '#059669',
      badgeText: 'LIGHT TECH'
    },
    {
      id: 'minimalist-outline',
      name: 'NEXT_BLUEPRINT',
      subLabel: 'Architectural CAD Mono',
      description: 'Stripped-back brutalist mono grid with high-contrast rules and raw code focus.',
      fonts: 'JetBrains Mono (All text)',
      colors: 'Ink Black + Crisp White',
      vibe: 'Architectural Mono',
      bgStyle: 'bg-black text-white border-white',
      accentColor: '#ffffff',
      badgeText: 'CAD MONO'
    },
    {
      id: 'executive-slate',
      name: 'NEXT_ENTERPRISE',
      subLabel: 'High-Tech Corporate',
      description: 'Sophisticated midnight slate headers with electric amber rules for enterprise software proposals.',
      fonts: 'Lora Serif + Inter',
      colors: 'Midnight Slate + Gold Amber',
      vibe: 'Enterprise Software',
      bgStyle: 'bg-slate-900 text-slate-100 border-amber-500/40',
      accentColor: '#f59e0b',
      badgeText: 'ENTERPRISE'
    },
    {
      id: 'nordic-cold',
      name: 'NEXT_QUANTUM',
      subLabel: 'Quantum Polar Sky',
      description: 'Clean polar cyan-sky quantum theme using deep corporate navy and turquoise details.',
      fonts: 'Space Grotesk + Inter',
      colors: 'Arctic Sky + Deep Navy',
      vibe: 'Quantum Computing',
      bgStyle: 'bg-sky-950 text-sky-100 border-cyan-400/40',
      accentColor: '#38bdf8',
      badgeText: 'QUANTUM'
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto" id="pdf-design-control-board">
      
      {/* Introduction Banner */}
      <div className="glass-card p-5 rounded-3xl flex items-start gap-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner shrink-0">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-white">
              PDF Customization & Company Profile
            </h3>
            <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              NEXT_TECH ENGINE
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
            Customize company header credentials, quotation terms, and select high-tech visual themes for PDF generation.
          </p>
        </div>
      </div>

      {/* ── 1. EDITABLE COMPANY & STUDIO DETAILS ──────────────────────── */}
      <div className="glass-panel p-6 rounded-3xl border border-white/12 shadow-2xl flex flex-col gap-4" id="company-details-editor-card">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-400" /> Studio & Company Profile (PDF Header & Footer)
          </span>
          <span className="text-[9px] font-mono text-white/30">Live Updates PDF Canvas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Company Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 flex items-center gap-1">
              <Building2 className="h-3 w-3 text-white/40" /> Company / Studio Name
            </label>
            <input
              type="text"
              placeholder="e.g. Next Technology Inc."
              value={config.approvedBy || ''}
              onChange={(e) => onUpdateConfig({ approvedBy: e.target.value })}
              className="w-full font-sans font-bold text-xs text-white glass-input bg-white/05 border border-white/12 focus:border-white/30 px-3.5 py-2.5 rounded-xl transition-all placeholder:text-white/25 outline-none shadow-inner"
            />
          </div>

          {/* Company HQ / Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-white/40" /> HQ / Address
            </label>
            <input
              type="text"
              placeholder="e.g. Silicon Oasis HQ, Bldg 4"
              value={config.approvedByHQ || ''}
              onChange={(e) => onUpdateConfig({ approvedByHQ: e.target.value })}
              className="w-full font-sans text-xs text-white glass-input bg-white/05 border border-white/12 focus:border-white/30 px-3.5 py-2.5 rounded-xl transition-all placeholder:text-white/25 outline-none shadow-inner"
            />
          </div>

          {/* Contact Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 flex items-center gap-1">
              <Mail className="h-3 w-3 text-white/40" /> Contact Email
            </label>
            <input
              type="email"
              placeholder="e.g. billing@next-technology.io"
              value={config.approvedByEmail || ''}
              onChange={(e) => onUpdateConfig({ approvedByEmail: e.target.value })}
              className="w-full font-mono text-xs text-white glass-input bg-white/05 border border-white/12 focus:border-white/30 px-3.5 py-2.5 rounded-xl transition-all placeholder:text-white/25 outline-none shadow-inner"
            />
          </div>

          {/* Website URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 flex items-center gap-1">
              <Globe className="h-3 w-3 text-white/40" /> Website URL
            </label>
            <input
              type="text"
              placeholder="e.g. www.next-technology.io"
              value={config.approvedByWeb || ''}
              onChange={(e) => onUpdateConfig({ approvedByWeb: e.target.value })}
              className="w-full font-mono text-xs text-white glass-input bg-white/05 border border-white/12 focus:border-white/30 px-3.5 py-2.5 rounded-xl transition-all placeholder:text-white/25 outline-none shadow-inner"
            />
          </div>
        </div>

        {/* Payment Terms & Conditions */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 flex items-center gap-1">
            <FileText className="h-3 w-3 text-emerald-400" /> Payment Terms & Studio Conditions (Rendered in PDF Summary Box)
          </label>
          <textarea
            rows={3}
            placeholder="e.g. 50% upfront deposit required. Remainder due upon visual acceptance & final project delivery."
            value={config.notes || ''}
            onChange={(e) => onUpdateConfig({ notes: e.target.value })}
            className="w-full text-xs text-white/80 glass-input bg-white/03 border border-white/10 focus:border-white/25 px-3.5 py-2.5 rounded-xl transition-all placeholder:text-white/25 outline-none resize-none min-h-[60px] leading-relaxed shadow-inner"
          />
        </div>
      </div>

      {/* ── 2. THEMES & SIMULATOR ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Theme Cubes Selector (Left 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/35 select-none flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" /> High-Tech PDF Visual Themes
          </span>

          {/* CUBE GRID FORMATION */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" id="theme-cubes-grid">
            {themesList.map((t) => {
              const isSelected = (config.theme || 'next-tech') === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onUpdateConfig({ theme: t.id })}
                  className={`w-full h-36 p-4 rounded-2xl transition-all cursor-pointer relative flex flex-col justify-between text-left overflow-hidden ${
                    isSelected
                      ? 'glass-card border-2 border-white bg-white/12 shadow-2xl scale-[1.02]'
                      : 'glass-panel border border-white/08 hover:border-white/25 hover:bg-white/06'
                  }`}
                  id={`cube-theme-${t.id}`}
                >
                  {/* Top Row: Theme Badge + Top Right White Dot Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-white/40 uppercase font-bold">
                      {t.badgeText}
                    </span>
                    {isSelected ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse" />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    )}
                  </div>

                  {/* Middle: Theme Name & SubLabel */}
                  <div className="flex flex-col min-w-0">
                    <h4 className="font-display font-bold text-xs text-white truncate leading-tight flex items-center gap-1">
                      {t.name}
                    </h4>
                    <span className="text-[9px] font-mono text-white/40 truncate mt-0.5">
                      {t.subLabel}
                    </span>
                  </div>

                  {/* Bottom Mini Color Strip */}
                  <div className={`p-1.5 rounded-lg border text-[8px] font-mono truncate ${t.bgStyle}`}>
                    <span>{t.vibe}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Visual Mockup Simulator (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 sticky top-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/35 select-none flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-emerald-400" /> Vector Theme Preview Simulator
          </span>

          <div className="glass-card p-5 rounded-3xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/08 pb-3">
              <h4 className="font-display font-bold text-xs text-white">
                Vector Engine
              </h4>
              <span className="text-[9px] font-mono text-emerald-400 font-bold glass-pill px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-white/10">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" /> Active Theme
              </span>
            </div>

            {/* Visual Mockup per Theme */}
            <div className="rounded-2xl overflow-hidden shadow-2xl p-4 relative min-h-[260px] flex flex-col justify-between transition-all duration-300"
              id="theme-mockup-canvas"
            >

              {/* 1. Flagship NEXT_TECH Matrix Mockup */}
              {((config.theme || 'next-tech') === 'next-tech') && (
                <div className="flex flex-col gap-3 font-mono w-full text-left bg-zinc-950 text-emerald-400 p-4 rounded-xl border border-emerald-500/40 shadow-2xl" id="mockup-next-tech">
                  <div className="flex justify-between items-center border-b border-emerald-500/30 pb-2">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-emerald-400" />
                      <div className="flex flex-col leading-none">
                        <span className="font-bold text-sm tracking-tight text-emerald-400 font-display">
                          {config.approvedBy || 'NEXT_TECH'}<span className="animate-pulse">_</span>
                        </span>
                        <span className="text-[7px] text-emerald-500/60 font-mono tracking-widest uppercase">MATRIX ENGINE v2026</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                      #{config.quoteNumber}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 py-1">
                    <div className="flex justify-between text-[8px] text-emerald-300 font-medium">
                      <span>01. Core Architecture</span>
                      <span>₱3,200.00</span>
                    </div>
                  </div>

                  <div className="border-t border-emerald-500/30 pt-2 flex justify-between items-center bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                    <span className="text-[8px] uppercase font-bold text-emerald-400/70">TOTAL ESTIMATE</span>
                    <span className="text-[10px] font-mono font-black text-emerald-400">₱4,860.00</span>
                  </div>
                </div>
              )}

              {/* 2. NEXT_LIGHT SaaS Platform Mockup */}
              {config.theme === 'next-light' && (
                <div className="flex flex-col gap-3 font-sans w-full text-left bg-white text-zinc-900 p-4 rounded-xl shadow-md" id="mockup-next-light">
                  <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                    <div className="flex flex-col">
                      <span className="font-display font-black text-sm tracking-tight text-zinc-900">
                        {config.approvedBy || 'NEXT_LIGHT'}<span className="text-emerald-500">.</span>PLATFORM
                      </span>
                      <span className="text-[8px] text-zinc-400 font-mono tracking-widest uppercase">HIGH-TECH SAAS CANVAS</span>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md font-bold">
                      #{config.quoteNumber}
                    </span>
                  </div>

                  <div className="border-t border-zinc-200 pt-2 flex justify-between items-center bg-zinc-50 p-2 rounded-lg">
                    <span className="text-[8px] uppercase font-bold text-zinc-500">NET CALCULATED TOTAL</span>
                    <span className="text-[10px] font-mono font-black text-zinc-900">₱4,860.00</span>
                  </div>
                </div>
              )}

              {/* 3. NEXT_BLUEPRINT Mono CAD Mockup */}
              {config.theme === 'minimalist-outline' && (
                <div className="flex flex-col gap-3 font-mono w-full text-left bg-black text-white p-4 rounded-xl border border-white shadow-2xl" id="mockup-minimalist-outline">
                  <div className="flex justify-between items-center border-b border-white pb-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-xs tracking-widest text-white uppercase">
                        {config.approvedBy || 'NEXT_BLUEPRINT'}
                      </span>
                      <span className="text-[7px] text-white/50 uppercase tracking-widest">CAD ARCHITECTURE</span>
                    </div>
                    <span className="text-[8px] font-mono border border-white px-2 py-0.5 uppercase">
                      #{config.quoteNumber}
                    </span>
                  </div>

                  <div className="border-t border-white pt-2 flex justify-between items-center bg-zinc-900 p-2 border">
                    <span className="text-[8px] uppercase font-bold text-white/70">TOTAL AMOUNT</span>
                    <span className="text-[10px] font-mono font-black text-white">₱4,860.00</span>
                  </div>
                </div>
              )}

              {/* 4. NEXT_ENTERPRISE Slate Amber Mockup */}
              {config.theme === 'executive-slate' && (
                <div className="flex flex-col gap-3 font-sans w-full text-left bg-slate-900 text-slate-100 p-4 rounded-xl border border-amber-500/40 shadow-xl" id="mockup-executive-slate">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <div className="flex flex-col">
                      <span className="font-serif font-black text-sm tracking-tight text-white">
                        {config.approvedBy || 'NEXT_ENTERPRISE'}
                      </span>
                      <span className="text-[7px] font-mono text-amber-400/80 uppercase tracking-widest">ENTERPRISE SOFTWARE</span>
                    </div>
                    <span className="text-[8px] font-mono bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                      #{config.quoteNumber}
                    </span>
                  </div>

                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center bg-slate-950/80 p-2 rounded-lg border border-amber-500/20">
                    <span className="text-[8px] font-serif text-slate-400 font-bold uppercase">Net Calculated Total</span>
                    <span className="text-[10px] font-mono font-black text-amber-400">₱4,860.00</span>
                  </div>
                </div>
              )}

              {/* 5. NEXT_QUANTUM Cyan Mockup */}
              {config.theme === 'nordic-cold' && (
                <div className="flex flex-col gap-3 font-sans w-full text-left bg-sky-950 text-sky-100 p-4 rounded-xl border border-sky-700 shadow-xl" id="mockup-nordic-cold">
                  <div className="flex justify-between items-center border-b border-sky-800 pb-2">
                    <div className="flex flex-col">
                      <span className="font-display font-black text-sm tracking-tight text-white">
                        {config.approvedBy || 'NEXT_QUANTUM'}
                      </span>
                      <span className="text-[7px] font-mono text-sky-300 uppercase tracking-widest">QUANTUM SPEC</span>
                    </div>
                    <span className="text-[7px] font-mono bg-sky-900 text-cyan-300 px-2 py-0.5 rounded-full font-bold border border-cyan-400/30">
                      #{config.quoteNumber}
                    </span>
                  </div>

                  <div className="border-t border-sky-800 pt-2 flex justify-between items-center bg-sky-900/60 p-2 rounded-lg border border-cyan-400/20">
                    <span className="text-[8px] uppercase font-bold text-sky-300">Quantum Total Sum</span>
                    <span className="text-[10px] font-mono font-black text-cyan-300">₱4,860.00</span>
                  </div>
                </div>
              )}

              {/* Page Indicator */}
              <div className="flex items-center justify-between text-[8px] font-mono text-white/30 pt-2 border-t border-white/06">
                <span>NEXT_TECH VECTOR ENGINE</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full" /> Live Vector
                </span>
              </div>
            </div>

            <p className="text-[11px] text-white/35 leading-relaxed text-left">
              The finalized A4 PDF layout utilizes Next Technology high-tech vector rules, custom header scaling, and high-resolution rendering.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
