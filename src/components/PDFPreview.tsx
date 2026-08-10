import React, { useRef, useState } from 'react';
import { ClientDetails, QuotationItem, BrandingConfig, BrandingTheme } from '../types';
import { Download, Printer, Copy, Check, FileText, Lock, Sparkles, Building2, User2, MailCheck, ZoomIn, ZoomOut } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- OKLCH to RGB Color Parser and Converter to fix html2canvas oklch crash ---
function oklchToRgb(lStr: string, cStr: string, hStr: string, aStr?: string): string {
  let L = parseFloat(lStr);
  if (lStr.includes('%')) L /= 100;

  let C = parseFloat(cStr);
  if (cStr.includes('%')) C /= 100;

  let H = parseFloat(hStr);
  if (hStr.includes('rad')) {
    H = parseFloat(hStr) * (180 / Math.PI);
  } else if (hStr.includes('turn')) {
    H = parseFloat(hStr) * 360;
  } else if (hStr.includes('grad')) {
    H = parseFloat(hStr) * 0.9;
  }

  let A = 1;
  if (aStr) {
    A = parseFloat(aStr);
    if (aStr.includes('%')) A /= 100;
  }

  L = Math.max(0, Math.min(1, L));
  C = Math.max(0, C);

  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = Math.pow(Math.max(0, l_), 3);
  const m = Math.pow(Math.max(0, m_), 3);
  const s = Math.pow(Math.max(0, s_), 3);

  const rL = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gL = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bL = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const gamma = (x: number) => {
    return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  };

  const R = Math.max(0, Math.min(255, Math.round(gamma(rL) * 255)));
  const G = Math.max(0, Math.min(255, Math.round(gamma(gL) * 255)));
  const B = Math.max(0, Math.min(255, Math.round(gamma(bL) * 255)));

  if (A === 1) {
    return `rgb(${R}, ${G}, ${B})`;
  } else {
    return `rgba(${R}, ${G}, ${B}, ${A.toFixed(3)})`;
  }
}

function oklabToRgb(lStr: string, aStr: string, bStr: string, alphaStr?: string): string {
  let L = parseFloat(lStr);
  if (lStr.includes('%')) L /= 100;

  let a = parseFloat(aStr);
  if (aStr.includes('%')) a = (a / 100) * 0.4;

  let b = parseFloat(bStr);
  if (bStr.includes('%')) b = (b / 100) * 0.4;

  let A = 1;
  if (alphaStr) {
    A = parseFloat(alphaStr);
    if (alphaStr.includes('%')) A /= 100;
  }

  L = Math.max(0, Math.min(1, L));

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = Math.pow(Math.max(0, l_), 3);
  const m = Math.pow(Math.max(0, m_), 3);
  const s = Math.pow(Math.max(0, s_), 3);

  const rL = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gL = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bL = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const gamma = (x: number) => {
    return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  };

  const R = Math.max(0, Math.min(255, Math.round(gamma(rL) * 255)));
  const G = Math.max(0, Math.min(255, Math.round(gamma(gL) * 255)));
  const B = Math.max(0, Math.min(255, Math.round(gamma(bL) * 255)));

  if (A === 1) {
    return `rgb(${R}, ${G}, ${B})`;
  } else {
    return `rgba(${R}, ${G}, ${B}, ${A.toFixed(3)})`;
  }
}

function replaceOklchAndOklabInCss(cssText: string): string {
  let result = cssText;

  // 1. Convert OKLCH
  const oklchRegex = /oklch\(\s*([0-9.-]+%?)\s*[\s,]\s*([0-9.-]+%?)\s*[\s,]\s*([0-9.-]+(?:deg|rad|grad|turn)?)(?:\s*[\s,/]\s*([0-9.-]+%?))?\s*\)/gi;
  result = result.replace(oklchRegex, (match, l, c, h, a) => {
    try {
      return oklchToRgb(l, c, h, a);
    } catch (e) {
      console.warn('Failed to parse oklch color:', match, e);
      return 'rgb(120, 120, 120)';
    }
  });

  // 2. Convert OKLAB
  const oklabRegex = /oklab\(\s*([0-9.-]+%?)\s*[\s,]\s*([0-9.-]+%?)\s*[\s,]\s*([0-9.-]+%?)(?:\s*[\s,/]\s*([0-9.-]+%?))?\s*\)/gi;
  result = result.replace(oklabRegex, (match, l, a, b, alpha) => {
    try {
      return oklabToRgb(l, a, b, alpha);
    } catch (e) {
      console.warn('Failed to parse oklab color:', match, e);
      return 'rgb(120, 120, 120)';
    }
  });

  return result;
}

