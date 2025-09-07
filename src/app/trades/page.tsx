'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import TradeForm from '@/components/forms/trade-form';
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
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Types
interface Portfolio {
  id: number;
  name: string;
  initialValue?: number;
}

interface Trade {
  id: number;
  ticker: string;
  portfolioName: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: string;
  pnl: number;
  returnPercentage: number;
  type: string;
  portfolioId: number;
}

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
    type: 'Completed',
    portfolioId: 1
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
    type: 'Completed',
    portfolioId: 1
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
    type: 'Completed',
    portfolioId: 2
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
    type: 'Completed',
    portfolioId: 3
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
    type: 'Completed',
    portfolioId: 2
  }
];

export default function Trades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [deletingTrade, setDeletingTrade] = useState<Trade | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 5;
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter trades based on search term
  const filteredTrades = trades.filter(trade => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      trade.ticker.toLowerCase().includes(searchLower) ||
      trade.portfolioName.toLowerCase().includes(searchLower) ||
      trade.type.toLowerCase().includes(searchLower)
    );
  });
  
  // Calculate pagination based on filtered trades
  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);
  const startIndex = (currentPage - 1) * tradesPerPage;
  const endIndex = startIndex + tradesPerPage;
  const currentTrades = filteredTrades.slice(startIndex, endIndex);
  
  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Reset to first page when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Load trades and portfolios from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Load trades and portfolios in parallel
        const [tradesResponse, portfoliosResponse] = await Promise.all([
          fetch('/api/trades'),
          fetch('/api/portfolios')
        ]);

        if (!tradesResponse.ok) {
          throw new Error('Failed to load trades');
        }
        if (!portfoliosResponse.ok) {
          throw new Error('Failed to load portfolios');
        }

        const tradesData = await tradesResponse.json();
        const portfoliosData = await portfoliosResponse.json();
        
        // Transform trades data to include portfolio name and format for display
        const transformedTrades = tradesData.map((trade: any) => {
          const portfolio = portfoliosData.find((p: any) => p.id === trade.portfolioId);
          return {
            ...trade,
            portfolioName: portfolio?.name || 'Unknown Portfolio',
            returnPercentage: trade.entryPrice > 0 ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 : 0,
            type: 'Completed', // All trades are completed for now
            portfolioId: trade.portfolioId // Ensure portfolioId is included
          };
        });
        
        setTrades(transformedTrades as Trade[]);
        setPortfolios(portfoliosData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        // Fallback to mock data if API fails
        setTrades(mockTrades as Trade[]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalPnL = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const profitableTrades = filteredTrades.filter(trade => trade.pnl > 0).length;
  const totalVolume = filteredTrades.reduce((sum, trade) => sum + (trade.entryPrice * trade.quantity), 0);

  const handleEditTrade = async (tradeData: any) => {
    try {
      setIsEditing(true);
      setError('');
      
      // Simulate API call - replace with actual API call
      const response = await fetch(`/api/trades/${editingTrade?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData),
      });

      if (!response.ok) {
        throw new Error('Failed to update trade');
      }

      const updatedTrade = await response.json();
      
      // Update local state
      setTrades(trades.map(trade => 
        trade.id === editingTrade?.id ? { ...trade, ...updatedTrade } : trade
      ));
      
      setEditingTrade(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update trade');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteTrade = async (tradeId: number) => {
    try {
      setIsDeleting(true);
      setError('');
      
      // Simulate API call - replace with actual API call
      const response = await fetch(`/api/trades/${tradeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete trade');
      }

      // Update local state
      const updatedTrades = trades.filter(trade => trade.id !== tradeId);
      setTrades(updatedTrades);
      
      // Adjust current page if we deleted the last item on the current page
      const newTotalPages = Math.ceil(updatedTrades.length / tradesPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      setDeletingTrade(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trade');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout className="max-w-none px-6 sm:px-8 lg:px-12">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trades</h1>
            <p className="text-gray-600 mt-1">
              Manage and track your buy and sell trades
            </p>
          </div>
          <Link href="/trades/register">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Trade
            </Button>
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                {searchTerm ? `${filteredTrades.length}/${trades.length}` : trades.length}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {searchTerm ? 'Filtered/Total trades' : 'Registered trades'}
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
                    placeholder="Search by ticker, portfolio, or type..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="absolute right-3 top-3 w-4 h-4 text-gray-400 hover:text-gray-600"
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Filtering by: "{searchTerm}" ({filteredTrades.length} results)
                    </Badge>
                  </div>
                )}
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading trades...</span>
              </div>
            ) : filteredTrades.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm ? (
                  <>
                    <p className="text-gray-500 mb-4">
                      No trades found matching "{searchTerm}"
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSearchChange('')}
                    >
                      Clear Search
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 mb-4">No trades found</p>
                    <Link href="/trades/register">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Register First Trade
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {currentTrades.map((trade) => (
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingTrade(trade)}
                          disabled={isEditing || isDeleting}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDeletingTrade(trade)}
                          disabled={isEditing || isDeleting}
                        >
                          {isDeleting && deletingTrade?.id === trade.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}

            {/* Pagination - only show if there are multiple pages */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page)}
                      className={currentPage === page ? "bg-blue-600 text-white" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>


        {/* Edit Trade Dialog */}
        <Dialog open={!!editingTrade} onOpenChange={() => setEditingTrade(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Trade</DialogTitle>
              <DialogDescription>
                Make changes to your trade here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            {editingTrade && (
              <TradeForm
                initialData={{
                  ticker: editingTrade.ticker,
                  entryPrice: editingTrade.entryPrice.toString(),
                  exitPrice: editingTrade.exitPrice.toString(),
                  quantity: editingTrade.quantity.toString(),
                  date: editingTrade.date,
                  portfolioId: editingTrade.portfolioId.toString()
                }}
                onSubmit={handleEditTrade}
                isSubmitting={isEditing}
                submitButtonText="Update Trade"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Trade Dialog */}
        <AlertDialog open={!!deletingTrade} onOpenChange={() => setDeletingTrade(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the trade for "{deletingTrade?.ticker}"
                with P&L of ${deletingTrade?.pnl?.toFixed(2)}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deletingTrade && handleDeleteTrade(deletingTrade.id)}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
