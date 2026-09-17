import React, { useState } from 'react';
import { SavedQuote } from '../types';
import {
  History, Trash2, RefreshCw, Search, DollarSign,
  Calendar, Layers, PlusCircle, FileCheck2, Users, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuotationHistoryProps {
  history: SavedQuote[];
  onLoadQuote: (quote: SavedQuote) => void;
  onDeleteQuote: (id: string) => void;
  onSaveCurrentSnapshot: () => void;
}

const SPRING = { type: 'spring', stiffness: 300, damping: 30 };

export default function QuotationHistory({ history, onLoadQuote, onDeleteQuote, onSaveCurrentSnapshot }: QuotationHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredHistory = history.filter(q => {
    const s = searchQuery.toLowerCase();
    return q.clientDetails.name.toLowerCase().includes(s)
      || (q.clientDetails.companyName || '').toLowerCase().includes(s)
      || q.config.quoteNumber.toLowerCase().includes(s);
  });

  const totalPortfolioValue = history.reduce((sum, q) => sum + q.totalAmount, 0);
  const avgProposalValue = history.length > 0 ? Math.round(totalPortfolioValue / history.length) : 0;
  const defaultCurrencySymbol = history[0]?.config?.currencySymbol || '₱';

  const handleLoad = (quote: SavedQuote) => {
    onLoadQuote(quote);
    setSuccessMessage(`Restored draft #${quote.config.quoteNumber} for ${quote.clientDetails.name || 'client'}`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleManualSnapshot = () => {
    onSaveCurrentSnapshot();
    setSuccessMessage('Active workspace snapshot saved to history!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto" id="quotation-history-container">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        id="history-header"
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-white tracking-tight flex items-center gap-2">
              <History className="h-5 w-5 text-white/40" />
              Proposal History
            </h2>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/06 text-white/30 border border-white/08">03 HISTORY</span>
          </div>
          <p className="text-xs uppercase tracking-wider text-white/25 mt-0.5">Browse, restore, or export previous proposals</p>
        </div>
        <motion.button
          type="button" onClick={handleManualSnapshot}
          whileHover={{ scale: 1.04, translateY: -2 }}
          whileTap={{ scale: 0.97 }}
          className="glass-btn-primary py-3 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" /> Save Workspace
        </motion.button>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="glass-panel border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs font-medium flex items-center gap-2.5 shadow-md"
          >
            <FileCheck2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metric Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.08 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        id="history-analytics-cards"
      >
        {[
          { icon: Layers,    label: 'Total Saved',      value: String(history.length),                   color: 'text-white' },
          { icon: DollarSign, label: 'Portfolio Value',  value: `${defaultCurrencySymbol}${totalPortfolioValue.toLocaleString()}`, color: 'text-emerald-400' },
          { icon: TrendingUp, label: 'Average Estimate', value: `${defaultCurrencySymbol}${avgProposalValue.toLocaleString()}`,    color: 'text-white/60' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-panel p-4 rounded-3xl flex items-center gap-3.5 shadow-md"
            style={{ transformStyle: 'preserve-3d', perspective: 800 }}
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-white/06 text-white/40 border border-white/08">
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">{card.label}</span>
              <motion.p key={card.value} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}
                className={`font-display font-extrabold text-lg ${card.color}`}>
                {card.value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.15 }}
        className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl"
        id="history-controls"
      >
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
          <input type="text" placeholder="Search by client, company, quote #..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-2xl py-2.5 pl-10 pr-4 text-xs outline-none" />
        </div>
        <div className="flex items-center gap-2 text-xs text-white/25 w-full md:w-auto justify-end">
          <span>Showing <strong className="text-white/60">{filteredHistory.length}</strong> of {history.length}</span>
        </div>
      </motion.div>

      {/* Cards Grid */}
      {filteredHistory.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4" id="history-cards-grid">
          <AnimatePresence>
            {filteredHistory.map((quote, idx) => {
              const formattedDate = new Date(quote.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
              });
              return (
                <motion.div
                  key={quote.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: -12 }}
                  transition={{ delay: idx * 0.06, type: 'spring', stiffness: 280, damping: 28 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  style={{ transformStyle: 'preserve-3d', perspective: 900 }}
                  className="glass-panel p-5 rounded-3xl flex flex-col justify-between group shadow-xl relative border border-white/06 hover:border-white/12 transition-colors"
                >
                  {/* Top metadata row */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="font-mono text-[10px] text-white/40 glass-pill px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        #{quote.config.quoteNumber}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                        quote.clientDetails.clientType === 'student'
                          ? 'bg-white/06 text-white/40 border-white/08'
                          : 'bg-white/06 text-white/40 border-white/08'
                      }`}>
                        {quote.clientDetails.clientType === 'student' ? 'Academic' : 'Commercial'}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-white tracking-tight group-hover:text-white/90 transition-colors">
                      {quote.clientDetails.name || 'Unnamed Client'}
                    </h3>
                    {quote.clientDetails.companyName && (
                      <p className="text-xs text-white/30 flex items-center gap-1.5 mt-1">
                        <Users className="h-3.5 w-3.5" /> {quote.clientDetails.companyName}
                      </p>
                    )}
                    <p className="text-xs text-white/25 flex items-center gap-1.5 mt-2">
                      <Calendar className="h-3.5 w-3.5" /> {formattedDate}
                    </p>

                    {/* Items summary */}
                    <div className="glass-panel p-3 rounded-2xl my-4">
                      <div className="flex items-center justify-between text-[10px] text-white/25 uppercase tracking-wider mb-2 font-bold">
                        <span>Deliverables ({quote.items.length})</span>
                        <span className="font-mono text-white/50">{(quote.config?.currencySymbol || '₱')}{quote.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1.5 max-h-20 overflow-y-auto pr-1">
                        {quote.items.map((item, i) => (
                          <div key={item.id || i} className="flex justify-between text-xs text-white/40">
                            <span className="truncate max-w-[180px]">{item.title}</span>
                            <span className="font-mono text-white/25">x{item.quantity}</span>
                          </div>
                        ))}
                        {quote.items.length === 0 && <div className="text-[11px] text-white/20 italic">No items</div>}
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 border-t border-white/06 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-bold tracking-wider text-white/25 uppercase block">TOTAL</span>
                      <span className="font-mono font-bold text-sm text-white mt-0.5 block">{(quote.config?.currencySymbol || '₱')}{quote.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button" onClick={() => handleLoad(quote)}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                        className="text-[10px] font-extrabold uppercase tracking-wider glass-btn-primary py-2 px-3.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <RefreshCw className="h-3 w-3" /> Restore
                      </motion.button>
                      <motion.button
                        type="button" onClick={() => onDeleteQuote(quote.id)}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        className="text-white/25 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING}
          className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center gap-5 shadow-xl"
          id="history-empty-state"
        >
          <div className="flex items-center justify-center h-16 w-16 rounded-3xl bg-white/04 text-white/25 border border-white/06">
            <History className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white/70">No Saved Proposals</h3>
            <p className="text-xs text-white/30 mt-1 max-w-sm mx-auto leading-relaxed">
              Complete a proposal in the editor and save a snapshot to build your history.
            </p>
          </div>
          <motion.button type="button" onClick={handleManualSnapshot} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="glass-btn-primary py-3 px-8 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg">
            <PlusCircle className="h-4 w-4" /> Save Workspace
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
