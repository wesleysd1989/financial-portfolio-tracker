'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import TradeForm from '@/components/forms/trade-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Info, Plus } from 'lucide-react';
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
      <MainLayout className="max-w-none px-6 sm:px-8 lg:px-12">
        <div className="space-y-6">
          {/* Success Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trade Registered Successfully!</h1>
              <p className="text-gray-600 mt-1">
                Your trade has been added to your portfolio
              </p>
            </div>
            <Link href="/trades/register">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register Another Trade
              </Button>
            </Link>
          </div>

          {/* Success Card */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-green-800 text-2xl">Trade Registered!</CardTitle>
              <CardDescription className="text-green-600 text-lg">
                {successMessage}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-green-600">
                Redirecting to trades list in a few seconds...
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild>
                  <Link href="/trades">View All Trades</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/trades/register">Register Another Trade</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout className="max-w-none px-6 sm:px-8 lg:px-12">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Register New Trade</h1>
            <p className="text-gray-600 mt-1">
              Add a new trade to your portfolio and track your performance
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/trades">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trades
            </Link>
          </Button>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Trade Registration Tips:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-700">
                  <div>• Enter ticker symbol in uppercase (e.g., AAPL, GOOGL)</div>
                  <div>• Entry and exit prices should reflect actual trade prices</div>
                  <div>• The system will automatically calculate your P&L</div>
                  <div>• Trade date cannot be in the future</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Trade Details
            </CardTitle>
            <CardDescription>
              Fill in all the details of your trade. The P&L will be calculated automatically based on your entry and exit prices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TradeForm onSubmit={handleTradeSubmit} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Navigate to other sections of the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" asChild className="h-auto p-4">
                <Link href="/portfolios" className="flex flex-col items-center space-y-2">
                  <ArrowLeft className="w-5 h-5" />
                  <span>Manage Portfolios</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4">
                <Link href="/trades" className="flex flex-col items-center space-y-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>View All Trades</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4">
                <Link href="/dashboard" className="flex flex-col items-center space-y-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
