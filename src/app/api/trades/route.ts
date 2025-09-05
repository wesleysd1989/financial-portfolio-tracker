import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/trades - Get all trades
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get('portfolioId');

    const whereClause = portfolioId ? { portfolioId: parseInt(portfolioId) } : {};

    const trades = await prisma.trade.findMany({
      where: whereClause,
      include: {
        portfolio: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    );
  }
}

// POST /api/trades - Create a new trade
export async function POST(request: NextRequest) {
  try {
    const { ticker, entryPrice, exitPrice, quantity, date, portfolioId } = await request.json();

    // Validate input
    if (!ticker || typeof ticker !== 'string' || ticker.trim() === '') {
      return NextResponse.json(
        { error: 'Ticker symbol is required' },
        { status: 400 }
      );
    }

    if (!entryPrice || typeof entryPrice !== 'number' || entryPrice <= 0) {
      return NextResponse.json(
        { error: 'Entry price must be a positive number' },
        { status: 400 }
      );
    }

    if (!exitPrice || typeof exitPrice !== 'number' || exitPrice <= 0) {
      return NextResponse.json(
        { error: 'Exit price must be a positive number' },
        { status: 400 }
      );
    }

    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: 'Trade date is required' },
        { status: 400 }
      );
    }

    if (!portfolioId || typeof portfolioId !== 'number') {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }

    // Validate that portfolio exists
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId }
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // Validate date is not in the future
    const tradeDate = new Date(date);
    const today = new Date();
    // Set to end of today in UTC to avoid timezone issues
    today.setUTCHours(23, 59, 59, 999);
    
    if (tradeDate > today) {
      return NextResponse.json(
        { error: 'Trade date cannot be in the future' },
        { status: 400 }
      );
    }

    // Validate ticker format (basic validation)
    const tickerRegex = /^[A-Z0-9]{1,10}$/;
    if (!tickerRegex.test(ticker.trim().toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid ticker format. Use 1-10 characters, letters and numbers only' },
        { status: 400 }
      );
    }

    // Calculate PnL
    const pnl = (exitPrice - entryPrice) * quantity;

    // Create trade
    const trade = await prisma.trade.create({
      data: {
        ticker: ticker.trim().toUpperCase(),
        entryPrice,
        exitPrice,
        quantity,
        date: new Date(date),
        portfolioId,
        pnl
      },
      include: {
        portfolio: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(trade, { status: 201 });
  } catch (error) {
    console.error('Error creating trade:', error);
    return NextResponse.json(
      { error: 'Failed to create trade', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
