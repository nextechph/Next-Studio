export interface ClientDetails {
  name: string;
  contactNumber: string;
  email: string;
  companyName?: string;
  address?: string;
  projectDescription?: string;
  clientType?: 'student' | 'professional';
  professionalTier?: 'starter' | 'growth' | 'enterprise';
  basePrice?: number;
  targetTimeline?: 'rush' | 'standard' | 'relaxed';
}

export interface QuotationItem {
  id: string;
  title: string;
  description: string;
  unitPrice: number;
  quantity: number;
  category: string;
}

export type BrandingTheme = 'next-tech' | 'next-light' | 'minimalist-outline' | 'executive-slate' | 'nordic-cold';

export interface BrandingConfig {
  theme: BrandingTheme;
  quoteNumber: string;
  issueDate: string;
  expiryDate: string;
  notes: string;
  terms: string;
  discount: number;
  taxRate: number; // in percentage, e.g., 12 for 12%
  enableDiscount?: boolean;
  enableTax?: boolean;
  approvedBy?: string;
  approvedByHQ?: string;
  approvedByEmail?: string;
  approvedByWeb?: string;
  logoUrl?: string;
  logoHeight?: number; // Logo height in pixels
  currency?: string; // Currency code, e.g. 'PHP', 'USD', 'EUR'
  currencySymbol?: string; // Currency symbol, e.g. '₱', '$', '€'
  currencyName?: string; // Currency full name, e.g. 'Philippine Peso'
}

export interface SavedQuote {
  id: string;
  clientDetails: ClientDetails;
  items: QuotationItem[];
  config: BrandingConfig;
  totalAmount: number;
  createdAt: string;
}

