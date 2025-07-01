'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ChefHat, 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Users, 
  User,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { useT } from '../hooks/useT';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const pathname = usePathname();
  const t = useT();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setIsLoggedIn(false);
    setUserData(null);
    window.location.href = '/';
  };

  const navItems = [
    { href: '/', label: t('navigation.home'), icon: Home },
    { href: '/recipes', label: t('navigation.recipes'), icon: BookOpen },
    { href: '/community', label: t('navigation.community'), icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsLoggedIn(true);
      // Получаем данные пользователя из localStorage или API
      const savedUserData = localStorage.getItem('user_data');
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    }
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              IT Cook
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
            
            {isLoggedIn ? (
              /* Для авторизованных пользователей */
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <Button 
                    variant={pathname.startsWith('/profile') ? "default" : "ghost"} 
                    size="sm" 
                    className={`flex items-center space-x-2 ${
                      pathname.startsWith('/profile') 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                        : ''
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>{userData?.username || userData?.name || 'Профиль'}</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Выйти</span>
                </Button>
              </div>
            ) : (
              /* Для неавторизованных пользователей */
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>{t('navigation.login')}</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>{t('navigation.register')}</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-2">
                  {isLoggedIn ? (
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        {userData?.name || 'Профиль'}
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <LogIn className="h-4 w-4 mr-2" />
                          {t('navigation.login')}
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                          <UserPlus className="h-4 w-4 mr-2" />
                          {t('navigation.register')}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
