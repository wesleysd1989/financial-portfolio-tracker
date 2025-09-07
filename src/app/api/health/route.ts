import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Health check started...');
    
    // Check if POSTGRES_URL is configured
    const dbUrl = process.env.POSTGRES_URL;
    if (!dbUrl) {
      console.error('❌ POSTGRES_URL not configured');
      return NextResponse.json({
        status: 'error',
        message: 'POSTGRES_URL not configured',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('✅ POSTGRES_URL is configured');
    console.log('🔗 Connection string format:', dbUrl.substring(0, 30) + '...');

    // Test database connection
    console.log('🔄 Testing database connection...');
    const result = await prisma.$queryRaw`SELECT 1 as test, version() as version`;
    console.log('✅ Database connection successful');

    // Test basic operations
    console.log('🔄 Testing portfolio count...');
    const portfolioCount = await prisma.portfolio.count();
    console.log('✅ Portfolio count:', portfolioCount);

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      portfolios: portfolioCount,
      version: Array.isArray(result) ? result[0]?.version : 'unknown',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    });

  } catch (error: any) {
    console.error('❌ Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Unknown error',
      code: error.code || 'UNKNOWN',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    }, { status: 500 });
  }
}
