'use client';

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  Plus,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Trade } from '@/types';

interface TradeListProps {
  trades: Trade[];
  loading: boolean;
  portfolioName?: string;
}

type SortField = 'date' | 'ticker' | 'pnl' | 'quantity' | 'entryPrice' | 'exitPrice';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function TradeList({ trades, loading, portfolioName }: TradeListProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc'
  });

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedTrades = [...trades].sort((a, b) => {
    const { field, direction } = sortConfig;
    let aValue: any = a[field];
    let bValue: any = b[field];

    // Handle date sorting
    if (field === 'date') {
      aValue = new Date(a.date).getTime();
      bValue = new Date(b.date).getTime();
    }

    // Handle PnL sorting (handle undefined values)
    if (field === 'pnl') {
      aValue = a.pnl || 0;
      bValue = b.pnl || 0;
    }

    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade List</CardTitle>
          <CardDescription>
            {portfolioName ? `Trades from ${portfolioName}` : 'Loading trades...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading trades...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade List</CardTitle>
          <CardDescription>
            {portfolioName ? `Trades from ${portfolioName}` : 'No portfolio selected'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Trades Yet</h3>
            <p className="text-gray-600 mb-6">
              {portfolioName ? 
                `Start by registering your first trade for ${portfolioName}.` :
                'Select a portfolio to view its trades.'
              }
            </p>
            <Link href="/trades/register">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register Trade
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trade List</CardTitle>
            <CardDescription>
              {portfolioName ? `${trades.length} trades from ${portfolioName}` : `${trades.length} trades`}
            </CardDescription>
          </div>
          <Link href="/trades/register">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Trade
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('ticker')}
                    className="h-8 p-0 font-medium"
                  >
                    Ticker
                    <SortIcon field="ticker" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('date')}
                    className="h-8 p-0 font-medium"
                  >
                    Date
                    <SortIcon field="date" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('quantity')}
                    className="h-8 p-0 font-medium"
                  >
                    Quantity
                    <SortIcon field="quantity" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('entryPrice')}
                    className="h-8 p-0 font-medium"
                  >
                    Entry
                    <SortIcon field="entryPrice" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('exitPrice')}
                    className="h-8 p-0 font-medium"
                  >
                    Exit
                    <SortIcon field="exitPrice" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('pnl')}
                    className="h-8 p-0 font-medium"
                  >
                    P&L
                    <SortIcon field="pnl" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTrades.map((trade) => (
                <TableRow key={trade.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="font-bold text-blue-600 text-xs">
                          {trade.ticker}
                        </span>
                      </div>
                      <span>{trade.ticker}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(trade.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">
                      {trade.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${trade.entryPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${trade.exitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={((trade.pnl || 0) >= 0) ? "default" : "destructive"}
                      className={
                        ((trade.pnl || 0) >= 0) ? 
                        "bg-green-100 text-green-800 hover:bg-green-200" : 
                        "bg-red-100 text-red-800 hover:bg-red-200"
                      }
                    >
                      {((trade.pnl || 0) >= 0) ? '+' : ''}${(trade.pnl || 0).toFixed(2)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Total trades: {trades.length}
            </span>
            <span className="font-medium">
              Total P&L: 
              <span className={`ml-1 ${
                trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) >= 0 ? '+' : ''}
                ${trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0).toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
