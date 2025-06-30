'use client';

import { useState } from 'react';
import { useTolgee } from '@tolgee/react';
import { Globe } from 'lucide-react';
import { supportedLanguages } from '../lib/tolgee';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function LanguageSwitcher() {
  const tolgee = useTolgee(['language']);
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = supportedLanguages.find(
    lang => lang.code === tolgee.getLanguage()
  ) || supportedLanguages[0];

  const handleLanguageChange = (languageCode: string) => {
    tolgee.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center space-x-3 cursor-pointer ${
              currentLanguage.code === language.code
                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="font-medium">{language.name}</span>
            {currentLanguage.code === language.code && (
              <span className="ml-auto text-orange-500">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
