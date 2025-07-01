'use client';

import { motion } from 'framer-motion';
import { 
  Home, 
  User, 
  ChefHat, 
  Refrigerator, 
  Bot
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavigationProps {
  className?: string;
}

export default function BottomNavigation({ className = '' }: BottomNavigationProps) {
  const pathname = usePathname();

  const navigationItems = [
    { href: '/', icon: Home, label: 'Главная' },
    { href: '/recipes', icon: ChefHat, label: 'Рецепты' },
    { href: '/profile?tab=fridge', icon: Refrigerator, label: 'Холодильник' },
    { href: '/profile?tab=ai', icon: Bot, label: 'ИИ' },
    { href: '/profile', icon: User, label: 'Профиль' },
  ];

  const isActiveRoute = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-area-pb z-40 ${className}`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center p-2 min-w-0 flex-1"
            >
              <motion.div
                className={`flex flex-col items-center space-y-1 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <div className={`p-1 rounded-lg ${
                  isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : ''
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium truncate">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
