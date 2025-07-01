'use client';

import Link from 'next/link';
import { Home, ChevronRight, Edit3 } from 'lucide-react';
import { useT } from '../../hooks/useT';

export default function ProfileHeader() {
  const t = useT();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-4">
          <Link href="/" className="flex items-center text-gray-500 hover:text-orange-500 transition-colors">
            <Home className="h-4 w-4 mr-1" />
            Главная
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-medium">Профиль</span>
        </nav>

        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Edit3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('profile.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t('profile.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
