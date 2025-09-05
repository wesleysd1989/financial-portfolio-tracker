'use client';

import { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Briefcase } from 'lucide-react';
import { Portfolio } from '../../types';

interface PortfolioSelectorProps {
  onSelect: (portfolio: Portfolio | null) => void;
  selectedPortfolio: Portfolio | null;
  portfolios: Portfolio[];
  loading: boolean;
  error: string;
}

export default function PortfolioSelector({
  onSelect,
  selectedPortfolio,
  portfolios,
  loading,
  error
}: PortfolioSelectorProps) {
  const handleValueChange = (value: string) => {
    const portfolio = portfolios.find(p => p.id.toString() === value);
    onSelect(portfolio || null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm text-gray-600">Loading portfolios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="text-center py-4">
        <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No portfolios available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Select Portfolio
      </label>
      <Select 
        value={selectedPortfolio?.id.toString() || ''} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a portfolio to view">
            {selectedPortfolio && (
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">{selectedPortfolio.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  (${selectedPortfolio.initialValue.toLocaleString()})
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {portfolios.map((portfolio) => (
            <SelectItem key={portfolio.id} value={portfolio.id.toString()}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">{portfolio.name}</span>
                </div>
                <span className="text-sm text-gray-500 ml-4">
                  ${portfolio.initialValue.toLocaleString()}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedPortfolio && (
        <div className="text-xs text-gray-600 mt-2">
          <div className="flex justify-between">
            <span>Initial Value:</span>
            <span>${selectedPortfolio.initialValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(selectedPortfolio.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
