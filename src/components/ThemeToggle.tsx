'use client';

import { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useT } from '../hooks/useT';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);

  const themeIcons = {
    light: <Sun className="h-4 w-4 text-yellow-500" />,
    dark: <Moon className="h-4 w-4 text-blue-400" />,
  };

  const getCurrentIcon = () => {
    return theme === 'light' ? (
      <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-all duration-300" />
    ) : (
      <Sun className="h-5 w-5 text-yellow-500 transition-all duration-300" />
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center justify-center p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110"
          aria-label={t('navigation.toggle_theme')}
          title={t('navigation.toggle_theme')}
        >
          {getCurrentIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => {
            if (theme === 'dark') toggleTheme();
            setIsOpen(false);
          }}
          className={`flex items-center space-x-3 cursor-pointer ${
            theme === 'light'
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
              : ''
          }`}
        >
          <Sun className="h-4 w-4 text-yellow-500" />
          <span>{t('navigation.theme_light')}</span>
          {theme === 'light' && (
            <span className="ml-auto text-orange-500">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (theme === 'light') toggleTheme();
            setIsOpen(false);
          }}
          className={`flex items-center space-x-3 cursor-pointer ${
            theme === 'dark'
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
              : ''
          }`}
        >
          <Moon className="h-4 w-4 text-blue-400" />
          <span>{t('navigation.theme_dark')}</span>
          {theme === 'dark' && (
            <span className="ml-auto text-orange-500">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
