import { 
  Portfolio, 
  Trade, 
  CreatePortfolioForm, 
  CreateTradeForm,
  PnLData,
  PortfolioPnL,
  TradePnL,
  ApiResponse,
  DashboardStats,
  Optional
} from '../src/types/index';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '../src/types/validation';

// Type testing - this file won't be executed, only compiled to verify types

function testPortfolioType() {
  const portfolio: Portfolio = {
    id: 1,
    name: 'My Portfolio',
    initialValue: 10000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log('Portfolio:', portfolio);
}

function testTradeType() {
  const trade: Trade = {
    id: 1,
    ticker: 'AAPL',
    entryPrice: 150.0,
    exitPrice: 160.0,
    quantity: 10,
    date: new Date(),
    portfolioId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log('Trade:', trade);
}

function testFormTypes() {
  const portfolioForm: CreatePortfolioForm = {
    name: 'New Portfolio',
    initialValue: 15000,
  };

  const tradeForm: CreateTradeForm = {
    ticker: 'GOOGL',
    entryPrice: 2500,
    exitPrice: 2600,
    quantity: 5,
    date: new Date(),
    portfolioId: 1,
  };

  console.log('Forms:', { portfolioForm, tradeForm });
}

function testPnLTypes() {
  const pnlData: PnLData = {
    date: new Date(),
    value: 100,
    cumulativeValue: 500,
    ticker: 'AAPL',
  };

  const tradePnL: TradePnL = {
    id: 1,
    ticker: 'AAPL',
    entryPrice: 150,
    exitPrice: 160,
    quantity: 10,
    date: new Date(),
    pnl: 100,
    returnPercentage: 6.67,
  };

  const portfolioPnL: PortfolioPnL = {
    portfolioId: 1,
    portfolioName: 'My Portfolio',
    totalPnL: 500,
    initialValue: 10000,
    currentValue: 10500,
    returnPercentage: 5.0,
    trades: [tradePnL],
  };

  console.log('PnL Data:', { pnlData, tradePnL, portfolioPnL });
}

function testApiResponseType() {
  const successResponse: ApiResponse<Portfolio> = {
    success: true,
    data: {
      id: 1,
      name: 'Test Portfolio',
      initialValue: 10000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Error creating portfolio',
  };

  console.log('API Responses:', { successResponse, errorResponse });
}

function testDashboardStatsType() {
  const stats: DashboardStats = {
    totalPortfolios: 3,
    totalTrades: 15,
    totalPnL: 1250.50,
    bestPerformingPortfolio: {
      id: 1,
      name: 'Main Portfolio',
      pnl: 800,
      returnPercentage: 8.5,
    },
    worstPerformingPortfolio: {
      id: 2,
      name: 'Secondary Portfolio',
      pnl: -150,
      returnPercentage: -1.2,
    },
    recentTrades: [],
  };

  console.log('Dashboard Stats:', stats);
}

function testValidationConstants() {
  console.log('Validation Rules:', VALIDATION_RULES);
  console.log('Validation Messages:', VALIDATION_MESSAGES);
}

// Test utility types usage
function testUtilityTypes() {
  // Test Optional type
  type OptionalPortfolio = Optional<Portfolio, 'createdAt' | 'updatedAt'>;
  
  const optionalPortfolio: OptionalPortfolio = {
    id: 1,
    name: 'Test',
    initialValue: 1000,
    // createdAt and updatedAt are optional
  };

  console.log('Optional Portfolio:', optionalPortfolio);
}

// Main function to run all tests
export function runTypeTests() {
  console.log('🧪 Testing TypeScript types...\n');
  
  testPortfolioType();
  testTradeType();
  testFormTypes();
  testPnLTypes();
  testApiResponseType();
  testDashboardStatsType();
  testValidationConstants();
  testUtilityTypes();
  
  console.log('\n✅ All types are working correctly!');
}

// If this file is executed directly
if (require.main === module) {
  runTypeTests();
}
