'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/main-layout';
import PortfolioForm from '../../../components/portfolio/portfolio-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  BarChart3,
  Loader2,
  Search,
  Trash2,
  Eye
} from 'lucide-react';

interface Portfolio {
  id: number;
  name: string;
  initialValue: number;
  createdAt: string;
  updatedAt: string;
}

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'value-asc' | 'value-desc';

export default function Portfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portfolios');
      if (!response.ok) throw new Error('Failed to fetch portfolios');
      const data = await response.json();
      setPortfolios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Filter and sort portfolios
  useEffect(() => {
    let filtered = portfolios.filter(portfolio =>
      portfolio.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort portfolios
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'value-asc':
          return a.initialValue - b.initialValue;
        case 'value-desc':
          return b.initialValue - a.initialValue;
        default:
          return 0;
      }
    });

    setFilteredPortfolios(sorted);
  }, [portfolios, searchTerm, sortOption]);

  const handleCreatePortfolio = async (data: { name: string; initialValue: number }) => {
    try {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create portfolio');

      const newPortfolio = await response.json();
      setPortfolios([newPortfolio, ...portfolios]);
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create portfolio');
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    try {
      setDeletingId(id);
      const response = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete portfolio');

      setPortfolios(portfolios.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete portfolio');
    } finally {
      setDeletingId(null);
    }
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'name-asc': return 'Name (A-Z)';
      case 'name-desc': return 'Name (Z-A)';
      case 'date-asc': return 'Oldest First';
      case 'date-desc': return 'Newest First';
      case 'value-asc': return 'Value (Low to High)';
      case 'value-desc': return 'Value (High to Low)';
      default: return 'Sort by';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolios</h1>
            <p className="text-gray-600 mt-1">
              Manage your investment portfolios
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Portfolio
          </Button>
        </div>

        {/* Create Portfolio Form Modal */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Add a new investment portfolio to track your investments.
              </DialogDescription>
            </DialogHeader>
            <PortfolioForm onSubmit={handleCreatePortfolio} />
          </DialogContent>
        </Dialog>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search portfolios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="value-desc">Value (High to Low)</SelectItem>
              <SelectItem value="value-asc">Value (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Portfolio Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading portfolios...</span>
          </div>
        ) : filteredPortfolios.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No portfolios found' : 'No portfolios yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No portfolios match "${searchTerm}". Try adjusting your search.`
                : 'Create your first portfolio to start tracking your investments.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Portfolio
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((portfolio) => (
              <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created on {new Date(portfolio.createdAt).toLocaleDateString('en-US')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Initial Value:</span>
                      <span className="font-semibold text-green-600">
                        ${portfolio.initialValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={deletingId === portfolio.id}
                      >
                        {deletingId === portfolio.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Portfolio</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{portfolio.name}"? This action cannot be undone and will permanently delete all associated trades.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDeletePortfolio(portfolio.id)}
                          disabled={deletingId === portfolio.id}
                        >
                          {deletingId === portfolio.id ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
                          Delete Portfolio
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State (when there are no portfolios) */}
        {filteredPortfolios.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing {filteredPortfolios.length} of {portfolios.length} portfolios
          </div>
        )}
      </div>
    </MainLayout>
  );
}