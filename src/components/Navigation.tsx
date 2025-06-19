import Link from 'next/link';
import { Phone } from 'lucide-react';

interface NavigationProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function Navigation({ title, showBackButton = false, backHref = '/' }: NavigationProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {showBackButton && (
              <Link href={backHref} className="mr-4">
                <svg className="h-6 w-6 text-gray-600 hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
            )}
            <Phone className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
          <nav className="flex space-x-4">
            <Link href="/customers/upload" className="text-gray-600 hover:text-gray-900">
              Customers
            </Link>
            <Link href="/campaigns" className="text-gray-600 hover:text-gray-900">
              Campaigns
            </Link>
            <Link href="/analytics" className="text-gray-600 hover:text-gray-900">
              Analytics
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
