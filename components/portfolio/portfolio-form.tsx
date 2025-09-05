'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PortfolioFormProps {
  onSubmit: (data: { name: string; initialValue: number }) => Promise<void>;
}

export default function PortfolioForm({ onSubmit }: PortfolioFormProps) {
  const [name, setName] = useState('');
  const [initialValue, setInitialValue] = useState('');
  const [errors, setErrors] = useState<{ name?: string; initialValue?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors: { name?: string; initialValue?: string } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Portfolio name is required';
      isValid = false;
    }

    const valueNum = parseFloat(initialValue);
    if (!initialValue || isNaN(valueNum)) {
      newErrors.initialValue = 'Initial value must be a valid number';
      isValid = false;
    } else if (valueNum <= 0) {
      newErrors.initialValue = 'Initial value must be greater than zero';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit({ 
        name: name.trim(), 
        initialValue: parseFloat(initialValue) 
      });
      setName('');
      setInitialValue('');
      setErrors({});
    } catch (error) {
      setSubmitError('Failed to create portfolio. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Label htmlFor="name">Portfolio Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Investment Portfolio"
          className={errors.name ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <Label htmlFor="initialValue">Initial Value ($)</Label>
        <Input
          id="initialValue"
          type="number"
          step="0.01"
          min="0.01"
          value={initialValue}
          onChange={(e) => setInitialValue(e.target.value)}
          placeholder="10000.00"
          className={errors.initialValue ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.initialValue && <p className="text-red-500 text-sm mt-1">{errors.initialValue}</p>}
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating...' : 'Create Portfolio'}
      </Button>
    </form>
  );
}
