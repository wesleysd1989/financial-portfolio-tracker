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
import TradeForm from '../../../components/trade/trade-form';
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
  const [trades, setTrades] = useState(mockTrades);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTrade, setEditingTrade] = useState(null);
  const [deletingTrade, setDeletingTrade] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const profitableTrades = trades.filter(trade => trade.pnl > 0).length;
  const totalVolume = trades.reduce((sum, trade) => sum + (trade.entryPrice * trade.quantity), 0);

  const handleEditTrade = async (tradeData) => {
    try {
      setIsEditing(true);
      setError('');
      
      // Simulate API call - replace with actual API call
      const response = await fetch(`/api/trades/${editingTrade.id}`, {
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
        trade.id === editingTrade.id ? { ...trade, ...updatedTrade } : trade
      ));
      
      setEditingTrade(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update trade');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteTrade = async (tradeId) => {
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
      setTrades(trades.filter(trade => trade.id !== tradeId));
      setDeletingTrade(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trade');
    } finally {
      setIsDeleting(false);
    }
  };

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
              <Link href="/trades/register">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Register First Trade
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

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
                  portfolioId: '1' // Mock portfolio ID - replace with actual logic
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
