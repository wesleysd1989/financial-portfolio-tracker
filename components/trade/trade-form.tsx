'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Calculator } from 'lucide-react';

interface Portfolio {
  id: number;
  name: string;
  initialValue: number;
}

interface TradeFormData {
  ticker: string;
  entryPrice: string;
  exitPrice: string;
  quantity: string;
  date: string;
  portfolioId: string;
}

interface TradeFormProps {
  onSubmit: (data: {
    ticker: string;
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    date: string;
    portfolioId: number;
  }) => Promise<void>;
}

export default function TradeForm({ onSubmit }: TradeFormProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Partial<TradeFormData>>({});
  
  const [formData, setFormData] = useState<TradeFormData>({
    ticker: '',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    portfolioId: ''
  });

  // Fetch portfolios on component mount
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoadingPortfolios(true);
        const response = await fetch('/api/portfolios');
        if (!response.ok) throw new Error('Failed to fetch portfolios');
        const data = await response.json();
        setPortfolios(data);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
        setSubmitError('Failed to load portfolios. Please refresh the page.');
      } finally {
        setLoadingPortfolios(false);
      }
    };

    fetchPortfolios();
  }, []);

  // Calculate potential PnL for preview
  const calculatePnL = () => {
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const qty = parseInt(formData.quantity);
    
    if (!isNaN(entry) && !isNaN(exit) && !isNaN(qty)) {
      return (exit - entry) * qty;
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TradeFormData> = {};
    let isValid = true;

    // Ticker validation
    if (!formData.ticker.trim()) {
      newErrors.ticker = 'Ticker symbol is required';
      isValid = false;
    } else if (!/^[A-Z0-9]{1,10}$/.test(formData.ticker.trim().toUpperCase())) {
      newErrors.ticker = 'Ticker must be 1-10 characters, letters and numbers only';
      isValid = false;
    }

    // Entry price validation
    const entryPrice = parseFloat(formData.entryPrice);
    if (!formData.entryPrice || isNaN(entryPrice)) {
      newErrors.entryPrice = 'Entry price is required';
      isValid = false;
    } else if (entryPrice <= 0) {
      newErrors.entryPrice = 'Entry price must be greater than 0';
      isValid = false;
    }

    // Exit price validation
    const exitPrice = parseFloat(formData.exitPrice);
    if (!formData.exitPrice || isNaN(exitPrice)) {
      newErrors.exitPrice = 'Exit price is required';
      isValid = false;
    } else if (exitPrice <= 0) {
      newErrors.exitPrice = 'Exit price must be greater than 0';
      isValid = false;
    }

    // Quantity validation
    const quantity = parseInt(formData.quantity);
    if (!formData.quantity || isNaN(quantity)) {
      newErrors.quantity = 'Quantity is required';
      isValid = false;
    } else if (quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
      isValid = false;
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Trade date is required';
      isValid = false;
    } else {
      const tradeDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      if (tradeDate > today) {
        newErrors.date = 'Trade date cannot be in the future';
        isValid = false;
      }
    }

    // Portfolio validation
    if (!formData.portfolioId) {
      newErrors.portfolioId = 'Please select a portfolio';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof TradeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        ticker: formData.ticker.trim().toUpperCase(),
        entryPrice: parseFloat(formData.entryPrice),
        exitPrice: parseFloat(formData.exitPrice),
        quantity: parseInt(formData.quantity),
        date: formData.date,
        portfolioId: parseInt(formData.portfolioId)
      });

      // Reset form after successful submission
      setFormData({
        ticker: '',
        entryPrice: '',
        exitPrice: '',
        quantity: '',
        date: new Date().toISOString().split('T')[0],
        portfolioId: ''
      });
      setErrors({});
    } catch (error) {
      setSubmitError('Failed to register trade. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pnl = calculatePnL();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ticker Symbol */}
        <div className="space-y-2">
          <Label htmlFor="ticker">Ticker Symbol</Label>
          <Input
            id="ticker"
            value={formData.ticker}
            onChange={(e) => handleInputChange('ticker', e.target.value.toUpperCase())}
            placeholder="AAPL"
            className={errors.ticker ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.ticker && <p className="text-red-500 text-sm">{errors.ticker}</p>}
        </div>

        {/* Portfolio Selection */}
        <div className="space-y-2">
          <Label htmlFor="portfolioId">Portfolio</Label>
          <Select 
            value={formData.portfolioId} 
            onValueChange={(value) => handleInputChange('portfolioId', value)}
            disabled={loadingPortfolios || isSubmitting}
          >
            <SelectTrigger className={errors.portfolioId ? 'border-red-500' : ''}>
              <SelectValue placeholder={loadingPortfolios ? "Loading..." : "Select a portfolio"} />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id.toString()}>
                  {portfolio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.portfolioId && <p className="text-red-500 text-sm">{errors.portfolioId}</p>}
        </div>

        {/* Entry Price */}
        <div className="space-y-2">
          <Label htmlFor="entryPrice">Entry Price ($)</Label>
          <Input
            id="entryPrice"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.entryPrice}
            onChange={(e) => handleInputChange('entryPrice', e.target.value)}
            placeholder="150.00"
            className={errors.entryPrice ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.entryPrice && <p className="text-red-500 text-sm">{errors.entryPrice}</p>}
        </div>

        {/* Exit Price */}
        <div className="space-y-2">
          <Label htmlFor="exitPrice">Exit Price ($)</Label>
          <Input
            id="exitPrice"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.exitPrice}
            onChange={(e) => handleInputChange('exitPrice', e.target.value)}
            placeholder="160.00"
            className={errors.exitPrice ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.exitPrice && <p className="text-red-500 text-sm">{errors.exitPrice}</p>}
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="100"
            className={errors.quantity ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>

        {/* Trade Date */}
        <div className="space-y-2">
          <Label htmlFor="date">Trade Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={errors.date ? 'border-red-500' : ''}
            disabled={isSubmitting}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
      </div>

      {/* PnL Preview */}
      {pnl !== null && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Estimated P&L:</span>
            <span className={`font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting || loadingPortfolios || portfolios.length === 0}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Registering Trade...
          </>
        ) : (
          'Register Trade'
        )}
      </Button>

      {portfolios.length === 0 && !loadingPortfolios && (
        <p className="text-sm text-gray-600 text-center">
          No portfolios available. Please create a portfolio first.
        </p>
      )}
    </form>
  );
}
