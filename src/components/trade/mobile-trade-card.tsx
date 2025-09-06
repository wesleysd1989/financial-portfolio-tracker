'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trade } from '../../../types/index';
import TradeActions from './trade-actions';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

interface MobileTradeCardProps {
  trade: Trade;
  onEdit?: (id: number, data: any) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

export default function MobileTradeCard({ trade, onEdit, onDelete }: MobileTradeCardProps) {
  const pnl = trade.pnl || 0;
  const isProfitable = pnl >= 0;

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">{trade.ticker}</h3>
              <Badge variant={isProfitable ? "default" : "destructive"} className="text-xs">
                {trade.quantity} shares
              </Badge>
            </div>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(trade.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          {(onEdit || onDelete) && (
            <TradeActions
              trade={trade}
              onEdit={onEdit || (() => Promise.resolve())}
              onDelete={onDelete || (() => Promise.resolve())}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Entry Price</p>
            <p className="font-medium">${trade.entryPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Exit Price</p>
            <p className="font-medium">${trade.exitPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center">
            {isProfitable ? (
              <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
            )}
            <span className="text-xs text-gray-500 uppercase tracking-wide">P&L</span>
          </div>
          <div className={`flex items-center font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            <DollarSign className="w-4 h-4 mr-1" />
            <span>
              {isProfitable ? '+' : ''}{pnl.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
