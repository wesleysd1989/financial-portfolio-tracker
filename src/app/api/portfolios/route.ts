import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/portfolios - Get all portfolios
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
}

// POST /api/portfolios - Create a new portfolio
export async function POST(request: NextRequest) {
  try {
    const { name, initialValue } = await request.json();

    // Validate input
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Portfolio name is required' },
        { status: 400 }
      );
    }

    if (!initialValue || typeof initialValue !== 'number' || initialValue <= 0) {
      return NextResponse.json(
        { error: 'Initial value must be a positive number' },
        { status: 400 }
      );
    }

    // Create portfolio
    const portfolio = await prisma.portfolio.create({
      data: {
        name: name.trim(),
        initialValue
      }
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
}
