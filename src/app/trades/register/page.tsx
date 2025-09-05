'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import TradeForm from '../../../../components/trade/trade-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Info } from 'lucide-react';
import Link from 'next/link';

export default function RegisterTradePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleTradeSubmit = async (tradeData: {
    ticker: string;
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    date: string;
    portfolioId: number;
  }) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register trade');
      }

      const newTrade = await response.json();
      
      // Show success message
      setSuccessMessage(`Trade registered successfully! P&L: ${newTrade.pnl >= 0 ? '+' : ''}$${newTrade.pnl.toFixed(2)}`);
      
      // Redirect to trades list after a brief delay
      setTimeout(() => {
        router.push('/trades');
      }, 2000);

    } catch (error) {
      console.error('Error registering trade:', error);
      throw error; // Re-throw to let the form handle the error display
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Trade Registered!</CardTitle>
                <CardDescription className="text-green-600">
                  {successMessage}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-green-600 mb-4">
                  Redirecting to trades list...
                </p>
                <Button asChild variant="outline">
                  <Link href="/trades">View All Trades</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/trades">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Trades
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Register New Trade</h1>
              <p className="text-gray-600 mt-1">
                Add a new trade to your portfolio
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Trade Registration Tips:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Enter the ticker symbol in uppercase (e.g., AAPL, GOOGL)</li>
                    <li>• Entry and exit prices should reflect your actual trade prices</li>
                    <li>• The system will automatically calculate your P&L</li>
                    <li>• Trade date cannot be in the future</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trade Form */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Trade Details
              </CardTitle>
              <CardDescription>
                Fill in all the details of your trade. The P&L will be calculated automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TradeForm onSubmit={handleTradeSubmit} />
            </CardContent>
          </Card>
        </div>

        {/* Additional Actions */}
        <div className="max-w-4xl mx-auto mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Need to create a portfolio first?
          </p>
          <Button variant="outline" asChild>
            <Link href="/portfolios">
              Manage Portfolios
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
