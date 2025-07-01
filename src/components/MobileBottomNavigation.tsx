'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  BookOpen, 
  Users, 
  User,
  Settings,
  Heart
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MobileBottomNavigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('user_logged_in') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const navItems = [
    { 
      href: '/', 
      label: 'Главная', 
      icon: Home,
      color: 'text-blue-600'
    },
    { 
      href: '/recipes', 
      label: 'Рецепты', 
      icon: BookOpen,
      color: 'text-green-600'
    },
    { 
      href: '/community', 
      label: 'Сообщество', 
      icon: Users,
      color: 'text-purple-600'
    },
    { 
      href: '/health-demo', 
      label: 'Здоровье', 
      icon: Heart,
      color: 'text-red-600'
    },
    { 
      href: isLoggedIn ? '/profile' : '/login', 
      label: isLoggedIn ? 'Профиль' : 'Войти', 
      icon: isLoggedIn ? User : User,
      color: 'text-gray-600'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                active 
                  ? `${item.color} bg-gray-50 dark:bg-gray-700` 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
