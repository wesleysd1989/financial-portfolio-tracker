import { 
  calculateTradePnL, 
  calculatePnL, 
  calculateTotalPnL, 
  calculateCumulativePnL,
  calculatePortfolioPerformance,
  getBestWorstTrades,
  formatPnL,
  formatPercentage
} from './pnl';
import { Trade, Portfolio } from '../../types';

// Mock trade data for testing
const mockTrades: Trade[] = [
  {
    id: 1,
    ticker: 'AAPL',
    entryPrice: 150,
    exitPrice: 160,
    quantity: 10,
    date: new Date('2024-01-15'),
    portfolioId: 1,
    pnl: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    ticker: 'GOOGL',
    entryPrice: 2500,
    exitPrice: 2400,
    quantity: 5,
    date: new Date('2024-01-16'),
    portfolioId: 1,
    pnl: -500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    ticker: 'MSFT',
    entryPrice: 300,
    exitPrice: 320,
    quantity: 8,
    date: new Date('2024-01-17'),
    portfolioId: 1,
    pnl: 160,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockPortfolio: Portfolio = {
  id: 1,
  name: 'Test Portfolio',
  initialValue: 10000,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
};

// Test functions (these would normally be run with a testing framework like Jest)
console.log('🧪 Testing PnL Utility Functions');

// Test calculateTradePnL
console.log('\n📊 Testing calculateTradePnL:');
const trade1PnL = calculateTradePnL(mockTrades[0]);
console.log(`Trade 1 P&L: ${trade1PnL} (expected: 100)`);

// Test calculatePnL
console.log('\n📊 Testing calculatePnL:');
const directPnL = calculatePnL(150, 160, 10);
console.log(`Direct P&L calculation: ${directPnL} (expected: 100)`);

// Test calculateTotalPnL
console.log('\n📊 Testing calculateTotalPnL:');
const totalPnL = calculateTotalPnL(mockTrades);
console.log(`Total P&L: ${totalPnL} (expected: -240)`);

// Test calculateCumulativePnL
console.log('\n📊 Testing calculateCumulativePnL:');
const cumulativePnL = calculateCumulativePnL(mockTrades);
console.log('Cumulative P&L data:');
cumulativePnL.forEach((point, index) => {
  console.log(`  ${point.date.toDateString()}: ${point.ticker} = ${point.value}, Cumulative: ${point.cumulativeValue}`);
});

// Test calculatePortfolioPerformance
console.log('\n📊 Testing calculatePortfolioPerformance:');
const performance = calculatePortfolioPerformance(mockPortfolio, mockTrades);
console.log('Portfolio Performance:', {
  initialValue: performance.initialValue,
  totalPnL: performance.totalPnL,
  currentValue: performance.currentValue,
  returnPercentage: performance.returnPercentage.toFixed(2) + '%',
  totalTrades: performance.totalTrades,
  profitableTrades: performance.profitableTrades,
  losingTrades: performance.losingTrades,
  winRate: performance.winRate.toFixed(2) + '%'
});

// Test getBestWorstTrades
console.log('\n📊 Testing getBestWorstTrades:');
const bestWorst = getBestWorstTrades(mockTrades);
console.log(`Best trade: ${bestWorst.bestTrade?.ticker} (${bestWorst.bestTrade?.calculatedPnL})`);
console.log(`Worst trade: ${bestWorst.worstTrade?.ticker} (${bestWorst.worstTrade?.calculatedPnL})`);

// Test formatting functions
console.log('\n📊 Testing formatting functions:');
console.log(`Format P&L positive: ${formatPnL(150.75)}`);
console.log(`Format P&L negative: ${formatPnL(-89.50)}`);
console.log(`Format percentage positive: ${formatPercentage(12.34)}`);
console.log(`Format percentage negative: ${formatPercentage(-5.67)}`);

console.log('\n✅ All tests completed!');
