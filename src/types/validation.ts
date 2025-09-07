// Types for form validation
// This file can be used with libraries like Zod, Yup, etc.

// Validation schemas for Portfolio
export interface PortfolioValidationSchema {
  name: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  initialValue: {
    required: boolean;
    min: number;
    max: number;
  };
}

// Validation schemas for Trade
export interface TradeValidationSchema {
  ticker: {
    required: boolean;
    minLength: number;
    maxLength: number;
    pattern: RegExp; // E.g.: /^[A-Z]{1,5}$/ for stock symbols
  };
  entryPrice: {
    required: boolean;
    min: number;
    max: number;
    decimal: boolean;
  };
  exitPrice: {
    required: boolean;
    min: number;
    max: number;
    decimal: boolean;
  };
  quantity: {
    required: boolean;
    min: number;
    max: number;
    integer: boolean;
  };
  date: {
    required: boolean;
    maxDate?: Date; // Cannot be in the future
    minDate?: Date; // Cannot be too far in the past
  };
  portfolioId: {
    required: boolean;
    min: number;
  };
}

// Types for validation error messages
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validation constants
export const VALIDATION_RULES = {
  PORTFOLIO: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    INITIAL_VALUE_MIN: 0.01,
    INITIAL_VALUE_MAX: 10000000, // 10 million
  },
  TRADE: {
    TICKER_MIN_LENGTH: 1,
    TICKER_MAX_LENGTH: 10,
    TICKER_PATTERN: /^[A-Z0-9]{1,10}$/,
    PRICE_MIN: 0.01,
    PRICE_MAX: 100000, // 100k per share
    QUANTITY_MIN: 1,
    QUANTITY_MAX: 1000000, // 1 million shares
    DATE_MIN_YEARS_AGO: 10,
  },
} as const;

// Default error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
  TOO_SHORT: (min: number) => `Must have at least ${min} characters`,
  TOO_LONG: (max: number) => `Must have at most ${max} characters`,
  TOO_SMALL: (min: number) => `Must be greater than ${min}`,
  TOO_LARGE: (max: number) => `Must be less than ${max}`,
  INVALID_DATE: 'Invalid date',
  FUTURE_DATE: 'Date cannot be in the future',
  PAST_DATE: (years: number) => `Date cannot be more than ${years} years ago`,
  INVALID_TICKER: 'Symbol must contain only letters and numbers (e.g.: AAPL, GOOGL)',
  INVALID_NUMBER: 'Must be a valid number',
  INVALID_INTEGER: 'Must be an integer',
  PORTFOLIO_NOT_FOUND: 'Portfolio not found',
  DUPLICATE_TRADE: 'A similar trade already exists for this ticker and date',
} as const;

// Types for validation hooks
export interface UseFormValidationOptions<T> {
  schema: any; // Zod schema or similar
  mode?: 'onSubmit' | 'onChange' | 'onBlur';
  reValidateMode?: 'onSubmit' | 'onChange' | 'onBlur';
}

export interface UseFormValidationReturn<T> {
  errors: Record<keyof T, string | undefined>;
  isValid: boolean;
  validate: (data: T) => Promise<boolean>;
  clearErrors: () => void;
  setError: (field: keyof T, message: string) => void;
}
