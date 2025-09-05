import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/main-layout';
import { 
  TrendingUp, 
  Briefcase, 
  BarChart3, 
  PieChart,
  Target,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: Briefcase,
    title: 'Portfolio Management',
    description: 'Organize your investments in distinct portfolios for better control and analysis.'
  },
  {
    icon: TrendingUp,
    title: 'Trade Recording',
    description: 'Record your buy and sell operations with ease and precision.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Visualize your investment performance with detailed charts and metrics.'
  },
  {
    icon: PieChart,
    title: 'PnL Calculation',
    description: 'Automatically track your profits and losses in real time.'
  },
  {
    icon: Target,
    title: 'Performance Analysis',
    description: 'Compare the performance of different portfolios and investment strategies.'
  },
  {
    icon: Shield,
    title: 'Secure Data',
    description: 'Your financial data stays secure in a local PostgreSQL database.'
  }
];

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Financial Portfolio
            <span className="text-blue-600 block">Tracker</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage and analyze your investments with ease. 
            Track the performance of your portfolios and trades on an intuitive platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                <BarChart3 className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/portfolios">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Briefcase className="w-5 h-5 mr-2" />
                Manage Portfolios
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Key Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to track and analyze your investments professionally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 rounded-2xl p-8 text-center mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to get started?
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first portfolio and start tracking your investments today.
        </p>
        <Link href="/portfolios">
          <Button size="lg">
            <Briefcase className="w-5 h-5 mr-2" />
            Create First Portfolio
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
}
