const { PrismaClient } = require('../src/generated/prisma');

async function testTradeCreation() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing trade creation...\n');
    
    // First, check if portfolio exists
    console.log('📊 Checking portfolio...');
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: 5 }
    });
    console.log('Portfolio found:', portfolio);
    
    if (!portfolio) {
      console.log('❌ Portfolio not found');
      return;
    }
    
    // Try to create a trade
    console.log('\n💰 Creating trade...');
    const tradeData = {
      ticker: 'AAPL',
      entryPrice: 150.0,
      exitPrice: 160.0,
      quantity: 10,
      date: new Date('2025-09-05'),
      portfolioId: 5,
      pnl: (160.0 - 150.0) * 10
    };
    
    console.log('Trade data:', tradeData);
    
    const trade = await prisma.trade.create({
      data: tradeData,
      include: {
        portfolio: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    console.log('✅ Trade created successfully:', trade);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTradeCreation();
