// Tipos principais baseados nos modelos Prisma
export interface Portfolio {
  id: number;
  name: string;
  initialValue: number;
  createdAt: Date;
  updatedAt: Date;
  trades?: Trade[]; // Relacionamento opcional
}

export interface Trade {
  id: number;
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: Date;
  portfolioId: number;
  createdAt: Date;
  updatedAt: Date;
  portfolio?: Portfolio; // Relacionamento opcional
}

// Tipos para dados de PnL e análise
export interface PnLData {
  date: Date;
  value: number;
  cumulativeValue: number;
  ticker?: string;
}

export interface PortfolioPnL {
  portfolioId: number;
  portfolioName: string;
  totalPnL: number;
  initialValue: number;
  currentValue: number;
  returnPercentage: number;
  trades: TradePnL[];
}

export interface TradePnL {
  id: number;
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: Date;
  pnl: number;
  returnPercentage: number;
}

// Tipos para formulários
export interface CreatePortfolioForm {
  name: string;
  initialValue: number;
}

export interface CreateTradeForm {
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: Date;
  portfolioId: number;
}

export interface UpdatePortfolioForm {
  name?: string;
  initialValue?: number;
}

export interface UpdateTradeForm {
  ticker?: string;
  entryPrice?: number;
  exitPrice?: number;
  quantity?: number;
  date?: Date;
}

// Types for filters and searches
export interface TradeFilters {
  portfolioId?: number;
  ticker?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minPnL?: number;
  maxPnL?: number;
}

export interface PortfolioFilters {
  name?: string;
  minInitialValue?: number;
  maxInitialValue?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para componentes de tabela/lista
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Tipos para gráficos
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface PortfolioChartData {
  portfolioId: number;
  portfolioName: string;
  data: ChartDataPoint[];
}

// Tipos para dashboard
export interface DashboardStats {
  totalPortfolios: number;
  totalTrades: number;
  totalPnL: number;
  bestPerformingPortfolio: {
    id: number;
    name: string;
    pnl: number;
    returnPercentage: number;
  };
  worstPerformingPortfolio: {
    id: number;
    name: string;
    pnl: number;
    returnPercentage: number;
  };
  recentTrades: Trade[];
}

// Types for notifications and UI
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

// Tipos utilitários
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Tipos para status de loading
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data?: T | null;
}

// Tipos para contextos React
export interface PortfolioContextType {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  loading: LoadingState;
  createPortfolio: (data: CreatePortfolioForm) => Promise<Portfolio>;
  updatePortfolio: (id: number, data: UpdatePortfolioForm) => Promise<Portfolio>;
  deletePortfolio: (id: number) => Promise<void>;
  selectPortfolio: (portfolio: Portfolio | null) => void;
  refreshPortfolios: () => Promise<void>;
}

export interface TradeContextType {
  trades: Trade[];
  loading: LoadingState;
  createTrade: (data: CreateTradeForm) => Promise<Trade>;
  updateTrade: (id: number, data: UpdateTradeForm) => Promise<Trade>;
  deleteTrade: (id: number) => Promise<void>;
  refreshTrades: (portfolioId?: number) => Promise<void>;
  filterTrades: (filters: TradeFilters) => Promise<Trade[]>;
}
