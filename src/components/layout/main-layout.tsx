import Navigation from '@/components/layout/navigation';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className={cn("max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-1", className)}>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-2 sm:mb-0">
              © 2024 Financial Portfolio Tracker. Built for investment analysis.
            </div>
            <div className="flex space-x-4">
              <span>v1.0.0</span>
              <span>•</span>
              <span>Next.js</span>
              <span>•</span>
              <span>Prisma</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
