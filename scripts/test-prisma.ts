import { PrismaClient } from '../src/generated/prisma';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing Prisma Client...\n');
    
    // Create test portfolio
    console.log('📊 Creating test portfolio...');
    const portfolio = await prisma.portfolio.create({
      data: {
        name: 'Test Portfolio',
        initialValue: 10000,
      },
    });
    console.log('✅ Portfolio created:', portfolio);
    
    // Create test trade
    console.log('\n💰 Creating test trade...');
    const trade = await prisma.trade.create({
      data: {
        ticker: 'AAPL',
        entryPrice: 150.0,
        exitPrice: 160.0,
        quantity: 10,
        date: new Date(),
        portfolioId: portfolio.id,
      },
    });
    console.log('✅ Trade created:', trade);
    
    // Query with relationship
    console.log('\n🔍 Querying portfolio with trades...');
    const portfolioWithTrades = await prisma.portfolio.findUnique({
      where: { id: portfolio.id },
      include: { trades: true },
    });
    console.log('✅ Portfolio with trades:', JSON.stringify(portfolioWithTrades, null, 2));
    
    // Calculate trade PnL
    const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity;
    console.log(`\n💵 Trade PnL: $${pnl.toFixed(2)}`);
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await prisma.trade.delete({ where: { id: trade.id } });
    await prisma.portfolio.delete({ where: { id: portfolio.id } });
    console.log('✅ Test data removed');
    
    console.log('\n🎉 Prisma Client test completed successfully!');
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
