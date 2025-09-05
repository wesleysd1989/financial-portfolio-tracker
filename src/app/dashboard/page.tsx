import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase,
  Plus,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockStats = {
  totalValue: 25430.50,
  totalPnL: 1234.75,
  totalPortfolios: 3,
  totalTrades: 15,
  returnPercentage: 5.12
};

const mockRecentTrades = [
  {
    id: 1,
    ticker: 'AAPL',
    type: 'Buy',
    quantity: 10,
    price: 150.00,
    date: '2024-01-15',
    pnl: 100.00
  },
  {
    id: 2,
    ticker: 'GOOGL',
    type: 'Sell',
    quantity: 5,
    price: 2600.00,
    date: '2024-01-14',
    pnl: 500.00
  },
  {
    id: 3,
    ticker: 'MSFT',
    type: 'Buy',
    quantity: 8,
    price: 340.00,
    date: '2024-01-13',
    pnl: -80.00
  }
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Overview of your investments and performance
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/portfolios">
              <Button variant="outline">
                <Briefcase className="w-4 h-4 mr-2" />
                Portfolios
              </Button>
            </Link>
            <Link href="/trades">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Trade
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Value
              </CardTitle>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockStats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Total portfolio value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                PnL Total
              </CardTitle>
              {mockStats.totalPnL >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${mockStats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {mockStats.totalPnL >= 0 ? '+' : ''}${mockStats.totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Accumulated profit/loss
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Return
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${mockStats.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {mockStats.returnPercentage >= 0 ? '+' : ''}{mockStats.returnPercentage}%
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Percentage return
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Trades
              </CardTitle>
              <Briefcase className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockStats.totalTrades}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Total trades
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>
              Your latest registered trades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-blue-600 text-sm">
                        {trade.ticker}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {trade.type} - {trade.quantity} shares
                      </div>
                      <div className="text-sm text-gray-600">
                        ${trade.price.toFixed(2)} • {trade.date}
                      </div>
                    </div>
                  </div>
                  <div className={`font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)}
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
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Link href="/trades">
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
