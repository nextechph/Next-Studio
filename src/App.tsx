import React, { useState, useEffect } from 'react';
import { ClientDetails, QuotationItem, BrandingConfig, SavedQuote } from './types';
import ClientDetailsForm from './components/ClientDetailsForm';
import LineItemsSection from './components/LineItemsSection';
import PDFDesignPanel from './components/PDFDesignPanel';
import PDFPreview from './components/PDFPreview';
import QuotationHistory from './components/QuotationHistory';
import NextLogo from './components/NextLogo';
import {
  Sparkles, User, Briefcase, Palette, History,
  FileCheck2, X, CheckCircle2, Circle, Calendar, Clock, Tag, Eye, Plus
} from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'motion/react';

import { getLocalTodayDate, getLocalFutureDate } from './utils/dateUtils';

/* ── Defaults ─────────────────────────────────────────────── */
const DEFAULT_CLIENT: ClientDetails = {
  name: '', contactNumber: '', email: '', companyName: '', address: '',
  projectDescription: '', clientType: 'professional', professionalTier: 'starter',
  basePrice: 0, targetTimeline: 'standard',
};

const DEFAULT_ITEMS: QuotationItem[] = [];

type Panel = 'client' | 'services' | 'design' | 'history';

const TABS: { id: Panel; icon: React.ElementType; label: string; sub: string }[] = [
  { id: 'client',   icon: User,      label: 'Client Info', sub: 'Step 1' },
  { id: 'services', icon: Briefcase, label: 'Services',    sub: 'Step 2' },
  { id: 'design',   icon: Palette,   label: 'Customize',   sub: 'Step 3' },
  { id: 'history',  icon: History,   label: 'History',     sub: 'Archive' },
];

/* ── Spring Animated Number ───────────────────────────────── */
function AnimatedTotal({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const sp = useSpring(mv, { stiffness: 160, damping: 22 });
  const [display, setDisplay] = useState(value);
  useEffect(() => { mv.set(value); }, [value]);
  useEffect(() => sp.on('change', v => setDisplay(Math.round(v))), [sp]);
  return <>{display.toLocaleString()}</>;
}

/* ── Live Clock & Date Badge ─────────────────────────────── */
function LiveDateTimeBadge({ quoteNumber }: { quoteNumber: string }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="flex flex-col gap-2 font-mono text-xs text-white/60 w-full" id="sidebar-meta-badges">
      <div className="flex items-center gap-2 glass-pill px-3.5 py-2 rounded-xl border border-white/10 w-full">
        <Tag className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        <span className="font-bold text-white/90 truncate">Quote #{quoteNumber}</span>
      </div>

      <div className="flex items-center gap-2 glass-pill px-3.5 py-2 rounded-xl border border-white/10 w-full">
        <Calendar className="h-3.5 w-3.5 text-white/40 shrink-0" />
        <span className="truncate">{formattedDate}</span>
      </div>

      <div className="flex items-center gap-2 glass-pill px-3.5 py-2 rounded-xl border border-white/10 w-full">
        <Clock className="h-3.5 w-3.5 text-white/40 shrink-0" />
        <span className="truncate">{formattedTime}</span>
      </div>
    </div>
  );
}

