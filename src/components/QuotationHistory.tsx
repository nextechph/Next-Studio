import React, { useState, useMemo } from 'react';
import { SavedQuote } from '../types';
import {
  History, Trash2, RefreshCw, Search, DollarSign,
  Calendar, Layers, PlusCircle, FileCheck2, Users, TrendingUp,
  Coins, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GlassSelect, { GlassSelectOption } from './GlassSelect';
import { PRESET_CURRENCIES, getCurrencyConfig } from '../data/currencies';

interface QuotationHistoryProps {
  history: SavedQuote[];
  onLoadQuote: (quote: SavedQuote) => void;
  onDeleteQuote: (id: string) => void;
  onSaveCurrentSnapshot: () => void;
  activeCurrency?: string;
}

const SPRING = { type: 'spring', stiffness: 300, damping: 30 };

const formatAmount = (num: number, symbol: string) => {
  const isInteger = num % 1 === 0;
  const formatted = num.toLocaleString(undefined, {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
};

export default function QuotationHistory({
  history,
  onLoadQuote,
  onDeleteQuote,
  onSaveCurrentSnapshot,
  activeCurrency
}: QuotationHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Group all distinct currencies present in history
  const availableCurrencies = useMemo(() => {
    const map = new Map<string, { code: string; symbol: string; name: string; count: number; total: number }>();
    history.forEach((q) => {
      const code = q.config?.currency || 'PHP';
      const symbol = q.config?.currencySymbol || (code === 'AED' ? 'AED' : code === 'USD' ? '$' : '₱');
      const name = q.config?.currencyName || getCurrencyConfig(code).name;
      const existing = map.get(code);
      if (existing) {
        existing.count += 1;
        existing.total += q.totalAmount;
      } else {
        map.set(code, { code, symbol, name, count: 1, total: q.totalAmount });
      }
    });
    return Array.from(map.values());
  }, [history]);

  // Quotes filtered by selected currency
  const currencyFilteredQuotes = useMemo(() => {
    if (selectedCurrency === 'ALL') return history;
    return history.filter((q) => (q.config?.currency || 'PHP') === selectedCurrency);
  }, [history, selectedCurrency]);

  // Quotes filtered by both currency and search query
  const filteredHistory = useMemo(() => {
    const s = searchQuery.toLowerCase().trim();
    if (!s) return currencyFilteredQuotes;
    return currencyFilteredQuotes.filter((q) =>
      q.clientDetails.name.toLowerCase().includes(s)
      || (q.clientDetails.companyName || '').toLowerCase().includes(s)
      || q.config.quoteNumber.toLowerCase().includes(s)
    );
  }, [currencyFilteredQuotes, searchQuery]);

  // Calculations for metric analytics
  const isAll = selectedCurrency === 'ALL';
  const activeSymbol = isAll
    ? (availableCurrencies.length === 1 ? availableCurrencies[0].symbol : '₱')
    : (availableCurrencies.find((c) => c.code === selectedCurrency)?.symbol || getCurrencyConfig(selectedCurrency).symbol || '₱');

  const totalPortfolioValue = useMemo(() => {
    return currencyFilteredQuotes.reduce((sum, q) => sum + q.totalAmount, 0);
  }, [currencyFilteredQuotes]);

  const avgProposalValue = currencyFilteredQuotes.length > 0
    ? totalPortfolioValue / currencyFilteredQuotes.length
    : 0;

  // Options for Currency Filter Dropdown
  const currencyFilterOptions: GlassSelectOption[] = useMemo(() => {
    const opts: GlassSelectOption[] = [
      {
        value: 'ALL',
        label: 'All Currencies',
        subLabel: `${history.length} saved quotation${history.length !== 1 ? 's' : ''}`,
      },
    ];

    // Currencies actually saved in history
    availableCurrencies.forEach((c) => {
      opts.push({
        value: c.code,
        label: `${c.code} (${c.symbol}) - ${c.name}`,
        subLabel: `${c.count} quotation${c.count !== 1 ? 's' : ''} • Total: ${formatAmount(c.total, c.symbol)}`,
      });
    });

    // Preset currencies not yet in history
    PRESET_CURRENCIES.filter((pc) => !availableCurrencies.some((ac) => ac.code === pc.code)).forEach((pc) => {
      opts.push({
        value: pc.code,
        label: `${pc.code} (${pc.symbol}) - ${pc.name}`,
        subLabel: '0 saved quotations',
      });
    });

    return opts;
  }, [history.length, availableCurrencies]);

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
          <p className="text-xs uppercase tracking-wider text-white/25 mt-0.5">Browse, filter by currency, or restore previous quotations</p>
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

      {/* ── Currency Filter Pill Tabs ───────────────────────────── */}
      {availableCurrencies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.05 }}
          className="flex items-center justify-between flex-wrap gap-2 pt-1"
          id="history-currency-filter-tabs"
        >
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5 mr-1">
              <Coins className="h-3.5 w-3.5 text-emerald-400" /> Filter Currency:
            </span>

            {/* "All" button */}
            <button
              type="button"
              onClick={() => setSelectedCurrency('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCurrency === 'ALL'
                  ? 'bg-white text-black shadow-lg font-black'
                  : 'bg-white/06 text-white/60 hover:bg-white/10 hover:text-white border border-white/08'
              }`}
            >
              <span>All</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCurrency === 'ALL' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                {history.length}
              </span>
            </button>

            {/* Currency Pills for each currency present in history */}
            {availableCurrencies.map((c) => {
              const isSelected = selectedCurrency === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCurrency(c.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-400 text-black shadow-lg font-black shadow-emerald-400/20'
                      : 'bg-white/06 text-white/60 hover:bg-white/10 hover:text-white border border-white/08'
                  }`}
                >
                  <span>{c.symbol} {c.code}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedCurrency !== 'ALL' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Showing only {selectedCurrency}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCurrency('ALL')}
                className="text-[10px] font-mono text-white/40 hover:text-white underline cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Metric Cards ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.08 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        id="history-analytics-cards"
      >
        {/* Card 1: Count */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="glass-panel p-4 rounded-3xl flex items-center gap-3.5 shadow-md"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-white/06 text-white/40 border border-white/08">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
              {selectedCurrency === 'ALL' ? 'Total Saved' : `${selectedCurrency} Saved`}
            </span>
            <motion.p
              key={`count-${selectedCurrency}-${currencyFilteredQuotes.length}`}
              initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }}
              className="font-display font-extrabold text-lg text-white"
            >
              {currencyFilteredQuotes.length}
            </motion.p>
          </div>
        </motion.div>

        {/* Card 2: Portfolio Value */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="glass-panel p-4 rounded-3xl flex items-center gap-3.5 shadow-md"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-white/06 text-white/40 border border-white/08">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block">
              {selectedCurrency === 'ALL' ? 'Portfolio Value' : `${selectedCurrency} Portfolio Value`}
            </span>

            {selectedCurrency !== 'ALL' || availableCurrencies.length <= 1 ? (
              <motion.p
                key={`val-${selectedCurrency}-${totalPortfolioValue}`}
                initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }}
                className="font-display font-extrabold text-lg text-emerald-400 truncate"
              >
                {formatAmount(totalPortfolioValue, activeSymbol)}
              </motion.p>
            ) : (
              /* If ALL is selected and multiple currencies exist, display each currency total cleanly */
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {availableCurrencies.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCurrency(c.code)}
                    className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2 py-0.5 rounded-lg transition cursor-pointer"
                    title={`Click to filter by ${c.code}`}
                  >
                    {formatAmount(c.total, c.symbol)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Card 3: Average Estimate */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="glass-panel p-4 rounded-3xl flex items-center gap-3.5 shadow-md"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-white/06 text-white/40 border border-white/08">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block">
              {selectedCurrency === 'ALL' ? 'Average Estimate' : `${selectedCurrency} Average`}
            </span>

            {selectedCurrency !== 'ALL' || availableCurrencies.length <= 1 ? (
              <motion.p
                key={`avg-${selectedCurrency}-${avgProposalValue}`}
                initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }}
                className="font-display font-extrabold text-lg text-white/70 truncate"
              >
                {formatAmount(avgProposalValue, activeSymbol)}
              </motion.p>
            ) : (
              <p className="text-[11px] text-white/40 font-mono mt-1">
                Select currency pill to view avg
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Search & Controls Bar ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.15 }}
        className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl"
        id="history-controls"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Search text input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
            <input
              type="text"
              placeholder="Search by client, company, quote #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input rounded-2xl py-2.5 pl-10 pr-4 text-xs outline-none"
            />
          </div>

          {/* Currency dropdown selector */}
          <div className="w-full sm:w-60">
            <GlassSelect
              value={selectedCurrency}
              onChange={(val) => setSelectedCurrency(String(val))}
              options={currencyFilterOptions}
              placeholder="Filter by Currency"
              id="history-currency-filter-select"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/25 w-full md:w-auto justify-end">
          <span>
            Showing <strong className="text-white/60">{filteredHistory.length}</strong> of {history.length}
            {selectedCurrency !== 'ALL' && (
              <span className="ml-1 text-emerald-400 font-mono">({selectedCurrency})</span>
            )}
          </span>
        </div>
      </motion.div>

      {/* ── Cards Grid ─────────────────────────────────────────── */}
      {filteredHistory.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4" id="history-cards-grid">
          <AnimatePresence>
            {filteredHistory.map((quote, idx) => {
              const formattedDate = new Date(quote.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
              });
              const quoteCurrencyCode = quote.config?.currency || 'PHP';
              const quoteCurrencySymbol = quote.config?.currencySymbol || '₱';

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
                      
                      <div className="flex items-center gap-1.5">
                        {/* Currency badge */}
                        <button
                          type="button"
                          onClick={() => setSelectedCurrency(quoteCurrencyCode)}
                          className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition cursor-pointer"
                          title={`Filter to ${quoteCurrencyCode}`}
                        >
                          {quoteCurrencySymbol} {quoteCurrencyCode}
                        </button>

                        {/* Document type / academic badge */}
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border bg-white/06 text-white/40 border-white/08">
                          {quote.config?.documentType === 'receipt' ? 'Receipt' : 'Proposal'}
                        </span>
                      </div>
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
                        <span className="font-mono text-white/50">{formatAmount(quote.totalAmount, quoteCurrencySymbol)}</span>
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
                      <span className="font-mono font-bold text-sm text-white mt-0.5 block">{formatAmount(quote.totalAmount, quoteCurrencySymbol)}</span>
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
                        title="Delete quotation"
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
            {selectedCurrency !== 'ALL' ? <Coins className="h-8 w-8 text-emerald-400/50" /> : <History className="h-8 w-8" />}
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white/70">
              {selectedCurrency !== 'ALL'
                ? `No Saved Quotations in ${selectedCurrency}`
                : 'No Saved Quotations'}
            </h3>
            <p className="text-xs text-white/30 mt-1 max-w-sm mx-auto leading-relaxed">
              {selectedCurrency !== 'ALL'
                ? `You have not saved any quotations declared in ${selectedCurrency}. Switch the filter or save a new snapshot in this currency.`
                : 'Complete a proposal in the editor and save a snapshot to build your history.'}
            </p>
          </div>
          {selectedCurrency !== 'ALL' ? (
            <motion.button
              type="button"
              onClick={() => setSelectedCurrency('ALL')}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="glass-btn-primary py-2.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg"
            >
              Show All Currencies ({history.length})
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleManualSnapshot}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="glass-btn-primary py-3 px-8 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <PlusCircle className="h-4 w-4" /> Save Workspace
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
