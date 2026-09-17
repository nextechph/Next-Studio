import React, { useState } from 'react';
import { QuotationItem, BrandingConfig } from '../types';
import { SERVICE_PRESETS, ServicePreset } from '../data/presets';
import { Plus, Trash2, Tag, Percent, Receipt, Sparkles, Filter, Layers, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GlassSelect from './GlassSelect';

const STUDENT_ADDONS = [
  { id: 'addon-additional-page', title: 'Additional Page', price: 1000, category: 'Development', description: 'Additional tailored content page with fully styled sections.' },
  { id: 'addon-contact-form', title: 'Contact Form', price: 500, category: 'Development', description: 'Interactive contact submission form block with field validations.' },
  { id: 'addon-portfolio-gallery', title: 'Portfolio / Gallery Section', price: 1500, category: 'Design', description: 'Rich visual responsive grid for showcase assets with hover effects.' },
  { id: 'addon-blog-setup', title: 'Blog Setup', price: 1000, category: 'Development', description: 'Dynamic list view with simplified text template layouts for posts.' },
  { id: 'addon-animations', title: 'Animations & Interactions', price: 1000, category: 'Design', description: 'Smooth fluid entry animations, hover actions, and page transitions.' },
  { id: 'addon-domain-setup', title: 'Custom Domain Setup', price: 700, category: 'Consulting', description: 'Domain routing, SSL setup, and production hosting configuration.' },
  { id: 'addon-logo-branding', title: 'Logo / Branding Design', price: 2500, category: 'Design', description: 'Curated custom professional emblem drafts and brand guide.' },
  { id: 'addon-extra-revision', title: 'Extra Revision Round', price: 800, category: 'Consulting', description: 'One additional iteration feedback review cycle.' },
  { id: 'addon-rush-delivery', title: 'Rush Delivery (under 2 weeks)', price: 2500, category: 'Consulting', description: 'Accelerated prioritised execution with high feedback velocity.' }
];

interface LineItemsProps {
  items: QuotationItem[];
  config: BrandingConfig;
  onUpdateItems: (items: QuotationItem[]) => void;
  onUpdateConfig: (config: Partial<BrandingConfig>) => void;
  clientType?: 'student' | 'professional';
}

const categories = ['All', 'Development', 'Design', 'E-Commerce', 'Security & DB', 'Consulting'];

export default function LineItemsSection({ items, config, onUpdateItems, onUpdateConfig, clientType }: LineItemsProps) {
  const [filterCategory, setFilterCategory] = useState('All');

  // Add a blank deliverable line
  const addBlankItem = () => {
    onUpdateItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        title: '',
        description: '',
        unitPrice: 0,
        quantity: 1,
        category: 'Development',
      },
    ]);
  };

  const removeItem = (id: string) => onUpdateItems(items.filter((item) => item.id !== id));

  const updateItemField = (id: string, field: keyof QuotationItem, value: any) => {
    onUpdateItems(
      items.map((item) =>
        item.id === id
          ? { ...item, [field]: field === 'unitPrice' || field === 'quantity' ? Number(value) : value }
          : item
      )
    );
  };

  const appendPreset = (preset: ServicePreset) => {
    onUpdateItems([
      ...items,
      ...preset.items.map((pi, i) => ({
        id: `preset-${preset.id}-${i}-${Date.now()}`,
        title: pi.title,
        description: pi.description,
        unitPrice: pi.unitPrice,
        quantity: pi.quantity,
        category: pi.category,
      })),
    ]);
  };

  const filteredItems = filterCategory === 'All' ? items : items.filter((item) => item.category === filterCategory);

  return (
    <div className="flex flex-col gap-6" id="work-scope-items-section">

      {/* ── 1. Preset Bundles ────────────────────────────────────── */}
      {clientType === 'student' ? (
        <div className="flex flex-col gap-3" id="student-addons-container">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">
            Quick Feature Add-ons
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STUDENT_ADDONS.map((addon, i) => {
              const isChecked = items.some((item) => item.id === addon.id);
              const toggleAddon = () => {
                if (isChecked) {
                  onUpdateItems(items.filter((item) => item.id !== addon.id));
                } else {
                  onUpdateItems([
                    ...items,
                    {
                      id: addon.id,
                      title: addon.title,
                      description: addon.description,
                      unitPrice: addon.price,
                      quantity: 1,
                      category: addon.category,
                    },
                  ]);
                }
              };

              return (
                <motion.div
                  key={addon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={toggleAddon}
                  className={`p-4 rounded-2xl text-left cursor-pointer select-none transition-all duration-300 flex items-center justify-between glass-panel relative ${
                    isChecked
                      ? 'border-white/40 bg-white/12 shadow-[0_4px_20px_rgba(255,255,255,0.08)]'
                      : 'border-white/10 hover:border-white/20 bg-white/03'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Custom 3D Animated Checkbox */}
                    <motion.div
                      animate={{
                        scale: isChecked ? [1, 1.25, 1] : 1,
                        backgroundColor: isChecked ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.06)',
                        borderColor: isChecked ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.2)',
                      }}
                      transition={{ duration: 0.25 }}
                      className="h-5 w-5 rounded-lg border flex items-center justify-center shadow-inner shrink-0"
                    >
                      <AnimatePresence>
                        {isChecked && (
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 45 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          >
                            <Check className="h-3.5 w-3.5 text-black stroke-[3.5]" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <span className={`text-xs font-semibold transition-colors ${isChecked ? 'text-white font-bold' : 'text-white/70'}`}>
                      {addon.title}
                    </span>
                  </div>

                  <span className={`font-mono text-xs font-bold transition-colors ${isChecked ? 'text-white font-extrabold' : 'text-white/50'}`}>
                    +₱{addon.price.toLocaleString()}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3" id="preset-packages-container">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Preset Service Bundles
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="presets-grid">
            {SERVICE_PRESETS.map((preset, i) => (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className="glass-panel p-5 rounded-2xl flex flex-col justify-between gap-4 border border-white/12 hover:border-white/25 transition-all group shadow-xl"
                id={`preset-card-${preset.id}`}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-white/50 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/08 border border-white/10">
                      {preset.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">{preset.items.length} deliverables</span>
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base text-white mt-0.5 group-hover:text-emerald-400 transition-colors">
                    {preset.title}
                  </h3>

                  <p className="text-xs text-white/50 leading-relaxed font-sans">{preset.shortDescription}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex flex-col leading-none">
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Package Total</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-white mt-0.5">
                      ₱{preset.defaultPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => appendPreset(preset)}
                    className="glass-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Package</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. UNIFIED LIQUID GLASS DELIVERABLES MAIN CARD ──────── */}
      <div className="glass-panel p-3.5 sm:p-6 rounded-3xl border border-white/12 shadow-2xl flex flex-col gap-4 sm:gap-5" id="deliverables-main-card">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-bold text-base text-white tracking-tight">Deliverables</h3>
            <span className="font-mono text-xs bg-white/10 text-white/70 px-2.5 py-0.5 font-bold rounded-full border border-white/12 shadow-inner">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => onUpdateItems([])}
                className="text-[10px] tracking-widest text-white/40 hover:text-rose-400 uppercase font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear All
              </button>
            )}

            <div className="flex items-center gap-1 glass-pill p-1 rounded-xl border border-white/10 bg-white/04">
              <Filter className="h-3 w-3 text-white/40 ml-1.5" />
              <div className="flex gap-1">
                {['All', 'Development', 'Design'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className={`text-[9px] font-bold px-2.5 py-1 transition rounded-lg cursor-pointer ${
                      filterCategory === cat ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Empty State Banner (Liquid Glass) */}
        {filteredItems.length === 0 ? (
          <div className="glass-panel border-dashed border border-white/12 rounded-2xl p-10 text-center flex flex-col items-center gap-3 bg-white/02">
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-white/08 border border-white/12 text-white/40 shadow-inner">
              <Layers className="h-6 w-6 text-white/50" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/80">No deliverables added yet</p>
              <p className="text-[11px] text-white/40 mt-0.5">
                Click below to insert a deliverable line item or select a preset bundle above.
              </p>
            </div>
          </div>
        ) : (
          /* Mobile-Optimized Deliverables List Grid */
          <div className="flex flex-col gap-4" id="compact-deliverables-list">
            <AnimatePresence>
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -6 }}
                  transition={{ delay: idx * 0.03, duration: 0.15 }}
                  className="glass-panel p-3.5 sm:p-5 rounded-2xl flex flex-col gap-3 border border-white/12 hover:border-white/20 transition-all shadow-xl group bg-white/03"
                >
                  {/* Top Bar: Item Title Badge & Delete Action */}
                  <div className="flex items-center justify-between pb-1 border-b border-white/06">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      SERVICE TITLE #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-white/30 hover:text-rose-400 p-1 rounded-lg transition hover:bg-rose-500/10 cursor-pointer flex items-center gap-1 text-[9px] font-mono font-bold"
                      title="Remove deliverable"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>

                  {/* Service Title Input */}
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="e.g. Custom React Web Application Setup"
                      value={item.title}
                      onChange={(e) => updateItemField(item.id, 'title', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addBlankItem()}
                      className="w-full font-sans font-bold text-xs sm:text-sm text-white glass-input bg-white/05 border border-white/12 focus:border-white/30 px-3.5 py-2 rounded-xl transition-all placeholder:text-white/25 outline-none shadow-inner"
                    />
                  </div>

                  {/* 12-Column Responsive Controls Grid (Category, Rate, Qty, Subtotal) */}
                  <div className="grid grid-cols-2 sm:grid-cols-12 gap-2.5 items-end pt-1">
                    {/* Category Select */}
                    <div className="col-span-2 sm:col-span-4 flex flex-col gap-1">
                      <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50">
                        CATEGORY
                      </label>
                      <GlassSelect
                        value={item.category}
                        onChange={(val) => updateItemField(item.id, 'category', val)}
                        options={categories.slice(1).map((cat) => ({ value: cat, label: cat }))}
                        className="py-1.5 text-xs w-full"
                        position="bottom"
                        align="left"
                      />
                    </div>

                    {/* Rate Input */}
                    <div className="col-span-1 sm:col-span-3 flex flex-col gap-1">
                      <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50">
                        RATE (₱)
                      </label>
                      <div className="flex items-center glass-input px-2.5 py-1.5 rounded-xl border border-white/12 focus-within:border-white/30 bg-white/04 shadow-inner">
                        <span className="text-white/50 text-xs font-mono mr-1">₱</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={item.unitPrice || ''}
                          onChange={(e) => updateItemField(item.id, 'unitPrice', e.target.value === '' ? 0 : e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addBlankItem()}
                          className="font-mono font-bold text-right text-xs text-white bg-transparent outline-none w-full"
                        />
                      </div>
                    </div>

                    {/* Qty Stepper */}
                    <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
                      <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 text-center sm:text-left">
                        QTY
                      </label>
                      <div className="flex items-center justify-between gap-1 glass-panel p-1 rounded-xl border border-white/12 bg-white/05 shadow-inner">
                        <button
                          type="button"
                          onClick={() => updateItemField(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                          className="h-6 w-6 rounded-lg glass-btn flex items-center justify-center text-xs font-black text-white/80 hover:text-white hover:bg-white/20 transition active:scale-90 cursor-pointer border border-white/10"
                          title="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemField(item.id, 'quantity', Math.max(1, Number(e.target.value) || 1))}
                          className="font-mono font-bold text-center text-xs text-white bg-transparent outline-none w-7"
                        />
                        <button
                          type="button"
                          onClick={() => updateItemField(item.id, 'quantity', item.quantity + 1)}
                          className="h-6 w-6 rounded-lg glass-btn flex items-center justify-center text-xs font-black text-white/80 hover:text-white hover:bg-white/20 transition active:scale-90 cursor-pointer border border-white/10"
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal Display */}
                    <div className="col-span-2 sm:col-span-3 flex flex-col gap-1 items-end pt-1 sm:pt-0">
                      <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 text-right">
                        SUBTOTAL
                      </label>
                      <span className="font-mono font-extrabold text-xs text-white px-3 py-1.5 rounded-xl glass-panel border border-white/12 bg-white/08 shadow-inner w-full text-right">
                        ₱{(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Scope Description Textarea */}
                  <div className="flex flex-col gap-1 pt-1.5 border-t border-white/06">
                    <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50">
                      SCOPE & DELIVERABLES SPECIFICATION
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Detailed technical scope, deliverables, architecture specifications..."
                      value={item.description}
                      onChange={(e) => updateItemField(item.id, 'description', e.target.value)}
                      className="w-full text-xs text-white/80 glass-input bg-white/03 border border-white/10 focus:border-white/25 px-3 py-2 rounded-xl transition-all placeholder:text-white/25 outline-none resize-none min-h-[42px] leading-relaxed shadow-inner"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer Bar & Add Button */}
        <div className="pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3">
          <span className="text-[10px] font-mono text-white/40 text-center sm:text-left">
            Press Enter on inputs or click button to insert line
          </span>
          <button
            type="button"
            onClick={addBlankItem}
            className="glass-btn-primary w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer shadow-xl"
            id="add-deliverable-line-btn"
          >
            <Plus className="h-4 w-4 text-black" />
            <span>Add Deliverable Line</span>
          </button>
        </div>

      </div>

      {/* ── 3. DISCOUNT & TAX SETTINGS ─────────────────────────── */}
      <div className="glass-panel p-5 rounded-3xl flex flex-col gap-4 border border-white/12 shadow-2xl" id="secondary-charges-form">
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white/40">
          Discount & Tax Settings
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Discount Liquid Glass Card */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between border border-white/12 bg-white/03 gap-2 shadow-lg">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold tracking-widest uppercase text-white/60 flex items-center gap-1.5 cursor-pointer">
                <Percent className="h-3.5 w-3.5 text-white/50" /> Apply Discount
              </label>
              <button
                type="button"
                onClick={() => onUpdateConfig({ enableDiscount: !config.enableDiscount })}
                className={`relative inline-flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full px-0.5 border transition-all duration-300 ease-in-out focus:outline-none ${
                  config.enableDiscount
                    ? 'bg-white/20 border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.2),_inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md'
                    : 'bg-white/06 border-white/12 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] backdrop-blur-sm hover:border-white/25'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full transition-transform duration-300 ease-in-out ${
                    config.enableDiscount
                      ? 'translate-x-5 bg-gradient-to-b from-white via-zinc-100 to-zinc-300 shadow-[0_2px_6px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.9)] border border-white'
                      : 'translate-x-0 bg-gradient-to-b from-white/40 to-white/15 border border-white/20 shadow-sm'
                  }`}
                />
              </button>
            </div>
            <AnimatePresence mode="wait">
              {config.enableDiscount ? (
                <motion.div
                  key="discount-active"
                  initial={{ opacity: 0, height: 0, rotateX: -25, scale: 0.94, transformOrigin: 'top' }}
                  animate={{ opacity: 1, height: 'auto', rotateX: 0, scale: 1 }}
                  exit={{ opacity: 0, height: 0, rotateX: 25, scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  style={{ perspective: 1000 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={config.discount || ''}
                      onChange={(e) => onUpdateConfig({ discount: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-xl glass-input border border-white/12 bg-white/05 text-white outline-none focus:border-white/30 transition-all shadow-inner"
                    />
                    <span className="text-xs font-mono text-white/50">%</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="discount-disabled"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-[10px] text-white/30 italic">Discount disabled</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tax Liquid Glass Card */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between border border-white/12 bg-white/03 gap-2 shadow-lg">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold tracking-widest uppercase text-white/60 flex items-center gap-1.5 cursor-pointer">
                <Receipt className="h-3.5 w-3.5 text-white/50" /> Apply Tax
              </label>
              <button
                type="button"
                onClick={() => onUpdateConfig({ enableTax: !config.enableTax })}
                className={`relative inline-flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full px-0.5 border transition-all duration-300 ease-in-out focus:outline-none ${
                  config.enableTax
                    ? 'bg-white/20 border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.2),_inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md'
                    : 'bg-white/06 border-white/12 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] backdrop-blur-sm hover:border-white/25'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full transition-transform duration-300 ease-in-out ${
                    config.enableTax
                      ? 'translate-x-5 bg-gradient-to-b from-white via-zinc-100 to-zinc-300 shadow-[0_2px_6px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.9)] border border-white'
                      : 'translate-x-0 bg-gradient-to-b from-white/40 to-white/15 border border-white/20 shadow-sm'
                  }`}
                />
              </button>
            </div>
            <AnimatePresence mode="wait">
              {config.enableTax ? (
                <motion.div
                  key="tax-active"
                  initial={{ opacity: 0, height: 0, rotateX: -25, scale: 0.94, transformOrigin: 'top' }}
                  animate={{ opacity: 1, height: 'auto', rotateX: 0, scale: 1 }}
                  exit={{ opacity: 0, height: 0, rotateX: 25, scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  style={{ perspective: 1000 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={config.taxRate || ''}
                      onChange={(e) => onUpdateConfig({ taxRate: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-xl glass-input border border-white/12 bg-white/05 text-white outline-none focus:border-white/30 transition-all shadow-inner"
                    />
                    <span className="text-xs font-mono text-white/50">%</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="tax-disabled"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-[10px] text-white/30 italic">Tax disabled (0%)</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quote Expiry Days Liquid Glass Card */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between border border-white/12 bg-white/03 gap-2 shadow-lg">
            <label className="text-[10px] font-bold tracking-widest uppercase text-white/60 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-white/50" /> Expiry Validity
            </label>
            <GlassSelect
              value={15}
              onChange={(daysVal) => {
                const days = Number(daysVal);
                const date = new Date();
                const validityDate = new Date();
                validityDate.setDate(validityDate.getDate() + days);
                onUpdateConfig({
                  issueDate: date.toISOString().split('T')[0],
                  expiryDate: validityDate.toISOString().split('T')[0],
                });
              }}
              options={[
                { value: 15, label: '15 Days (Standard)' },
                { value: 30, label: '30 Days (Recommended)' },
                { value: 60, label: '60 Days (Extended)' },
              ]}
              position="bottom"
              id="expiry-validity-glass-select"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
