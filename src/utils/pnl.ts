import { Trade, PnLData, Portfolio } from '@/types';

/**
 * Calculate PnL for a single trade
 * @param trade - The trade object
 * @returns The profit/loss value
 */
export function calculateTradePnL(trade: Trade): number {
  return (trade.exitPrice - trade.entryPrice) * trade.quantity;
}

/**
 * Calculate PnL for a single trade with entry and exit prices
 * @param entryPrice - Entry price per share
 * @param exitPrice - Exit price per share  
 * @param quantity - Number of shares
 * @returns The profit/loss value
 */
export function calculatePnL(entryPrice: number, exitPrice: number, quantity: number): number {
  return (exitPrice - entryPrice) * quantity;
}

/**
 * Calculate cumulative PnL data for charting
 * @param trades - Array of trades sorted by date
 * @returns Array of PnL data points with cumulative values
 */
export function calculateCumulativePnL(trades: Trade[]): PnLData[] {
  // Sort trades by date to ensure proper chronological order
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let cumulativeValue = 0;
  
  return sortedTrades.map(trade => {
    const pnl = trade.pnl || calculateTradePnL(trade);
    cumulativeValue += pnl;
    
    return {
      date: new Date(trade.date),
      value: pnl,
      cumulativeValue,
      ticker: trade.ticker
    };
  });
}

/**
 * Calculate total PnL for an array of trades
 * @param trades - Array of trades
 * @returns Total profit/loss
 */
export function calculateTotalPnL(trades: Trade[]): number {
  return trades.reduce((total, trade) => {
    return total + (trade.pnl || calculateTradePnL(trade));
  }, 0);
}

/**
 * Calculate portfolio performance metrics
 * @param portfolio - Portfolio object with initial value
 * @param trades - Array of trades for the portfolio
 * @returns Portfolio performance metrics
 */
export function calculatePortfolioPerformance(portfolio: Portfolio, trades: Trade[]) {
  const totalPnL = calculateTotalPnL(trades);
  const currentValue = portfolio.initialValue + totalPnL;
  const returnPercentage = portfolio.initialValue > 0 
    ? (totalPnL / portfolio.initialValue) * 100 
    : 0;

  return {
    initialValue: portfolio.initialValue,
    totalPnL,
    currentValue,
    returnPercentage,
    totalTrades: trades.length,
    profitableTrades: trades.filter(trade => (trade.pnl || calculateTradePnL(trade)) > 0).length,
    losingTrades: trades.filter(trade => (trade.pnl || calculateTradePnL(trade)) < 0).length,
    winRate: trades.length > 0 
      ? (trades.filter(trade => (trade.pnl || calculateTradePnL(trade)) > 0).length / trades.length) * 100 
      : 0
  };
}

/**
 * Get best and worst performing trades
 * @param trades - Array of trades
 * @returns Object with best and worst trades
 */
export function getBestWorstTrades(trades: Trade[]) {
  if (trades.length === 0) {
    return { bestTrade: null, worstTrade: null };
  }

  const tradesWithPnL = trades.map(trade => ({
    ...trade,
    calculatedPnL: trade.pnl || calculateTradePnL(trade)
  }));

  const sortedByPnL = tradesWithPnL.sort((a, b) => b.calculatedPnL - a.calculatedPnL);

  return {
    bestTrade: sortedByPnL[0],
    worstTrade: sortedByPnL[sortedByPnL.length - 1]
  };
}

/**
 * Calculate average trade PnL
 * @param trades - Array of trades
 * @returns Average profit/loss per trade
 */
export function calculateAveragePnL(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  
  const totalPnL = calculateTotalPnL(trades);
  return totalPnL / trades.length;
}

/**
 * Group trades by ticker and calculate PnL for each
 * @param trades - Array of trades
 * @returns Object with ticker as key and total PnL as value
 */
export function calculatePnLByTicker(trades: Trade[]): Record<string, number> {
  return trades.reduce((acc, trade) => {
    const pnl = trade.pnl || calculateTradePnL(trade);
    acc[trade.ticker] = (acc[trade.ticker] || 0) + pnl;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate monthly PnL aggregation
 * @param trades - Array of trades
 * @returns Array of monthly PnL data
 */
export function calculateMonthlyPnL(trades: Trade[]): Array<{
  month: string;
  year: number;
  totalPnL: number;
  tradeCount: number;
}> {
  const monthlyData = trades.reduce((acc, trade) => {
    const date = new Date(trade.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const pnl = trade.pnl || calculateTradePnL(trade);
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        totalPnL: 0,
        tradeCount: 0
      };
    }
    
    acc[monthKey].totalPnL += pnl;
    acc[monthKey].tradeCount += 1;
    
    return acc;
  }, {} as Record<string, any>);

  return Object.values(monthlyData).sort((a, b) => {
    const aDate = new Date(a.year, Object.keys(monthlyData).indexOf(`${a.year}-${String(new Date(`${a.month} 1, ${a.year}`).getMonth() + 1).padStart(2, '0')}`));
    const bDate = new Date(b.year, Object.keys(monthlyData).indexOf(`${b.year}-${String(new Date(`${b.month} 1, ${b.year}`).getMonth() + 1).padStart(2, '0')}`));
    return aDate.getTime() - bDate.getTime();
  });
}

/**
 * Format PnL value for display
 * @param pnl - PnL value
 * @param showSign - Whether to show + sign for positive values
 * @returns Formatted string
 */
export function formatPnL(pnl: number, showSign: boolean = true): string {
  const sign = showSign && pnl > 0 ? '+' : '';
  return `${sign}$${pnl.toFixed(2)}`;
}

/**
 * Format percentage for display
 * @param percentage - Percentage value
 * @param showSign - Whether to show + sign for positive values
 * @returns Formatted string
 */
export function formatPercentage(percentage: number, showSign: boolean = true): string {
  const sign = showSign && percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}

/**
 * Calculate Sharpe ratio (simplified version using daily returns)
 * @param trades - Array of trades
 * @param riskFreeRate - Risk-free rate (annualized)
 * @returns Sharpe ratio
 */
export function calculateSharpeRatio(trades: Trade[], riskFreeRate: number = 0.02): number {
  if (trades.length < 2) return 0;

  const dailyReturns = trades.map(trade => trade.pnl || calculateTradePnL(trade));
  const avgReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
  
  // Calculate standard deviation
  const variance = dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / dailyReturns.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return 0;
  
  // Simplified Sharpe ratio calculation
  const excessReturn = avgReturn - (riskFreeRate / 252); // Daily risk-free rate
  return excessReturn / stdDev;
}
