export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const PRESET_CURRENCIES: Currency[] = [
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
];

export const DEFAULT_CURRENCY = PRESET_CURRENCIES[0]; // PHP

export function getCurrencyConfig(code?: string, symbol?: string, name?: string): { code: string; symbol: string; name: string } {
  if (code && code !== 'CUSTOM') {
    const found = PRESET_CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (found) {
      return {
        code: found.code,
        symbol: symbol || found.symbol,
        name: name || found.name,
      };
    }
  }

  return {
    code: code || 'PHP',
    symbol: symbol !== undefined && symbol !== '' ? symbol : '₱',
    name: name || (code === 'USD' ? 'US Dollar' : 'Philippine Peso'),
  };
}
