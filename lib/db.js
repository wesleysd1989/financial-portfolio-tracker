const { PrismaClient } = require('../src/generated/prisma');

// Instância global do Prisma Client
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Portfolio CRUD operations
const portfolioService = {
  // Create new portfolio
  async create(data) {
    return await prisma.portfolio.create({
      data,
    });
  },

  // Find all portfolios
  async findAll() {
    return await prisma.portfolio.findMany({
      include: {
        trades: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Find portfolio by ID
  async findById(id) {
    return await prisma.portfolio.findUnique({
      where: { id },
      include: {
        trades: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });
  },

  // Update portfolio
  async update(id, data) {
    return await prisma.portfolio.update({
      where: { id },
      data,
    });
  },

  // Delete portfolio
  async delete(id) {
    // First delete all related trades
    await prisma.trade.deleteMany({
      where: { portfolioId: id },
    });
    
    // Then delete the portfolio
    return await prisma.portfolio.delete({
      where: { id },
    });
  },

  // Calculate total portfolio PnL
  async calculateTotalPnL(id) {
    const trades = await prisma.trade.findMany({
      where: { portfolioId: id },
    });

    return trades.reduce((total, trade) => {
      const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity;
      return total + pnl;
    }, 0);
  },
};

// Trade CRUD operations
const tradeService = {
  // Create new trade
  async create(data) {
    return await prisma.trade.create({
      data,
      include: {
        portfolio: true,
      },
    });
  },

  // Find all trades of a portfolio
  async findByPortfolioId(portfolioId) {
    return await prisma.trade.findMany({
      where: { portfolioId },
      orderBy: {
        date: 'desc',
      },
      include: {
        portfolio: true,
      },
    });
  },

  // Find trade by ID
  async findById(id) {
    return await prisma.trade.findUnique({
      where: { id },
      include: {
        portfolio: true,
      },
    });
  },

  // Update trade
  async update(id, data) {
    return await prisma.trade.update({
      where: { id },
      data,
      include: {
        portfolio: true,
      },
    });
  },

  // Delete trade
  async delete(id) {
    return await prisma.trade.delete({
      where: { id },
    });
  },

  // Calculate PnL of a trade
  calculatePnL(trade) {
    return (trade.exitPrice - trade.entryPrice) * trade.quantity;
  },

  // Find trades with filters
  async findWithFilters(filters) {
    return await prisma.trade.findMany({
      where: {
        portfolioId: filters.portfolioId,
        ticker: filters.ticker ? { contains: filters.ticker, mode: 'insensitive' } : undefined,
        date: {
          gte: filters.dateFrom,
          lte: filters.dateTo,
        },
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        portfolio: true,
      },
    });
  },
};

// Funções utilitárias gerais
const dbUtils = {
  // Verificar se o banco está conectado
  async healthCheck() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'unhealthy', error, timestamp: new Date() };
    }
  },

  // Desconectar do banco
  async disconnect() {
    await prisma.$disconnect();
  },
};

module.exports = {
  prisma,
  portfolioService,
  tradeService,
  dbUtils,
};
