import { NextRequest, NextResponse } from 'next/server';
import { tradeService } from '../../../../../lib/db';
import { calculatePnL } from '../../../../utils/pnl';

// GET /api/trades/[id] - Get a specific trade
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const tradeId = parseInt(id);
    
    if (isNaN(tradeId)) {
      return NextResponse.json(
        { error: 'Invalid trade ID' },
        { status: 400 }
      );
    }

    const trade = await tradeService.findById(tradeId);
    
    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error fetching trade:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trade', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/trades/[id] - Update a specific trade
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const tradeId = parseInt(id);
    
    if (isNaN(tradeId)) {
      return NextResponse.json(
        { error: 'Invalid trade ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const { ticker, entryPrice, exitPrice, quantity, date, portfolioId } = body;
    
    if (!ticker || !entryPrice || !exitPrice || !quantity || !date || !portfolioId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate data types and values
    const parsedEntryPrice = parseFloat(entryPrice);
    const parsedExitPrice = parseFloat(exitPrice);
    const parsedQuantity = parseInt(quantity);
    const parsedPortfolioId = parseInt(portfolioId);

    if (isNaN(parsedEntryPrice) || parsedEntryPrice <= 0) {
      return NextResponse.json(
        { error: 'Entry price must be a positive number' },
        { status: 400 }
      );
    }

    if (isNaN(parsedExitPrice) || parsedExitPrice <= 0) {
      return NextResponse.json(
        { error: 'Exit price must be a positive number' },
        { status: 400 }
      );
    }

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive integer' },
        { status: 400 }
      );
    }

    if (isNaN(parsedPortfolioId)) {
      return NextResponse.json(
        { error: 'Invalid portfolio ID' },
        { status: 400 }
      );
    }

    // Validate date
    const tradeDate = new Date(date);
    if (isNaN(tradeDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Check if trade exists
    const existingTrade = await tradeService.findById(tradeId);
    if (!existingTrade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      );
    }

    // Calculate PnL
    const pnl = calculatePnL(parsedEntryPrice, parsedExitPrice, parsedQuantity);

    // Update the trade
    const updatedTrade = await tradeService.update(tradeId, {
      ticker: ticker.trim().toUpperCase(),
      entryPrice: parsedEntryPrice,
      exitPrice: parsedExitPrice,
      quantity: parsedQuantity,
      date: tradeDate,
      portfolioId: parsedPortfolioId,
      pnl
    });

    return NextResponse.json(updatedTrade);
  } catch (error) {
    console.error('Error updating trade:', error);
    return NextResponse.json(
      { error: 'Failed to update trade', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/trades/[id] - Delete a specific trade
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const tradeId = parseInt(id);
    
    if (isNaN(tradeId)) {
      return NextResponse.json(
        { error: 'Invalid trade ID' },
        { status: 400 }
      );
    }

    // Check if trade exists
    const existingTrade = await tradeService.findById(tradeId);
    if (!existingTrade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      );
    }

    // Delete the trade
    await tradeService.delete(tradeId);

    return NextResponse.json(
      { message: 'Trade deleted successfully', deletedTradeId: tradeId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting trade:', error);
    return NextResponse.json(
      { error: 'Failed to delete trade', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
