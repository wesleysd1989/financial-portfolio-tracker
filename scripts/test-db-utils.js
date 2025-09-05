const { portfolioService, tradeService, dbUtils } = require('../lib/db.js');

async function testDatabaseUtilities() {
  console.log('🧪 Testing database utilities...\n');

  try {
    // 1. Check database connection
    console.log('🔗 Checking database connection...');
    const healthCheck = await dbUtils.healthCheck();
    console.log('✅ Connection status:', healthCheck);

    // 2. Create portfolio using service
    console.log('\n📊 Creating portfolio via portfolioService...');
    const portfolio = await portfolioService.create({
      name: 'Test Portfolio - Utilities',
      initialValue: 15000,
    });
    console.log('✅ Portfolio created:', portfolio);

    // 3. Create some trades using service
    console.log('\n💰 Creating trades via tradeService...');
    const trade1 = await tradeService.create({
      ticker: 'GOOGL',
      entryPrice: 2500,
      exitPrice: 2600,
      quantity: 5,
      date: new Date('2024-01-15'),
      portfolioId: portfolio.id,
    });

    const trade2 = await tradeService.create({
      ticker: 'MSFT',
      entryPrice: 350,
      exitPrice: 340,
      quantity: 10,
      date: new Date('2024-01-20'),
      portfolioId: portfolio.id,
    });

    console.log('✅ Trade 1 (GOOGL) created:', trade1);
    console.log('✅ Trade 2 (MSFT) created:', trade2);

    // 4. Calculate trade PnL
    console.log('\n💵 Calculating trade PnL...');
    const pnl1 = tradeService.calculatePnL(trade1);
    const pnl2 = tradeService.calculatePnL(trade2);
    console.log(`✅ GOOGL PnL: $${pnl1.toFixed(2)}`);
    console.log(`✅ MSFT PnL: $${pnl2.toFixed(2)}`);

    // 5. Calculate portfolio total PnL
    console.log('\n📈 Calculating portfolio total PnL...');
    const totalPnL = await portfolioService.calculateTotalPnL(portfolio.id);
    console.log(`✅ Portfolio total PnL: $${totalPnL.toFixed(2)}`);

    // 6. Find portfolio with trades
    console.log('\n🔍 Finding portfolio with trades...');
    const portfolioWithTrades = await portfolioService.findById(portfolio.id);
    console.log('✅ Portfolio found with', portfolioWithTrades?.trades.length, 'trades');

    // 7. Search trades with filters
    console.log('\n🔎 Testing trade filters...');
    const googleTrades = await tradeService.findWithFilters({
      portfolioId: portfolio.id,
      ticker: 'GOOGL',
    });
    console.log('✅ GOOGL trades found:', googleTrades.length);

    // 8. List all portfolios
    console.log('\n📋 Listing all portfolios...');
    const allPortfolios = await portfolioService.findAll();
    console.log('✅ Total portfolios in database:', allPortfolios.length);

    // 9. Cleanup - delete test data
    console.log('\n🧹 Cleaning up test data...');
    await portfolioService.delete(portfolio.id);
    console.log('✅ Portfolio and trades removed');

    console.log('\n🎉 Database utilities test completed successfully!');

  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    // Disconnect from database
    await dbUtils.disconnect();
    console.log('✅ Disconnected from database');
  }
}

testDatabaseUtilities();
