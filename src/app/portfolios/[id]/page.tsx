'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Loader2,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface Portfolio {
  id: number;
  name: string;
  initialValue: number;
  createdAt: string;
  updatedAt: string;
}

interface Trade {
  id: number;
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: string;
  pnl: number;
  portfolioId: number;
}

interface PortfolioDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function PortfolioDetailsPage({ params }: PortfolioDetailsPageProps) {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioId, setPortfolioId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setPortfolioId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!portfolioId) return;

    const fetchPortfolioDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch portfolio details
        const portfolioResponse = await fetch(`/api/portfolios/${portfolioId}`);
        if (!portfolioResponse.ok) {
          throw new Error('Portfolio not found');
        }
        const portfolioData = await portfolioResponse.json();
        setPortfolio(portfolioData);

        // Fetch trades for this portfolio
        const tradesResponse = await fetch('/api/trades');
        if (tradesResponse.ok) {
          const allTrades = await tradesResponse.json();
          const portfolioTrades = allTrades.filter((trade: Trade) => 
            trade.portfolioId === parseInt(portfolioId)
          );
          setTrades(portfolioTrades);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio details');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioDetails();
  }, [portfolioId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading portfolio details...</span>
        </div>
      </MainLayout>
    );
  }

  if (error || !portfolio) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            {error || 'Portfolio not found'}
          </div>
          <Button onClick={() => router.push('/portfolios')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolios
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Calculate portfolio statistics
  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalVolume = trades.reduce((sum, trade) => sum + (trade.entryPrice * trade.quantity), 0);
  const profitableTrades = trades.filter(trade => trade.pnl > 0).length;
  const currentValue = portfolio.initialValue + totalPnL;
  const returnPercentage = portfolio.initialValue > 0 ? (totalPnL / portfolio.initialValue) * 100 : 0;

  return (
    <MainLayout className="max-w-none px-6 sm:px-8 lg:px-12">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/portfolios')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{portfolio.name}</h1>
              <p className="text-gray-600 mt-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Created on {new Date(portfolio.createdAt).toLocaleDateString('en-US')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Link href="/trades/register">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Trade
              </Button>
            </Link>
          </div>
        </div>

        {/* Portfolio Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Initial Value
              </CardTitle>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${portfolio.initialValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Current Value
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}% return
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total P&L
              </CardTitle>
              {totalPnL >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Trades
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trades.length}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {profitableTrades} profitable
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trades */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Trades</CardTitle>
                <CardDescription>
                  Latest trades in this portfolio
                </CardDescription>
              </div>
              <Link href="/trades">
                <Button variant="outline" size="sm">
                  View All Trades
                </Button>
              </Link>
            </CardHeader>
          <CardContent>
            {trades.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No trades yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your first trade to this portfolio.
                </p>
                <Link href="/trades/register">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Trade
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {trades.slice(0, 5).map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {trade.ticker.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{trade.ticker}</div>
                        <div className="text-sm text-gray-600">
                          {trade.quantity} shares • {new Date(trade.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${trade.entryPrice.toFixed(2)} → ${trade.exitPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                {trades.length > 5 && (
                  <div className="text-center pt-4">
                    <Link href="/trades">
                      <Button variant="outline">
                        View {trades.length - 5} more trades
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Summary Card */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
            <CardDescription>
              Key performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Win Rate:</span>
              <span className="font-semibold">
                {trades.length > 0 ? ((profitableTrades / trades.length) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Volume:</span>
              <span className="font-semibold">
                ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg P&L per Trade:</span>
              <span className={`font-semibold ${trades.length > 0 && totalPnL / trades.length >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${trades.length > 0 ? (totalPnL / trades.length).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Best Trade:</span>
              <span className="font-semibold text-green-600">
                {trades.length > 0 ? `+$${Math.max(...trades.map(t => t.pnl)).toFixed(2)}` : '$0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Worst Trade:</span>
              <span className="font-semibold text-red-600">
                {trades.length > 0 ? `$${Math.min(...trades.map(t => t.pnl)).toFixed(2)}` : '$0.00'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </MainLayout>
  );
}
