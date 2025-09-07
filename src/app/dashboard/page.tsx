'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase,
  Plus,
  BarChart3,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Portfolio, Trade } from '@/types/index';
import PortfolioSelector from '@/components/dashboard/portfolio-selector';
import TradeList from '@/components/dashboard/trade-list';
import EnhancedTradeList from '@/components/trade/enhanced-trade-list';
import PnLChart from '@/components/charts/pnl-chart';
import { calculateTotalPnL, calculatePortfolioPerformance, calculateCumulativePnL } from '@/utils/pnl';

interface DashboardStats {
  totalValue: number;
  totalPnL: number;
  totalTrades: number;
  returnPercentage: number;
}

interface LoadingState {
  portfolios: boolean;
  trades: boolean;
  stats: boolean;
}

export default function Dashboard() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalValue: 0,
    totalPnL: 0,
    totalTrades: 0,
    returnPercentage: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    portfolios: true,
    trades: false,
    stats: false
  });
  const [error, setError] = useState<string>('');

  // Trade management functions
  const handleEditTrade = async (id: number, data: any) => {
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update trade');
      }

      // Refresh trades after successful update
      if (selectedPortfolio) {
        const tradesResponse = await fetch(`/api/trades?portfolioId=${selectedPortfolio.id}`);
        if (tradesResponse.ok) {
          const updatedTrades = await tradesResponse.json();
          setTrades(updatedTrades);
          
          // Recalculate stats and chart data
          const performance = calculatePortfolioPerformance(selectedPortfolio, updatedTrades);
          setStats({
            totalValue: performance.currentValue,
            totalPnL: performance.totalPnL,
            totalTrades: performance.totalTrades,
            returnPercentage: performance.returnPercentage
          });

          const cumulativePnLData = calculateCumulativePnL(updatedTrades);
          setChartData(cumulativePnLData);
        }
      }
    } catch (error) {
      console.error('Error updating trade:', error);
      setError('Failed to update trade. Please try again.');
      throw error; // Re-throw to let TradeActions handle the error state
    }
  };

  const handleDeleteTrade = async (id: number) => {
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete trade');
      }

      // Refresh trades after successful deletion
      if (selectedPortfolio) {
        const tradesResponse = await fetch(`/api/trades?portfolioId=${selectedPortfolio.id}`);
        if (tradesResponse.ok) {
          const updatedTrades = await tradesResponse.json();
          setTrades(updatedTrades);
          
          // Recalculate stats and chart data
          const performance = calculatePortfolioPerformance(selectedPortfolio, updatedTrades);
          setStats({
            totalValue: performance.currentValue,
            totalPnL: performance.totalPnL,
            totalTrades: performance.totalTrades,
            returnPercentage: performance.returnPercentage
          });

          const cumulativePnLData = calculateCumulativePnL(updatedTrades);
          setChartData(cumulativePnLData);
        }
      }
    } catch (error) {
      console.error('Error deleting trade:', error);
      setError('Failed to delete trade. Please try again.');
      throw error; // Re-throw to let TradeActions handle the error state
    }
  };

  // Fetch portfolios on component mount
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(prev => ({ ...prev, portfolios: true }));
        const response = await fetch('/api/portfolios');
        if (!response.ok) throw new Error('Failed to fetch portfolios');
        const data = await response.json();
        setPortfolios(data);
        
        // Auto-select first portfolio if available
        if (data.length > 0) {
          setSelectedPortfolio(data[0]);
        }
      } catch (err) {
        setError('Failed to load portfolios');
        console.error('Error fetching portfolios:', err);
      } finally {
        setLoading(prev => ({ ...prev, portfolios: false }));
      }
    };

    fetchPortfolios();
  }, []);

  // Fetch trades when portfolio is selected
  useEffect(() => {
    if (!selectedPortfolio) {
      setTrades([]);
      return;
    }

    const fetchTrades = async () => {
      try {
        setLoading(prev => ({ ...prev, trades: true, stats: true }));
        const response = await fetch(`/api/trades?portfolioId=${selectedPortfolio.id}`);
        if (!response.ok) throw new Error('Failed to fetch trades');
        const data = await response.json();
        setTrades(data);

        // Calculate stats from trades using utility functions
        const performance = calculatePortfolioPerformance(selectedPortfolio, data);
        
        setStats({
          totalValue: performance.currentValue,
          totalPnL: performance.totalPnL,
          totalTrades: performance.totalTrades,
          returnPercentage: performance.returnPercentage
        });

        // Calculate cumulative P&L data for the chart
        const cumulativePnLData = calculateCumulativePnL(data);
        setChartData(cumulativePnLData);
      } catch (err) {
        setError('Failed to load trades');
        console.error('Error fetching trades:', err);
      } finally {
        setLoading(prev => ({ ...prev, trades: false, stats: false }));
      }
    };

    fetchTrades();
  }, [selectedPortfolio]);

  // Get recent trades (last 5)
  const recentTrades = trades
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <MainLayout className="max-w-none px-6 sm:px-8 lg:px-12">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {selectedPortfolio 
                ? `Performance overview for ${selectedPortfolio.name}`
                : 'Overview of your investments and performance'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/portfolios">
              <Button variant="outline">
                <Briefcase className="w-4 h-4 mr-2" />
                Portfolios
              </Button>
            </Link>
            <Link href="/trades/register">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Trade
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Portfolio Selection Section - Placeholder for now */}
        {loading.portfolios ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading portfolios...
              </div>
            </CardContent>
          </Card>
        ) : portfolios.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Portfolios Found</h3>
                <p className="text-gray-600 mb-4">Create your first portfolio to get started.</p>
                <Link href="/portfolios">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Portfolio
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Selection</CardTitle>
              <CardDescription>
                Select a portfolio to view its performance and trades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioSelector
                onSelect={setSelectedPortfolio}
                selectedPortfolio={selectedPortfolio}
                portfolios={portfolios}
                loading={loading.portfolios}
                error={error}
              />
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {selectedPortfolio && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Portfolio Value
                </CardTitle>
                <DollarSign className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                {loading.stats ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-600">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Current portfolio value
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total P&L
                </CardTitle>
                {loading.stats ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : stats.totalPnL >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                {loading.stats ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-600">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Accumulated profit/loss
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Return %
                </CardTitle>
                <BarChart3 className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                {loading.stats ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-600">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className={`text-2xl font-bold ${stats.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.returnPercentage >= 0 ? '+' : ''}{stats.returnPercentage.toFixed(2)}%
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Portfolio return
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Trades
                </CardTitle>
                <Briefcase className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                {loading.stats ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-600">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats.totalTrades}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Trades in portfolio
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* P&L Chart */}
        {selectedPortfolio && (
          <Card>
            <CardContent className="p-6">
              <PnLChart 
                data={chartData}
                loading={loading.trades}
                portfolioName={selectedPortfolio.name}
              />
            </CardContent>
          </Card>
        )}

        {/* Recent Trades */}
        {selectedPortfolio && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>
                Latest trades from {selectedPortfolio.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.trades ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Loading trades...
                </div>
              ) : recentTrades.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Trades Yet</h3>
                  <p className="text-gray-600 mb-4">Start by registering your first trade.</p>
                  <Link href="/trades/register">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Register Trade
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {recentTrades.map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-blue-600 text-sm">
                              {trade.ticker}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">
                              {trade.quantity} shares
                            </div>
                            <div className="text-sm text-gray-600">
                              Entry: ${trade.entryPrice.toFixed(2)} • Exit: ${trade.exitPrice.toFixed(2)} • {new Date(trade.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`font-medium ${(trade.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(trade.pnl || 0) >= 0 ? '+' : ''}${Math.abs(trade.pnl || 0).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Link href="/trades">
                      <Button variant="outline" className="w-full">
                        View All Trades
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Complete Trade List */}
        {selectedPortfolio && (
          <EnhancedTradeList
            trades={trades}
            loading={loading.trades}
            portfolioName={selectedPortfolio.name}
            onEditTrade={handleEditTrade}
            onDeleteTrade={handleDeleteTrade}
          />
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/portfolios">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                  Manage Portfolios
                </CardTitle>
                <CardDescription>
                  View, edit or create new investment portfolios
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/trades/register">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Record Trade
                </CardTitle>
                <CardDescription>
                  Add a new buy or sell trade
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