interface PDFPreviewProps {
  clientDetails: ClientDetails;
  items: QuotationItem[];
  config: BrandingConfig;
  onUpdateConfig: (config: Partial<BrandingConfig>) => void;
  isFormValid: boolean;
  onSaveToHistory?: (total: number) => void;
  mode?: 'preview' | 'generate';
}

export default function PDFPreview({
  clientDetails,
  items,
  config,
  onUpdateConfig,
  isFormValid,
  onSaveToHistory,
  mode = 'generate'
}: PDFPreviewProps) {
  const activeTheme = config.theme || 'next-light';
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) return 0.46;
    return 1.0;
  });
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  // Totals calculations
  const basePrice = clientDetails.basePrice || 0;
  const ledgerSubTotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const subtotal = basePrice + ledgerSubTotal;
  const discountAmount = (config.enableDiscount && config.discount > 0) ? subtotal * (config.discount / 100) : 0;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (config.enableTax && config.taxRate > 0) ? afterDiscount * (config.taxRate / 100) : 0;
  const totalAmount = afterDiscount + taxAmount;

  // Handle PDF Export
  const generatePDF = async () => {
    setIsGenerating(true);
    const originalGetComputedStyle = window.getComputedStyle;

    try {
      // Temporarily override getComputedStyle to safely convert oklch/oklab to rgb
      window.getComputedStyle = function (el, pseudoElt) {
        const style = originalGetComputedStyle(el, pseudoElt);
        return new Proxy(style, {
          get(target, prop) {
            if (prop === 'getPropertyValue') {
              return function(propertyName: string) {
                const originalVal = target.getPropertyValue(propertyName);
                if (originalVal && (originalVal.includes('oklch') || originalVal.includes('oklab'))) {
                  return replaceOklchAndOklabInCss(originalVal);
                }
                return originalVal;
              };
            }
            
            const val = Reflect.get(target, prop);
            if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
              return replaceOklchAndOklabInCss(val);
            }
            if (typeof val === 'function') {
              return val.bind(target);
            }
            return val;
          }
        });
      };

      const element = pdfTemplateRef.current;
      if (!element) return;

      // To guarantee render accuracy, we force specific sizes and styles for html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // 2x scale for print sharpness
        useCORS: true,
        logging: false,
        backgroundColor: currentStyle.bgColorHex,
        onclone: (clonedDoc) => {
          // Force exact A4 760px canvas width on cloned document for html2canvas
          const clonedSheet = clonedDoc.getElementById('billing-print-sheet');
          if (clonedSheet) {
            clonedSheet.style.width = '760px';
            clonedSheet.style.maxWidth = '760px';
          }

          // 1. Process all elements with inline style attributes containing 'oklch' or 'oklab'
          clonedDoc.querySelectorAll('[style]').forEach((el) => {
            const inlineStyle = el.getAttribute('style');
            if (inlineStyle) {
              const lower = inlineStyle.toLowerCase();
              if (lower.includes('oklch') || lower.includes('oklab')) {
                el.setAttribute('style', replaceOklchAndOklabInCss(inlineStyle));
              }
            }
          });

          // 2. Scan all stylesheets, extract the CSS text, convert OKLCH and OKLAB to RGB, and inject a clean new style block
          const sheets = clonedDoc.styleSheets;
          let combinedCss = '';
          const elementsToRemove: Element[] = [];

          if (sheets) {
            for (let i = 0; i < sheets.length; i++) {
              const sheet = sheets[i];
              try {
                const rules = sheet.cssRules || sheet.rules;
                if (rules) {
                  let sheetCss = '';
                  for (let j = 0; j < rules.length; j++) {
                    sheetCss += rules[j].cssText + '\n';
                  }
                  combinedCss += sheetCss + '\n';
                  
                  // Mark the owner element for removal as we'll replace it with the converted style sheet
                  if (sheet.ownerNode) {
                    elementsToRemove.push(sheet.ownerNode as Element);
                  }
                }
              } catch (e) {
                // If same-origin policies or other restrictions block reading cssRules, do not crash and leave the node alone
                console.warn('Could not read rules for stylesheet:', sheet.href, e);
              }
            }
          }

          // Fallback: if we extracted no styles (e.g., stylesheets not fully loaded or ready yet), parse style tags directly
          if (!combinedCss.trim()) {
            clonedDoc.querySelectorAll('style').forEach((styleTag) => {
              if (styleTag.textContent) {
                combinedCss += styleTag.textContent + '\n';
              }
              elementsToRemove.push(styleTag);
            });
          }

          // Convert all OKLCH and OKLAB statements to RGB equivalents
          const cleanCss = replaceOklchAndOklabInCss(combinedCss);

          // Remove the successfully compiled original style/link tags
          elementsToRemove.forEach((el) => {
            try {
              el.remove();
            } catch (err) {
              // ignore
            }
          });

          // Append our new clean CSS block
          const cleanStyleTag = clonedDoc.createElement('style');
          cleanStyleTag.textContent = cleanCss;
          clonedDoc.head.appendChild(cleanStyleTag);
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate responsive layout height
      const canvasHeight = canvas.height;
      const canvasWidth = canvas.width;
      const imgHeight = (canvasHeight * imgWidth) / canvasWidth;

      let heightLeft = imgHeight;
      let position = 0;

      // First Page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-pages if content overflows A4
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const cleanClientName = clientDetails.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      pdf.save(`next_technology_quote_${cleanClientName || 'draft'}.pdf`);
      if (onSaveToHistory) {
        onSaveToHistory(totalAmount);
      }
    } catch (err) {
      console.error('Failed to translate capture to pdf package:', err);
    } finally {
      window.getComputedStyle = originalGetComputedStyle;
      setIsGenerating(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Theme configuration presets definitions (Tailwind helper maps)
  const themeStyles = {
    'next-tech': {
      outerBg: 'bg-zinc-950 text-emerald-400 border border-emerald-500/30',
      bgColorHex: '#09090b',
      borderLine: 'border-emerald-500/30',
      accentText: 'text-emerald-400',
      boldText: 'text-emerald-300 font-bold',
      badgeBg: 'bg-zinc-900 border border-emerald-500/30 text-emerald-400',
      headerClass: 'bg-zinc-900/90 p-6 rounded-2xl border border-emerald-500/40 shadow-lg shadow-emerald-500/10',
      headerBoldText: 'text-emerald-300',
      headerMetaText: 'text-emerald-500/80',
      footerText: 'text-emerald-600',
      highlightBadge: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300',
      fontDoc: 'font-mono',
      fontHeader: 'font-display',
      tableHeaderBg: 'bg-zinc-900/80',
      bodyText: 'text-emerald-300/90',
      mutedText: 'text-emerald-500/70',
      borderLineSubtle: 'border-emerald-500/20',
      divideLine: 'divide-emerald-500/20'
    },
    'next-light': {
      outerBg: 'bg-white text-slate-800',
      bgColorHex: '#ffffff',
      borderLine: 'border-slate-100',
      accentText: 'text-slate-600',
      boldText: 'text-slate-900',
      badgeBg: 'bg-slate-50 border border-slate-150 text-slate-650',
      headerClass: 'bg-slate-50/50 p-6 rounded-2xl border border-slate-100',
      headerBoldText: 'text-slate-900',
      headerMetaText: 'text-slate-500',
      footerText: 'text-slate-400',
      highlightBadge: 'border-emerald-200 bg-emerald-50/50 text-emerald-700',
      fontDoc: 'font-sans',
      fontHeader: 'font-display',
      tableHeaderBg: 'bg-slate-50/40',
      bodyText: 'text-slate-600',
      mutedText: 'text-slate-450',
      borderLineSubtle: 'border-slate-100/60',
      divideLine: 'divide-slate-100/60'
    },
    'minimalist-outline': {
      outerBg: 'bg-stone-50/30 text-stone-900 border-2 border-stone-800',
      bgColorHex: '#fafaf9',
      borderLine: 'border-stone-800',
      accentText: 'text-stone-600',
      boldText: 'text-stone-900 font-semibold',
      badgeBg: 'bg-stone-100 border border-stone-800 text-stone-900',
      headerClass: 'bg-stone-100/80 p-5 rounded-2xl border border-stone-800',
      headerBoldText: 'text-stone-900',
      headerMetaText: 'text-stone-600',
      footerText: 'text-stone-500',
      highlightBadge: 'border-stone-800 bg-stone-100 text-stone-900',
      fontDoc: 'font-mono',
      fontHeader: 'font-mono',
      tableHeaderBg: 'bg-stone-100/30',
      bodyText: 'text-stone-800',
      mutedText: 'text-stone-600',
      borderLineSubtle: 'border-stone-800/30',
      divideLine: 'divide-stone-800/20'
    },
    'executive-slate': {
      outerBg: 'bg-slate-50 text-slate-900',
      bgColorHex: '#f8fafc',
      borderLine: 'border-slate-300',
      accentText: 'text-slate-600',
      boldText: 'text-slate-950',
      badgeBg: 'bg-slate-100 border border-slate-200 text-slate-800',
      headerClass: 'bg-slate-900 text-white p-6 rounded-2xl shadow-sm',
      headerBoldText: 'text-white',
      headerMetaText: 'text-slate-300',
      footerText: 'text-slate-450',
      highlightBadge: 'border-slate-200 bg-slate-100 text-slate-800 font-medium',
      fontDoc: 'font-sans',
      fontHeader: 'font-display',
      tableHeaderBg: 'bg-zinc-100',
      bodyText: 'text-slate-650',
      mutedText: 'text-slate-450',
      borderLineSubtle: 'border-slate-200/50',
      divideLine: 'divide-slate-200/40'
    },
    'warm-editorial': {
      outerBg: 'bg-[#FAF9F6] text-amber-950',
      bgColorHex: '#FAF9F6',
      borderLine: 'border-amber-900/15',
      accentText: 'text-amber-800',
      boldText: 'text-amber-950 font-medium',
      badgeBg: 'bg-[#F4F1EA] border border-amber-900/10 text-amber-900',
      headerClass: 'bg-[#F4F1EA] p-6 rounded-2xl border border-amber-900/15',
      headerBoldText: 'text-amber-950',
      headerMetaText: 'text-amber-800',
      footerText: 'text-amber-700/60',
      highlightBadge: 'border-amber-200 bg-[#EFECE3] text-amber-900',
      fontDoc: 'font-sans',
      fontHeader: 'font-display',
      tableHeaderBg: 'bg-[#F1EDE4]',
      bodyText: 'text-amber-900/85',
      mutedText: 'text-amber-800/65',
      borderLineSubtle: 'border-amber-900/10',
      divideLine: 'divide-amber-900/10'
    },
    'nordic-cold': {
      outerBg: 'bg-white text-sky-950',
      bgColorHex: '#ffffff',
      borderLine: 'border-sky-100',
      accentText: 'text-sky-700',
      boldText: 'text-sky-950 font-medium',
      badgeBg: 'bg-sky-50 border border-sky-150 text-sky-900',
      headerClass: 'bg-sky-50/70 p-6 rounded-2xl border border-sky-100',
      headerBoldText: 'text-sky-950',
      headerMetaText: 'text-sky-700',
      footerText: 'text-sky-600',
      highlightBadge: 'border-cyan-200 bg-cyan-50 text-cyan-800',
      fontDoc: 'font-sans',
      fontHeader: 'font-display',
      tableHeaderBg: 'bg-sky-50/40',
      bodyText: 'text-sky-800/90',
      mutedText: 'text-sky-600/70',
      borderLineSubtle: 'border-sky-100/50',
      divideLine: 'divide-sky-100/50'
    }
  };

  const currentStyle = themeStyles[activeTheme];

  return (
    <div className="flex flex-col gap-4" id="pdf-preview-pane">

      {/* 2. Realistic Printable Box Frame (A4 Aspect Ratio: ~794px width) */}
      <div 
        className="mx-auto w-full max-w-5xl bg-zinc-100 p-4 sm:p-6 overflow-x-auto md:overflow-x-visible shadow-2xl border border-zinc-200 relative group rounded-3xl"
        id="pdf-viewprint-stage"
      >
        {/* Inline Header & Action Buttons & Zoom Controls */}
        <div className="flex items-center justify-between pb-3 px-1 flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[9px] tracking-[0.18em] font-mono text-zinc-600 select-none uppercase font-extrabold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live PDF Document Sheet
            </span>

            {/* Interactive Zoom Controller Pill */}
            <div className="flex items-center gap-1 bg-zinc-200/90 p-1 rounded-xl border border-zinc-300 shadow-sm">
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.max(0.32, prev - 0.08))}
                className="p-1 rounded-lg hover:bg-white text-zinc-700 transition cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[9.5px] font-extrabold text-zinc-800 px-1.5 min-w-[38px] text-center select-none">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.min(1.4, prev + 0.08))}
                className="p-1 rounded-lg hover:bg-white text-zinc-700 transition cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(window.innerWidth < 640 ? 0.46 : 1.0)}
                className="px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 bg-white/80 hover:bg-white rounded-lg transition cursor-pointer"
                title="Reset Zoom"
              >
                Fit
              </button>
            </div>
          </div>

          {mode === 'generate' ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] uppercase font-bold tracking-widest text-zinc-700 bg-white border border-zinc-300 rounded-xl cursor-pointer shadow-sm hover:bg-zinc-50 transition"
                title="Copy link"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-indigo-600" /> Share
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={generatePDF}
                disabled={isGenerating}
                className={`glass-btn-primary flex items-center justify-center gap-2 text-[9px] uppercase font-extrabold tracking-widest py-2 px-5 rounded-xl cursor-pointer shadow-md ${
                  isGenerating ? 'opacity-50 cursor-wait' : ''
                }`}
              >
                <Download className="h-3.5 w-3.5 text-black" />
                <span>{isGenerating ? 'Compiling PDF...' : 'Download Branded PDF'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-zinc-500 font-bold bg-zinc-200/80 px-3 py-1 rounded-xl border border-zinc-300">
                Preview Mode · Read Only
              </span>
            </div>
          )}
        </div>

        {/* The PDF canvas element (With Scalable Canvas & Touch Panning Stage) */}
        <div className="w-full overflow-x-auto p-2 sm:p-4 flex justify-center -webkit-overflow-scrolling-touch min-h-[500px]">
          <div
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center',
              width: '760px',
              height: `${1080 * zoomScale}px`
            }}
            className="transition-transform duration-200 shrink-0"
          >
            <div
              ref={pdfTemplateRef}
              id="billing-print-sheet"
              className={`w-[760px] min-h-[1050px] p-8 sm:p-10 shadow-2xl relative pointer-events-auto rounded-2xl border border-zinc-200/80 ${currentStyle.fontDoc} ${currentStyle.outerBg}`}
              style={{ width: '760px', backgroundColor: currentStyle.bgColorHex }}
            >
          {/* Theme visual overlay details based on selection */}
          <div className="flex flex-col h-full gap-5" id="canvas-internal-flow">

            {/* HEADER COMPONENT */}
            <div className={`flex flex-col gap-4 ${currentStyle.headerClass}`} id="canvas-header-block">
              <div className="flex justify-between items-center">
                {/* Brand Ident - Clean Typographic Header replacing logos */}
                <div className="flex flex-col text-left animate-fade-in">
                  <span className={`${currentStyle.fontHeader} font-extrabold text-base tracking-widest ${currentStyle.headerBoldText} leading-none uppercase`}>
                    {config.approvedBy || 'NEXT TECHNOLOGY'}
                  </span>
                  <span className={`${currentStyle.fontDoc} font-medium text-[7px] tracking-[0.385em] ${currentStyle.headerMetaText} leading-none mt-1.5 uppercase`}>
                    {config.approvedByHQ || 'Silicon Oasis HQ'}
                  </span>
                </div>
                {/* Doc Title & Meta details */}
                <div className="text-right">
                  <h2 className={`${currentStyle.fontHeader} font-black text-2xl tracking-widest uppercase mb-1 ${currentStyle.headerBoldText}`}>
                    QUOTATION
                  </h2>
                  <div className={`flex flex-col gap-0.5 text-[9px] font-mono tracking-tight ${currentStyle.headerMetaText}`}>
                    <p>Doc ID: <span className={currentStyle.headerBoldText}>{config.quoteNumber}</span></p>
                    <p>Issue Date: <span className={currentStyle.headerBoldText}>{config.issueDate}</span></p>
                    <p>Expires On: <span className={currentStyle.headerBoldText}>{config.expiryDate}</span></p>
                  </div>
                </div>
              </div>
            </div>



              {/* Sender Info / Client Info Row (Responsive 1-col on mobile, 2-col on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 text-[11px] text-left mb-3" id="canvas-bipartite-billing">
                {/* 1. STUDIO / PROVIDER CARD */}
                <div className={`p-4 rounded-xl border ${currentStyle.borderLineSubtle} ${currentStyle.badgeBg} flex flex-col gap-2 text-left shadow-sm`}>
                  <div className="flex items-center justify-between pb-1">
                    <span className={`text-[8px] font-mono font-extrabold uppercase tracking-widest ${currentStyle.mutedText} flex items-center gap-1.5`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 opacity-70" /> PROVIDER / ISSUER
                    </span>
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-wider ${currentStyle.mutedText}`}>APPROVED BY</span>
                  </div>

                  <p className={`font-bold text-xs ${currentStyle.boldText}`}>{config.approvedBy || 'Next Technology Inc.'}</p>
                  
                  <div className="flex flex-col gap-0.5 text-[9.5px]">
                    {config.approvedByHQ && (
                      <p className={currentStyle.bodyText}>
                        <span className={`font-semibold ${currentStyle.mutedText}`}>HQ:</span> {config.approvedByHQ}
                      </p>
                    )}
                    {config.approvedByEmail && (
                      <p className={`font-mono ${currentStyle.bodyText}`}>
                        <span className={`font-semibold font-sans ${currentStyle.mutedText}`}>Email:</span> {config.approvedByEmail}
                      </p>
                    )}
                    {config.approvedByWeb && (
                      <p className={`font-mono ${currentStyle.bodyText}`}>
                        <span className={`font-semibold font-sans ${currentStyle.mutedText}`}>Web:</span> {config.approvedByWeb}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. TARGET CLIENT CARD (Theme-Dynamic Accent Card) */}
                <div className={`p-4 rounded-xl border ${currentStyle.borderLine} ${currentStyle.badgeBg} flex flex-col gap-2 text-left shadow-sm relative overflow-hidden`}>
                  <div className="flex items-center justify-between pb-1">
                    <span className={`text-[8px] font-mono font-extrabold uppercase tracking-widest ${currentStyle.boldText} flex items-center gap-1.5`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> CLIENT / RECIPIENT
                    </span>
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-wider ${currentStyle.boldText} opacity-80`}>PREPARED FOR</span>
                  </div>

                  <p className={`font-bold text-xs ${currentStyle.boldText}`}>{clientDetails.name || '── Recipient Name Empty ──'}</p>

                  <div className="flex flex-col gap-0.5 text-[9.5px]">
                    {clientDetails.companyName && (
                      <p className={currentStyle.bodyText}>
                        <span className={`font-semibold ${currentStyle.mutedText}`}>Company:</span> <span className={`font-semibold ${currentStyle.boldText}`}>{clientDetails.companyName}</span>
                      </p>
                    )}
                    <p className={`font-mono ${currentStyle.bodyText}`}>
                      <span className={`font-semibold font-sans ${currentStyle.mutedText}`}>Email:</span> {clientDetails.email || '──'}
                    </p>
                    <p className={`font-mono ${currentStyle.bodyText}`}>
                      <span className={`font-semibold font-sans ${currentStyle.mutedText}`}>Phone:</span> {clientDetails.contactNumber || '──'}
                    </p>
                  </div>
                </div>
              </div>

              {/* PROJECT OVERVIEW & SCHEDULE BAR */}
              <div className={`p-3.5 mb-3 rounded-xl border ${currentStyle.borderLineSubtle} ${currentStyle.badgeBg} flex items-center justify-between flex-wrap gap-3 text-left shadow-sm`} id="canvas-schedule-bar">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-[8.5px] font-mono font-bold uppercase tracking-wider ${currentStyle.boldText}`}>
                    Scope Context:
                  </span>
                  <span className={`text-[9.5px] italic ${currentStyle.bodyText}`}>
                    {clientDetails.projectDescription ? `"${clientDetails.projectDescription}"` : 'Standard Custom Deliverables & Activities'}
                  </span>
                </div>

                {clientDetails.targetTimeline && (
                  <div className="flex items-center gap-2">
                    <span className={`text-[8.5px] font-mono uppercase tracking-wider font-semibold ${currentStyle.mutedText}`}>
                      Target Schedule:
                    </span>
                    <span className={`inline-block font-mono text-[8.5px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider shadow-sm ${
                      clientDetails.targetTimeline === 'rush' 
                        ? 'bg-amber-500 text-black border border-amber-600' 
                        : clientDetails.targetTimeline === 'relaxed'
                        ? 'bg-emerald-500 text-black border border-emerald-600'
                        : 'bg-zinc-800 text-white border border-zinc-700'
                    }`}>
                      {clientDetails.targetTimeline === 'rush' ? 'Rush (2–4 wks)' : clientDetails.targetTimeline === 'relaxed' ? 'Relaxed (3+ mos)' : 'Standard (1–2 mos)'}
                    </span>
                  </div>
                )}
              </div>

            {/* LEDGER WORK ITEMS TABLE */}
            <div className="flex-grow text-left" id="canvas-ledger">
              <span className={`block mb-3 font-bold uppercase tracking-widest text-[9px] ${currentStyle.fontHeader} ${currentStyle.boldText}`}>
                ESTIMATED DELIVERABLES & ACTIVITIES
              </span>
              
              {items.length === 0 ? (
                <div className={`p-8 border border-dashed text-center text-zinc-500 text-[11px] ${currentStyle.borderLine}`}>
                  No items configured in draft quotation. Open the editor above to inject services.
                </div>
              ) : (
                <div className="w-full overflow-x-auto -webkit-overflow-scrolling-touch">
                  <table className="w-full text-left text-[11px] border-collapse min-w-[540px]">
                    <thead>
                      <tr className={`border-b ${currentStyle.borderLine} ${currentStyle.tableHeaderBg} ${currentStyle.mutedText} uppercase text-[8px] font-bold tracking-wider`}>
                        <th className="py-2.5 px-3 text-left">Activity Description</th>
                        <th className="py-2.5 text-right px-2 whitespace-nowrap">Category</th>
                        <th className="py-2.5 text-right px-2 whitespace-nowrap">Price</th>
                        <th className="py-2.5 text-center px-2 whitespace-nowrap">Qty</th>
                        <th className="py-2.5 text-right pr-3 whitespace-nowrap">Total</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${currentStyle.divideLine}`}>
                      {items.map((item) => (
                        <tr key={item.id} className={`${currentStyle.bodyText} ${currentStyle.fontDoc}`}>
                          <td className="py-3 px-3 pr-4 vertical-top text-left">
                            <p className={`font-semibold text-[11px] ${currentStyle.boldText}`}>{item.title}</p>
                            <p className={`text-[9.5px] mt-0.5 leading-relaxed ${currentStyle.mutedText}`}>{item.description}</p>
                          </td>
                          <td className="py-3 text-right text-[9px] uppercase pr-2 whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 font-mono text-[8.5px] rounded whitespace-nowrap ${currentStyle.highlightBadge}`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 text-right font-mono pr-2">₱{item.unitPrice.toLocaleString()}</td>
                          <td className="py-3 text-center font-mono">{item.quantity}</td>
                          <td className={`py-3 text-right font-mono font-bold pr-3 ${currentStyle.boldText}`}>
                            ₱{(item.unitPrice * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* TOTALS & PAYMENT TERMS BREAKDOWN (Responsive 1-col on mobile, 2-col on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 items-start my-2" id="canvas-billing-breakdown">
              {/* LEFT CARD: PAYMENT & SETTLEMENT TERMS (Dynamic config.notes) */}
              <div className={`p-4 rounded-xl border ${currentStyle.borderLineSubtle} ${currentStyle.badgeBg} flex flex-col gap-2.5 text-left shadow-sm h-full justify-between`}>
                <div className="flex items-center justify-between pb-1">
                  <span className={`text-[8.5px] font-mono font-extrabold uppercase tracking-widest ${currentStyle.boldText} flex items-center gap-1.5`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> PAYMENT & SETTLEMENT TERMS
                  </span>
                  <span className={`text-[8px] font-mono font-bold uppercase tracking-wider ${currentStyle.mutedText}`}>EDITABLE</span>
                </div>

                <div className="flex flex-col gap-1.5 text-[9.5px]">
                  <p className={`leading-relaxed text-[9.5px] font-medium ${currentStyle.bodyText}`}>
                    {config.notes ? config.notes.trim() : "50% upfront deposit required. Remainder due upon visual acceptance & final project delivery."}
                  </p>

                  <div className="flex justify-between items-center text-[9px] pt-1 mt-1">
                    <span className={`font-mono text-[8px] uppercase tracking-wider ${currentStyle.mutedText}`}>PRICE LOCK GUARANTEE:</span>
                    <span className={`font-mono font-bold ${currentStyle.boldText}`}>Valid to {config.expiryDate}</span>
                  </div>
                </div>

                <div className={`text-[8px] ${currentStyle.mutedText} pt-1 mt-0.5 leading-tight`}>
                  Billed in Philippine Peso (PHP). Payable via Bank, GCash, or Direct Wire.
                </div>
              </div>

              {/* RIGHT CARD: TOTALS CALCULATION BREAKDOWN */}
              <div className={`w-full flex flex-col gap-2 text-right leading-relaxed p-4 rounded-xl border ${currentStyle.borderLineSubtle} ${currentStyle.badgeBg} ${currentStyle.bodyText} shadow-sm`}>
                <div className="pb-2 flex flex-col gap-1.5">
                  {basePrice > 0 && (
                    <div className={`flex justify-between items-center ${currentStyle.bodyText}`}>
                      <span className="uppercase tracking-wider text-[8px]">
                        {clientDetails.clientType === 'student' ? 'Base Project Fee (Student):' : `Base Project Fee (${clientDetails.professionalTier === 'enterprise' ? 'Enterprise' : clientDetails.professionalTier === 'growth' ? 'Growth' : 'Starter'}):`}
                      </span>
                      <span className="font-mono">₱{basePrice.toLocaleString()}</span>
                    </div>
                  )}
                  {ledgerSubTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="uppercase tracking-wider text-[8px]">LEDGER ITEMS SUB-SUM:</span>
                      <span className="font-mono font-medium">₱{ledgerSubTotal.toLocaleString()}</span>
                    </div>
                  )}
                  {basePrice > 0 && ledgerSubTotal > 0 && (
                    <div className={`flex justify-between items-center ${currentStyle.mutedText} pt-1 mt-1`}>
                      <span className="uppercase tracking-wider text-[8px]">COMBINED SUB-SUMS:</span>
                      <span className="font-mono">₱{subtotal.toLocaleString()}</span>
                    </div>
                  )}
                  {config.enableDiscount && config.discount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700">
                      <span className="uppercase tracking-wider text-[8px] text-emerald-700">Studio Discount ({config.discount}%):</span>
                      <span className="font-mono">-₱{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {config.enableTax && config.taxRate > 0 && (
                    <div className={`flex justify-between items-center ${currentStyle.mutedText}`}>
                      <span className="uppercase tracking-wider text-[8px]">EST. ADD-ON TAX ({config.taxRate}%):</span>
                      <span className="font-mono">+₱{taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-1 gap-1 text-right" id="final-total">
                  <span className={`${currentStyle.fontHeader} font-black text-[9px] sm:text-xs uppercase tracking-widest ${currentStyle.boldText} text-left sm:text-right`}>TOTAL ESTIMATED AMOUNT:</span>
                  <span className={`font-mono font-extrabold text-xs sm:text-sm ${currentStyle.boldText} shrink-0`}>
                    ₱{Math.round(totalAmount).toLocaleString()}
                  </span>
                </div>
                <div className={`mt-1 text-[8px] ${currentStyle.mutedText} leading-none`}>
                  Calculated automatically. Sum representation in Philippine Peso (PHP).
                </div>
              </div>
            </div>

            {/* PINNED BOTTOM SECTION: SIGNATURES */}
            <div className="pt-4 flex flex-col gap-4" id="canvas-bottom-pinned-footer">
              <div className="grid grid-cols-2 gap-12 mt-2" id="canvas-sign-box">
                <div className="flex flex-col gap-1.5 text-left">
                  <div className={`h-10 border-b ${currentStyle.borderLine} relative flex items-end pb-1 overflow-visible`}>
                    <span className={`inline-block font-sans text-[11px] font-medium tracking-wide ${currentStyle.boldText} ml-1 select-none`}>
                      {config.approvedBy || 'Next Studio'}
                    </span>
                  </div>
                  <span className={`text-[7px] uppercase font-bold tracking-widest ${currentStyle.mutedText}`}>AUTHORIZED SIGNATURE ({config.approvedBy || 'Studio'})</span>
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <div className={`h-10 border-b ${currentStyle.borderLine} relative flex items-end pb-1 overflow-visible`}>
                    {clientDetails.name && (
                      <span className={`inline-block font-sans text-[11px] font-medium tracking-wide ${currentStyle.boldText} ml-1 select-none`}>
                        {clientDetails.name}
                      </span>
                    )}
                  </div>
                  <span className={`text-[7px] uppercase font-bold tracking-widest ${currentStyle.mutedText}`}>CLIENT ACCEPTANCE</span>
                </div>
              </div>

              {/* Page Number Credit Line */}
              <div className={`flex items-center justify-between pt-2 border-t ${currentStyle.borderLineSubtle} text-[8px] font-mono tracking-widest ${currentStyle.mutedText}`}>
                <span>{config.approvedBy || 'NEXT TECHNOLOGY'} — OFFICIAL QUOTATION</span>
                <span>PAGE 01/01</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
