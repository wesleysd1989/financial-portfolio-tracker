'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trade } from '../../../types/index';
import { calculateTradePnL } from '@/utils/pnl';
import TradeActions from './trade-actions';
import MobileTradeCard from './mobile-trade-card';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign
} from 'lucide-react';

interface EnhancedTradeListProps {
  trades: Trade[];
  loading?: boolean;
  portfolioName?: string;
  onEditTrade?: (id: number, data: any) => Promise<void>;
  onDeleteTrade?: (id: number) => Promise<void>;
}

type SortField = 'ticker' | 'entryPrice' | 'exitPrice' | 'quantity' | 'date' | 'pnl';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'profit' | 'loss';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function EnhancedTradeList({ 
  trades, 
  loading = false, 
  portfolioName = 'Portfolio',
  onEditTrade,
  onDeleteTrade
}: EnhancedTradeListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', direction: 'desc' });
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Enhanced filtering and sorting logic
  const filteredAndSortedTrades = useMemo(() => {
    let filtered = trades.filter(trade => {
      // Text search filter
      const matchesSearch = trade.ticker.toLowerCase().includes(searchTerm.toLowerCase());
      
      // P&L filter
      const pnl = trade.pnl || calculateTradePnL(trade);
      let matchesFilter = true;
      
      if (filterType === 'profit') {
        matchesFilter = pnl > 0;
      } else if (filterType === 'loss') {
        matchesFilter = pnl < 0;
      }
      
      return matchesSearch && matchesFilter;
    });

    // Sorting logic
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.field) {
        case 'ticker':
          aValue = a.ticker;
          bValue = b.ticker;
          break;
        case 'entryPrice':
          aValue = a.entryPrice;
          bValue = b.entryPrice;
          break;
        case 'exitPrice':
          aValue = a.exitPrice;
          bValue = b.exitPrice;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'pnl':
          aValue = a.pnl || calculateTradePnL(a);
          bValue = b.pnl || calculateTradePnL(b);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [trades, searchTerm, sortConfig, filterType]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  // Statistics
  const stats = useMemo(() => {
    const totalTrades = filteredAndSortedTrades.length;
    const profitableTrades = filteredAndSortedTrades.filter(trade => 
      (trade.pnl || calculateTradePnL(trade)) > 0
    ).length;
    const totalPnL = filteredAndSortedTrades.reduce((sum, trade) => 
      sum + (trade.pnl || calculateTradePnL(trade)), 0
    );

    return {
      total: totalTrades,
      profitable: profitableTrades,
      losing: totalTrades - profitableTrades,
      winRate: totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0,
      totalPnL
    };
  }, [filteredAndSortedTrades]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Trade List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            Loading trades...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Trade List
          </div>
          <Badge variant="secondary">
            {stats.total} trade{stats.total !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
        <CardDescription>
          {portfolioName} • Win Rate: {stats.winRate.toFixed(1)}% • Total P&L: 
          <span className={`ml-1 font-semibold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by ticker symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="profit">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                    Profitable
                  </div>
                </SelectItem>
                <SelectItem value="loss">
                  <div className="flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                    Loss
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Total</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.profitable}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Profitable</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.losing}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Losses</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.winRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Win Rate</div>
          </div>
        </div>

        {/* Table */}
        {filteredAndSortedTrades.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'No trades match your current filters' 
                : 'No trades found for this portfolio'
              }
            </p>
            {(searchTerm || filterType !== 'all') && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="mt-2"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3">
              {filteredAndSortedTrades.map((trade) => (
                <MobileTradeCard
                  key={trade.id}
                  trade={trade}
                  onEdit={onEditTrade}
                  onDelete={onDeleteTrade}
                />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('ticker')}
                  >
                    <div className="flex items-center">
                      Ticker
                      {getSortIcon('ticker')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('entryPrice')}
                  >
                    <div className="flex items-center">
                      Entry Price
                      {getSortIcon('entryPrice')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('exitPrice')}
                  >
                    <div className="flex items-center">
                      Exit Price
                      {getSortIcon('exitPrice')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center">
                      Quantity
                      {getSortIcon('quantity')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Date
                      {getSortIcon('date')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('pnl')}
                  >
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      P&L
                      {getSortIcon('pnl')}
                    </div>
                  </TableHead>
                  {(onEditTrade || onDeleteTrade) && (
                    <TableHead className="w-20">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTrades.map((trade) => {
                  const pnl = trade.pnl || calculateTradePnL(trade);
                  const isProfitable = pnl > 0;
                  
                  return (
                    <TableRow key={trade.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <Badge variant="outline">
                          {trade.ticker}
                        </Badge>
                      </TableCell>
                      <TableCell>${trade.entryPrice.toFixed(2)}</TableCell>
                      <TableCell>${trade.exitPrice.toFixed(2)}</TableCell>
                      <TableCell>{trade.quantity.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(trade.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {isProfitable ? (
                            <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                          )}
                          <span className={`font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                            {isProfitable ? '+' : ''}${pnl.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      {(onEditTrade || onDeleteTrade) && (
                        <TableCell>
                          <TradeActions
                            trade={trade}
                            onEdit={onEditTrade || (() => Promise.resolve())}
                            onDelete={onDeleteTrade || (() => Promise.resolve())}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                </TableBody>
                </Table>
              </div>
            </div>
          </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
