import React, { useRef } from 'react';
import { ClientDetails } from '../types';
import { User, Phone, Mail, Building, FileText, AlertCircle, GraduationCap, Briefcase, Clock } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';

interface FormProps {
  details: ClientDetails;
  onUpdate: (fields: Partial<ClientDetails>) => void;
  showValidationErrors: boolean;
}

const SPRING = { type: 'spring', stiffness: 300, damping: 30 };

// 3D tilt card with mouse tracking
function TiltCard({ children, className, onClick, isSelected }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [6, -6]);
  const rotateY = useTransform(x, [-50, 50], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      whileHover={{ scale: 1.02, translateZ: 8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`text-left cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[110px] rounded-3xl p-5 glass-panel ${
        isSelected
          ? 'border-2 border-white/30 bg-white/10'
          : 'border border-white/06'
      } ${className || ''}`}
    >
      {children}
    </motion.button>
  );
}

// Animated field wrapper
function Field({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ClientDetailsForm({ details, onUpdate, showValidationErrors }: FormProps) {
  const isNameEmpty  = !details.name.trim();
  const isPhoneEmpty = !details.contactNumber.trim();
  const isEmailEmpty = !details.email.trim();

  return (
    <div className="flex flex-col gap-6" id="client-details-section">

      {/* Validation Banner */}
      <AnimatePresence>
        {showValidationErrors && (isNameEmpty || isPhoneEmpty || isEmailEmpty) && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-rose-500/08 border border-rose-500/25 rounded-2xl p-4 backdrop-blur-md"
            id="validation-banner"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-rose-500/15 text-rose-400 rounded-xl mt-0.5">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-rose-400">Please fill in the required fields before generating a PDF.</h3>
                <p className="text-xs text-rose-400/60 mt-1">
                  <span className="font-bold text-rose-400">Name</span>, <span className="font-bold text-rose-400">Phone</span>, and <span className="font-bold text-rose-400">Email</span> are required.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="form-grid">

        <Field delay={0.05}>
          <div className="flex flex-col gap-1.5" id="field-name">
            <label className="text-[10px] uppercase font-bold tracking-wider text-white/35 flex items-center justify-between">
              <span>Client's Full Name <span className="text-rose-500">*</span></span>
              {showValidationErrors && isNameEmpty && <span className="text-[10px] text-rose-400">Required</span>}
            </label>
            <div className="relative">
              <User className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-white/20 pointer-events-none" />
              <input
                type="text" placeholder="e.g. Julianna Mercer"
                value={details.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-2xl glass-input transition-all outline-none ${showValidationErrors && isNameEmpty ? 'border-rose-500/50 bg-rose-500/06' : ''}`}
              />
            </div>
          </div>
        </Field>

        <Field delay={0.09}>
          <div className="flex flex-col gap-1.5" id="field-phone">
            <label className="text-[10px] uppercase font-bold tracking-wider text-white/35 flex items-center justify-between">
              <span>Phone Number <span className="text-rose-500">*</span></span>
              {showValidationErrors && isPhoneEmpty && <span className="text-[10px] text-rose-400">Required</span>}
            </label>
            <div className="relative">
              <Phone className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-white/20 pointer-events-none" />
              <input
                type="tel" placeholder="e.g. +63 912 345 6789"
                value={details.contactNumber}
                onChange={(e) => onUpdate({ contactNumber: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-2xl glass-input transition-all outline-none ${showValidationErrors && isPhoneEmpty ? 'border-rose-500/50 bg-rose-500/06' : ''}`}
              />
            </div>
          </div>
        </Field>

        <Field delay={0.13}>
          <div className="flex flex-col gap-1.5" id="field-email">
            <label className="text-[10px] uppercase font-bold tracking-wider text-white/35 flex items-center justify-between">
              <span>Email Address <span className="text-rose-500">*</span></span>
              {showValidationErrors && isEmailEmpty && <span className="text-[10px] text-rose-400">Required</span>}
            </label>
            <div className="relative">
              <Mail className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-white/20 pointer-events-none" />
              <input
                type="email" placeholder="e.g. client@company.com"
                value={details.email}
                onChange={(e) => onUpdate({ email: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-2xl glass-input transition-all outline-none ${showValidationErrors && isEmailEmpty ? 'border-rose-500/50 bg-rose-500/06' : ''}`}
              />
            </div>
          </div>
        </Field>

        <Field delay={0.17}>
          <div className="flex flex-col gap-1.5" id="field-company">
            <label className="text-[10px] uppercase font-bold tracking-wider text-white/35">
              Company / Organization <span className="text-[9px] font-normal text-white/20">(Optional)</span>
            </label>
            <div className="relative">
              <Building className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-white/20 pointer-events-none" />
              <input
                type="text" placeholder="e.g. Studio Artisan LLC"
                value={details.companyName || ''}
                onChange={(e) => onUpdate({ companyName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl glass-input transition-all outline-none"
              />
            </div>
          </div>
        </Field>

        <Field delay={0.21} className="md:col-span-2">
          <div className="flex flex-col gap-1.5 w-full" id="field-scope">
            <label className="text-[10px] uppercase font-bold tracking-wider text-white/35">
              Project Overview <span className="text-[9px] font-normal text-white/20">(Optional)</span>
            </label>
            <div className="relative w-full">
              <FileText className="absolute top-3.5 left-3.5 h-4 w-4 text-white/20 pointer-events-none" />
              <textarea
                rows={3} placeholder="Provide a brief on deliverables, style preferences, or special requirements."
                value={details.projectDescription || ''}
                onChange={(e) => onUpdate({ projectDescription: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl glass-input transition-all outline-none resize-y"
              />
            </div>
          </div>
        </Field>
      </div>

      {/* ── Client Classification ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.25 }}
        className="border-t border-white/06 pt-6 mt-6 flex flex-col gap-4"
        id="client-type-estimation"
      >
        <div>
          <h3 className="text-sm font-bold text-white/70">What type of client is this?</h3>
          <p className="text-xs text-white/25 mt-1">Select the client category for this quotation.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Academic */}
          <TiltCard onClick={() => onUpdate({ clientType: 'student', basePrice: 0, professionalTier: undefined })} isSelected={details.clientType === 'student'}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/06 text-white/50">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-white/30">STUDENT / ACADEMIC</span>
                  <h4 className="font-display font-bold text-base text-white">School Project</h4>
                </div>
              </div>
              {details.clientType === 'student' && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="h-2.5 w-2.5 rounded-full bg-white shadow-sm shadow-white/50"
                />
              )}
            </div>
            <p className="text-xs text-white/35 line-clamp-2 leading-relaxed mt-2.5">For thesis, capstone, or personal portfolio projects.</p>
          </TiltCard>

          {/* Professional */}
          <TiltCard
            onClick={() => onUpdate({ clientType: 'professional', professionalTier: details.professionalTier || 'starter', basePrice: 0 })}
            isSelected={details.clientType === 'professional'}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/06 text-white/50">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-white/30">BUSINESS / COMMERCIAL</span>
                  <h4 className="font-display font-bold text-base text-white">Business Client</h4>
                </div>
              </div>
              {details.clientType === 'professional' && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="h-2.5 w-2.5 rounded-full bg-white shadow-sm shadow-white/50"
                />
              )}
            </div>
            <p className="text-xs text-white/35 line-clamp-2 leading-relaxed mt-2.5">For businesses, startups, and agencies needing a professional website or app.</p>
          </TiltCard>
        </div>

        {/* Professional sub-tier */}
        <AnimatePresence>
          {details.clientType === 'professional' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="glass-card p-6 rounded-3xl flex flex-col gap-4"
              id="professional-subs-tier"
            >
              <div>
                <h5 className="text-sm font-bold text-white/60">How big is the project?</h5>
                <p className="text-xs text-white/30 mt-0.5">Choose the project scope that fits your client's requirements.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'starter',    label: 'Starter',    desc: 'Small websites, landing pages, lightweight MVPs.' },
                  { id: 'growth',     label: 'Growth',     desc: 'Custom platforms, dashboards, multi-page web apps.', popular: true },
                  { id: 'enterprise', label: 'Enterprise', desc: 'Complex systems, full-stack enterprise applications.' },
                ].map((tier, i) => (
                  <motion.button
                    key={tier.id}
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.03, translateY: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onUpdate({ professionalTier: tier.id as any, basePrice: 0 })}
                    className={`p-4 rounded-2xl text-left glass-panel-interactive transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                      details.professionalTier === tier.id
                        ? 'border-2 border-white/25 bg-white/08'
                        : 'border border-white/06'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-2.5 right-3 bg-white text-black text-[8px] font-extrabold px-2 py-0.5 rounded-full tracking-wider shadow-md">POPULAR</span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-white/70">{tier.label}</span>
                      {details.professionalTier === tier.id && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-2 w-2 rounded-full bg-white/80 shadow-sm shadow-white/50" />
                      )}
                    </div>
                    <p className="text-xs text-white/35 leading-relaxed">{tier.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.3 }}
          className="glass-card p-6 rounded-3xl flex flex-col gap-4"
          id="target-timeline-section"
        >
          <div>
            <h5 className="text-sm font-bold text-white/60 flex items-center gap-2">
              <Clock className="h-4 w-4 text-white/25" /> When does the client need it?
            </h5>
            <p className="text-xs text-white/30 mt-0.5">Select the delivery timeline for this project.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'rush',     label: 'URGENT / RUSH',   time: '2–4 Weeks'  },
              { id: 'standard', label: 'STANDARD',        time: '1–2 Months' },
              { id: 'relaxed',  label: 'NO RUSH',         time: '3+ Months'  },
            ].map((tl, i) => {
              const isSelected = details.targetTimeline === tl.id || (!details.targetTimeline && tl.id === 'standard');
              return (
                <motion.button
                  key={tl.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onUpdate({ targetTimeline: tl.id as any })}
                  className={`p-4 rounded-2xl text-left cursor-pointer flex flex-col gap-2 border-2 transition-all relative ${
                    isSelected
                      ? 'border-white bg-white/10 shadow-lg'
                      : 'border-white/06 bg-white/02 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-white/40'}`}>{tl.label}</span>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="h-2.5 w-2.5 rounded-full bg-white shadow-sm shadow-white/50"
                      />
                    )}
                  </div>
                  <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-white/50'}`}>{tl.time}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
