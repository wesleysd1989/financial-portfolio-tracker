'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trade } from '../../../types/index';
import TradeForm from '../../../components/trade/trade-form';
import { Edit2, Trash2, Loader2 } from 'lucide-react';

interface TradeActionsProps {
  trade: Trade;
  onEdit: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

interface FormData {
  ticker: string;
  entryPrice: string;
  exitPrice: string;
  quantity: string;
  date: string;
  portfolioId: string;
}

export default function TradeActions({ trade, onEdit, onDelete }: TradeActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = async (data: {
    ticker: string;
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    date: string;
    portfolioId: number;
  }) => {
    try {
      setIsEditing(true);
      await onEdit(trade.id, {
        ticker: data.ticker.trim().toUpperCase(),
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        quantity: data.quantity,
        date: data.date,
        portfolioId: data.portfolioId
      });
      setEditOpen(false);
    } catch (error) {
      console.error('Error editing trade:', error);
      // The error will be handled by the parent component
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this trade?\n\n` +
      `${trade.ticker} - ${trade.quantity} shares\n` +
      `Entry: $${trade.entryPrice} → Exit: $${trade.exitPrice}\n` +
      `P&L: ${trade.pnl && trade.pnl >= 0 ? '+' : ''}$${(trade.pnl || 0).toFixed(2)}\n\n` +
      `This action cannot be undone.`
    );

    if (confirmed) {
      try {
        setIsDeleting(true);
        await onDelete(trade.id);
      } catch (error) {
        console.error('Error deleting trade:', error);
        // The error will be handled by the parent component
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Edit Button */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            title="Edit trade"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Trade</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <TradeForm
              initialData={{
                ticker: trade.ticker,
                entryPrice: trade.entryPrice.toString(),
                exitPrice: trade.exitPrice.toString(),
                quantity: trade.quantity.toString(),
                date: new Date(trade.date).toISOString().split('T')[0],
                portfolioId: trade.portfolioId.toString()
              }}
              onSubmit={handleEdit}
              isSubmitting={isEditing}
              submitButtonText={isEditing ? "Updating..." : "Update Trade"}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Button */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={handleDelete}
        disabled={isDeleting}
        title="Delete trade"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