/* ── App ──────────────────────────────────────────────────── */
export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>('client');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfModalMode, setPdfModalMode] = useState<'preview' | 'generate'>('generate');
  const [showValidation, setShowValidation] = useState(false);

  const [client, setClient] = useState<ClientDetails>(() => {
    const s = localStorage.getItem('next_quote_client');
    if (s) {
      const p = JSON.parse(s);
      if (!p.clientType) { p.clientType = 'professional'; p.professionalTier = 'starter'; }
      p.basePrice = 0;
      if (!p.targetTimeline) p.targetTimeline = 'standard';
      return p;
    }
    return DEFAULT_CLIENT;
  });

  const [items, setItems] = useState<QuotationItem[]>(() => {
    const s = localStorage.getItem('next_quote_items'); return s ? JSON.parse(s) : DEFAULT_ITEMS;
  });

  const [config, setConfig] = useState<BrandingConfig>(() => {
    const s = localStorage.getItem('next_quote_config');
    const today = getLocalTodayDate();
    if (s) {
      const p = JSON.parse(s);
      if (!p.notes?.trim()) p.notes = "Payment: 50% upfront, remainder on delivery.";
      if (!p.approvedBy) p.approvedBy = "Next Technology Inc.";
      if (!p.approvedByHQ) p.approvedByHQ = "One Epicenter Way, Silicon Oasis";
      if (!p.approvedByEmail) p.approvedByEmail = "studio@nexttech.co";
      if (!p.approvedByWeb) p.approvedByWeb = "www.nexttechnology.dev";
      if (!p.currency) p.currency = 'PHP';
      if (!p.currencySymbol) p.currencySymbol = '₱';
      if (!p.currencyName) p.currencyName = 'Philippine Peso';
      if (!p.documentType) p.documentType = 'receipt';
      // Sync past or outdated issueDate to today's local date (Sept 18, 2026)
      if (!p.issueDate || p.issueDate < today) {
        p.issueDate = today;
        p.expiryDate = getLocalFutureDate(30, today);
      }
      return p;
    }
    return {
      theme: 'next-light', quoteNumber: `NT-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      issueDate: today, expiryDate: getLocalFutureDate(30, today),
      documentType: 'receipt',
      notes: "Payment: 50% upfront, remainder on delivery.", terms: '', discount: 0, taxRate: 0,
      enableDiscount: false, enableTax: false,
      currency: 'PHP', currencySymbol: '₱', currencyName: 'Philippine Peso',
      approvedBy: "Next Technology Inc.", approvedByHQ: "One Epicenter Way, Silicon Oasis",
      approvedByEmail: "studio@nexttech.co", approvedByWeb: "www.nexttechnology.dev",
    };
  });

  const [history, setHistory] = useState<SavedQuote[]>(() => {
    const s = localStorage.getItem('next_quote_history'); return s ? JSON.parse(s) : [];
  });

  useEffect(() => { localStorage.setItem('next_quote_client', JSON.stringify(client)); }, [client]);
  useEffect(() => { localStorage.setItem('next_quote_items', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('next_quote_config', JSON.stringify(config)); }, [config]);
  useEffect(() => { localStorage.setItem('next_quote_history', JSON.stringify(history)); }, [history]);

  const hasDiscount = config.enableDiscount ?? false;
  const hasTax      = config.enableTax ?? false;
  const currencySymbol = config.currencySymbol || '₱';

  const sub   = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const disc  = hasDiscount ? sub * (config.discount / 100) : 0;
  const tax   = hasTax ? (sub - disc) * (config.taxRate / 100) : 0;
  const total = Math.round(sub - disc + tax);

  const isValid = client.name.trim().length > 0 && client.contactNumber.trim().length > 0 && client.email.trim().length > 0;
  useEffect(() => { if (isValid) setShowValidation(false); }, [client, isValid]);

  const saveSnap = () => setHistory(p => [{
    id: `snap_${Date.now()}`, clientDetails: { ...client }, items: [...items],
    config: { ...config }, totalAmount: total, createdAt: new Date().toISOString(),
  }, ...p]);

  const handleUpdateClient = (fields: Partial<ClientDetails>) => {
    if (fields.clientType && fields.clientType !== client.clientType) {
      if (items.length > 0) {
        // Auto-save snapshot of the previous project so no work is lost
        saveSnap();
        // Clear items so the newly chosen project category starts fresh
        setItems([]);
      }
    }
    setClient((prev) => ({ ...prev, ...fields }));
  };

  const handleStartNewQuote = () => {
    if (items.length > 0 || client.name.trim()) {
      saveSnap();
    }
    setClient({
      name: '', contactNumber: '', email: '', companyName: '', address: '',
      projectDescription: '', clientType: client.clientType || 'student',
      professionalTier: 'starter', basePrice: 0, targetTimeline: 'standard',
    });
    setItems([]);
    const today = getLocalTodayDate();
    setConfig((prev) => ({
      ...prev,
      quoteNumber: `NT-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      issueDate: today,
      expiryDate: getLocalFutureDate(30, today),
    }));
    setActivePanel('client');
  };

  const handleGenerate = () => {
    if (!isValid) { setShowValidation(true); setActivePanel('client'); return; }
    setPdfModalMode('generate');
    setIsPreviewOpen(true);
  };

  const handlePreview = () => {
    if (!isValid) { setShowValidation(true); setActivePanel('client'); return; }
    setPdfModalMode('preview');
    setIsPreviewOpen(true);
  };

  const flowOrder: Panel[] = ['client', 'services', 'design'];
  const flowIdx = flowOrder.indexOf(activePanel);

  const progressSteps = [
    { label: 'Client details', done: isValid },
    { label: 'Services added', done: items.length > 0 },
    { label: 'Ready to export', done: isValid && items.length > 0 },
  ];

  return (
    <div className="dark min-h-screen bg-black text-white font-sans antialiased relative overflow-x-hidden" id="app-root">

      {/* ── Background texture ──────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />

      {/* ══ FULL HEIGHT LEFT SIDEBAR (Desktop >=1024px) ════════════════════════ */}
      <aside
        className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[250px] xl:w-[260px] z-30 flex-col justify-between p-5 sidebar-glass border-r border-white/10 overflow-y-auto"
        id="full-left-sidebar"
      >
        <div className="flex flex-col gap-6">
          
          {/* App Brand Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/08">
            <NextLogo className="h-9 w-9 text-white shrink-0 drop-shadow-md" />
            <div className="flex flex-col leading-none min-w-0">
              <span className="font-display font-black text-base tracking-tight text-white truncate">NEXT STUDIO</span>
              <span className="text-[9px] font-mono text-white/30 tracking-[0.2em] uppercase mt-1 truncate">PROJECT COSTING SYSTEM</span>
            </div>
          </div>

          {/* Quotation Number, Date & Time Metadata Badges */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/30">Metadata</span>
            <LiveDateTimeBadge quoteNumber={config.quoteNumber} />
          </div>

          {/* Vertical Section Navigation Tabs */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/30">Navigation</span>
            <div className="glass-panel p-2 rounded-2xl flex flex-col gap-1.5 border border-white/10" id="full-sidebar-nav-tabs">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activePanel === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActivePanel(tab.id)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-white text-black shadow-lg shadow-white/10 font-bold'
                        : 'text-white/40 hover:text-white hover:bg-white/06 font-medium'
                    }`}
                    id={`sidebar-tab-btn-${tab.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-black' : 'text-white/40'}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.id === 'history' && history.length > 0 && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-black text-white' : 'bg-white/20 text-white'
                      }`}>
                        {history.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleStartNewQuote}
              className="glass-btn-ghost w-full py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer border border-white/10 text-white/70 hover:text-white hover:bg-white/06 shadow-sm"
              id="sidebar-new-quote-btn"
              title="Start a fresh quotation (auto-saves current draft to history)"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-400" /> New Quotation
            </button>
            <button
              type="button"
              onClick={saveSnap}
              className="glass-btn-ghost w-full py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer border border-white/10 text-white/50 hover:text-white"
              id="sidebar-save-draft-btn"
            >
              Save Draft
            </button>
          </div>

        </div>

        {/* Completion Checklist Footer */}
        <div className="flex flex-col gap-2 pt-6 border-t border-white/08">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/30">Completion Status</span>
          <div className="flex flex-col gap-2">
            {progressSteps.map((step) => (
              <div key={step.label} className="flex items-center gap-2 text-xs">
                {step.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-white/20 shrink-0" />
                )}
                <span className={step.done ? 'text-white/80 font-medium' : 'text-white/30'}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ══ MAIN WORKSPACE CONTENT CONTAINER (RESPONSIVE FOR MOBILE & DESKTOP) ════ */}
      <div className="ml-0 lg:ml-[250px] xl:ml-[260px] mr-0 xl:mr-[310px] p-3 sm:p-6 lg:p-8 relative z-10 pb-36 lg:pb-28 xl:pb-8" id="main-content-wrapper">
        <div className="max-w-5xl mx-auto flex flex-col gap-6" id="main-workspace-card-container">
          <div className="glass-card-static p-6 sm:p-8 rounded-3xl relative overflow-visible" id="main-workspace-card">
            
            {/* Workspace Header */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/08">
              <div>
                <h1 className="font-display font-black text-2xl text-white tracking-tight">
                  {activePanel === 'client' && 'Client Details'}
                  {activePanel === 'services' && 'Services & Scope'}
                  {activePanel === 'design' && 'Customize PDF Theme'}
                  {activePanel === 'history' && 'Saved Proposal History'}
                </h1>
                <p className="text-xs text-white/35 mt-1">
                  {activePanel === 'client' && 'Enter contact credentials and select project category.'}
                  {activePanel === 'services' && 'Select preset packages or build custom deliverable lines.'}
                  {activePanel === 'design' && 'Choose color themes, branding details, and legal terms.'}
                  {activePanel === 'history' && 'Restore previous quotation drafts or manage saved snapshots.'}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-white/30 glass-pill px-3 py-1.5 rounded-xl">
                <span>STEP {flowIdx >= 0 ? flowIdx + 1 : 1} OF 3</span>
              </div>
            </div>

            {/* Panel Component Rendering */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                {activePanel === 'client' && (
                  <ClientDetailsForm
                    details={client}
                    onUpdate={handleUpdateClient}
                    showValidationErrors={showValidation}
                  />
                )}

                {activePanel === 'services' && (
                  <LineItemsSection
                    items={items}
                    config={config}
                    onUpdateItems={setItems}
                    onUpdateConfig={(f) => setConfig((prev) => ({ ...prev, ...f }))}
                    clientType={client.clientType}
                  />
                )}

                {activePanel === 'design' && (
                  <PDFDesignPanel
                    config={config}
                    onUpdateConfig={(f) => setConfig((prev) => ({ ...prev, ...f }))}
                    onCompile={handleGenerate}
                    isFormValid={isValid}
                  />
                )}

                {activePanel === 'history' && (
                  <QuotationHistory
                    history={history}
                    onLoadQuote={(q) => {
                      setClient(q.clientDetails);
                      setItems(q.items);
                      setConfig(q.config);
                      setActivePanel('client');
                    }}
                    onDeleteQuote={(id) => setHistory((prev) => prev.filter((q) => q.id !== id))}
                    onSaveCurrentSnapshot={saveSnap}
                    activeCurrency={config.currency || 'PHP'}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Footer */}
            {activePanel !== 'history' && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/08 relative z-0">
                <button
                  type="button"
                  onClick={() => flowIdx > 0 && setActivePanel(flowOrder[flowIdx - 1])}
                  className={`text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition cursor-pointer ${
                    flowIdx === 0 ? 'invisible' : ''
                  }`}
                >
                  ← Back
                </button>

                {activePanel === 'design' ? (
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="glass-btn-primary px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Eye className="h-4 w-4 text-black" /> Preview PDF
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => flowIdx < flowOrder.length - 1 && setActivePanel(flowOrder[flowIdx + 1])}
                    className="glass-btn-primary px-7 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                  >
                    Next Step →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ FULL HEIGHT RIGHT FREEZE SIDEBAR (Desktop >=1280px) ═════════ */}
      <aside
        className="hidden xl:flex fixed top-0 right-0 bottom-0 w-[290px] xl:w-[310px] z-30 flex-col justify-between p-5 sidebar-glass border-l border-white/10 overflow-y-auto"
        id="full-right-freeze-sidebar"
      >
        <div className="flex flex-col gap-4">
          
          {/* Live Quote Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/08">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/80">Live Quote Summary</span>
            </div>
            <span className="text-[10px] font-mono text-white/30">{items.length} items</span>
          </div>

          {/* Total Estimate Block */}
          <div className="glass-panel p-4 xl:p-5 rounded-2xl flex flex-col gap-1 border border-white/10" id="live-total-block">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/35">Total Estimate</span>
            <div className="font-mono font-black text-2xl xl:text-3xl text-white tracking-tight mt-0.5">
              {currencySymbol}<AnimatedTotal value={total} />
            </div>

            {(hasDiscount || hasTax) ? (
              <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-white/30">
                {hasDiscount && <span>{config.discount}% discount</span>}
                {hasDiscount && hasTax && <span>·</span>}
                {hasTax && <span>{config.taxRate}% tax</span>}
              </div>
            ) : (
              <div className="text-[10px] font-mono text-white/25 mt-1">Net Total</div>
            )}
          </div>

          {/* Client Info Summary */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/30">Client</span>
            {client.name ? (
              <div className="glass-panel p-3 rounded-xl flex flex-col gap-0.5 border border-white/08">
                <p className="font-bold text-xs text-white truncate">{client.name}</p>
                {client.companyName && <p className="text-[11px] text-white/40 truncate">{client.companyName}</p>}
                {client.email && <p className="text-[11px] text-white/30 truncate">{client.email}</p>}
              </div>
            ) : (
              <div className="glass-panel p-3 rounded-xl border border-dashed border-white/10">
                <p className="text-xs text-white/25 italic">No client details entered</p>
              </div>
            )}
          </div>

          {/* Deliverable Services List (Dynamic Scroll Pane for Many Line Items) */}
          <div className="flex flex-col gap-1.5 flex-1 min-h-[80px]">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-white/30">
              <span>Services ({items.length})</span>
              <span>Subtotal</span>
            </div>
            <div className="flex flex-col gap-2 max-h-[180px] xl:max-h-[240px] overflow-y-auto pr-1" id="live-services-scroll-pane">
              <AnimatePresence>
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: idx * 0.03, duration: 0.15 }}
                      className="glass-panel p-2.5 rounded-xl flex items-center justify-between gap-2 border border-white/06"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white/80 truncate">{item.title}</p>
                        <p className="text-[10px] text-white/30 font-mono">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-white/60 shrink-0">
                        {currencySymbol}{(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass-panel p-3.5 rounded-xl border border-dashed border-white/10">
                    <p className="text-xs text-white/25 italic">No services added yet</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Detailed Calculation Breakdown */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2 border border-white/08" id="live-calculation-breakdown">
            <div className="flex items-center justify-between text-xs text-white/50 font-sans">
              <span>Subtotal</span>
              <span className="font-mono font-semibold text-white/70">{currencySymbol}{sub.toLocaleString()}</span>
            </div>

            {hasDiscount && (
              <div className="flex items-center justify-between text-xs text-white/40 font-sans">
                <span>Discount ({config.discount}%)</span>
                <span className="font-mono text-white/40">-{currencySymbol}{Math.round(disc).toLocaleString()}</span>
              </div>
            )}

            {hasTax && (
              <div className="flex items-center justify-between text-xs text-white/40 font-sans">
                <span>Tax ({config.taxRate}%)</span>
                <span className="font-mono text-white/40">+{currencySymbol}{Math.round(tax).toLocaleString()}</span>
              </div>
            )}

            <div className="pt-2 mt-1 border-t border-white/08 flex items-center justify-between">
              <span className="font-bold text-xs text-white">Final Total</span>
              <span className="font-mono font-black text-base text-white">
                {currencySymbol}<AnimatedTotal value={total} />
              </span>
            </div>
          </div>

        </div>

        {/* Export Action Button (Pinned at Bottom of Right Sidebar) */}
        <div className="pt-3 border-t border-white/08">
          <button
            type="button"
            onClick={handleGenerate}
            className="glass-btn-primary w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            id="live-quote-export-btn"
          >
            Generate PDF
          </button>
        </div>
      </aside>

      {/* ══ MOBILE LIQUID GLASS BOTTOM NAVIGATION BAR (<1024px) ════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-2.5 bg-black/92 backdrop-blur-2xl border-t border-white/12 flex flex-col gap-2 shadow-[0_-10px_30px_rgba(0,0,0,0.9)]"
        id="mobile-bottom-nav-bar"
      >
        {/* Top Summary & Quick Actions Row */}
        <div className="flex items-center justify-between gap-3 px-1 pb-1.5 border-b border-white/08">
          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/35">Total Estimate</span>
            <span className="font-mono font-black text-xs sm:text-sm text-white mt-0.5">
              {currencySymbol}{Math.round(total).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreview}
              className="glass-btn-ghost px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-white border border-white/20 flex items-center gap-1 cursor-pointer"
            >
              <Eye className="h-3 w-3 text-white/80" /> Preview
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-black flex items-center justify-center gap-1 cursor-pointer shadow-md"
            >
              Generate PDF
            </button>
          </div>
        </div>

        {/* Bottom 4-Tab Navigation Bar */}
        <div className="grid grid-cols-4 gap-1 select-none" id="mobile-bottom-tabs-grid">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePanel === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePanel(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-white text-black font-extrabold shadow-lg scale-[1.02]'
                    : 'text-white/40 hover:text-white hover:bg-white/05 font-medium'
                }`}
                id={`mobile-bottom-tab-${tab.id}`}
              >
                <div className="relative">
                  <Icon className={`h-4 w-4 mb-0.5 ${isActive ? 'text-black' : 'text-white/40'}`} />
                  {tab.id === 'history' && history.length > 0 && (
                    <span className={`absolute -top-1 -right-2 text-[7.5px] font-mono font-black px-1 rounded-full ${
                      isActive ? 'bg-black text-white' : 'bg-white/30 text-white'
                    }`}>
                      {history.length}
                    </span>
                  )}
                </div>
                <span className="leading-none tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ══ TABLET ONLY BOTTOM QUICK BAR (1024px - 1279px) ════ */}
      <div className="hidden lg:flex xl:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-black/90 backdrop-blur-2xl border-t border-white/12 items-center justify-between gap-3 px-6 shadow-2xl" id="tablet-quick-action-bar">
        <div className="flex flex-col leading-none">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/35">Total Estimate</span>
          <span className="font-mono font-black text-sm text-white mt-1">{currencySymbol}{Math.round(total).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreview}
            className="glass-btn-ghost px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white border border-white/20 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Eye className="h-3.5 w-3.5 text-white/80" /> Preview
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="glass-btn-primary px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-black flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
          >
            Generate PDF
          </button>
        </div>
      </div>

      {/* ══ PDF PREVIEW OVERLAY ═════════════════════════════ */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/92 backdrop-blur-3xl z-50 flex flex-col overflow-y-auto"
            id="pdf-preview-overlay"
          >
            {/* Modal Top Header Bar (Mobile Optimized) */}
            <div className="sticky top-0 glass-panel border-b border-white/08 p-3 sm:p-4 flex items-center justify-between px-3 sm:px-6 z-10 backdrop-blur-2xl gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-white/70 hover:text-white glass-pill px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition cursor-pointer shrink-0 border border-white/12"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Return to Editor</span>
              </button>

              <div className="flex items-center gap-1.5 glass-pill px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl border border-white/10 shrink-0">
                <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${pdfModalMode === 'generate' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span className={`font-mono text-[9.5px] sm:text-xs font-bold uppercase tracking-wider ${pdfModalMode === 'generate' ? 'text-emerald-400' : 'text-amber-300'}`}>
                  {pdfModalMode === 'generate' ? 'Export Ready' : 'PDF Preview · Read Only'}
                </span>
              </div>

              <span className="hidden md:inline-block font-display text-xs text-white/30 font-bold uppercase tracking-widest shrink-0">NEXT STUDIO</span>
            </div>

            <div className="flex-1 py-4 sm:py-8 px-3 sm:px-6">
              <div className="max-w-6xl mx-auto w-full">
                <PDFPreview
                  clientDetails={client}
                  items={items}
                  config={config}
                  onUpdateConfig={(f) => setConfig((prev) => ({ ...prev, ...f }))}
                  isFormValid={isValid}
                  mode={pdfModalMode}
                  onSaveToHistory={(t) =>
                    setHistory((prev) => [
                      {
                        id: `pdf_${Date.now()}`,
                        clientDetails: { ...client },
                        items: [...items],
                        config: { ...config },
                        totalAmount: t,
                        createdAt: new Date().toISOString(),
                      },
                      ...prev,
                    ])
                  }
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
