import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  BarChart3,
  Edit,
  Trash2
} from 'lucide-react';

// Mock data for demonstration
const mockTrades = [
  {
    id: 1,
    ticker: 'AAPL',
    portfolioName: 'Main Portfolio',
    entryPrice: 150.00,
    exitPrice: 160.00,
    quantity: 10,
    date: '2024-01-15',
    pnl: 100.00,
    returnPercentage: 6.67,
    type: 'Completed'
  },
  {
    id: 2,
    ticker: 'GOOGL',
    portfolioName: 'Main Portfolio',
    entryPrice: 2500.00,
    exitPrice: 2600.00,
    quantity: 5,
    date: '2024-01-14',
    pnl: 500.00,
    returnPercentage: 4.00,
    type: 'Completed'
  },
  {
    id: 3,
    ticker: 'MSFT',
    portfolioName: 'Day Trade',
    entryPrice: 350.00,
    exitPrice: 340.00,
    quantity: 8,
    date: '2024-01-13',
    pnl: -80.00,
    returnPercentage: -2.86,
    type: 'Completed'
  },
  {
    id: 4,
    ticker: 'TSLA',
    portfolioName: 'Long Term',
    entryPrice: 200.00,
    exitPrice: 220.00,
    quantity: 15,
    date: '2024-01-12',
    pnl: 300.00,
    returnPercentage: 10.00,
    type: 'Completed'
  },
  {
    id: 5,
    ticker: 'NVDA',
    portfolioName: 'Day Trade',
    entryPrice: 450.00,
    exitPrice: 435.00,
    quantity: 6,
    date: '2024-01-11',
    pnl: -90.00,
    returnPercentage: -3.33,
    type: 'Completed'
  }
];

export default function Trades() {
  const totalPnL = mockTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const profitableTrades = mockTrades.filter(trade => trade.pnl > 0).length;
  const totalVolume = mockTrades.reduce((sum, trade) => sum + (trade.entryPrice * trade.quantity), 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trades</h1>
            <p className="text-gray-600 mt-1">
              Manage and track your buy and sell trades
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Trade
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                PnL Total
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
              <p className="text-xs text-gray-600 mt-1">
                Result of all trades
              </p>
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
                {mockTrades.length}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Registered trades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Success Rate
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {((profitableTrades / mockTrades.length) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {profitableTrades} of {mockTrades.length} trades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Volume
              </CardTitle>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Volume traded
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Search by ticker..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trades Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trades List</CardTitle>
            <CardDescription>
              Complete history of your trades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTrades.map((trade) => (
                <div key={trade.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Trade Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-blue-600 text-sm">
                          {trade.ticker}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {trade.ticker} • {trade.quantity} shares
                        </div>
                        <div className="text-sm text-gray-600">
                          {trade.portfolioName}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(trade.date).toLocaleDateString('en-US')}
                        </div>
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="flex space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Entry</p>
                        <p className="font-semibold">${trade.entryPrice.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Exit</p>
                        <p className="font-semibold">${trade.exitPrice.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* PnL and Actions */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`font-bold text-lg ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)}
                        </div>
                        <div className={`text-sm ${trade.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.returnPercentage >= 0 ? '+' : ''}{trade.returnPercentage}%
                        </div>
                      </div>
                      <Badge variant={trade.type === 'Completed' ? 'default' : 'secondary'}>
                        {trade.type}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State (when there are no trades) */}
        {mockTrades.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No trades found
              </h3>
              <p className="text-gray-600 mb-6">
                Register your first trade to start tracking your results.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register First Trade
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
