import { Tolgee, DevTools } from '@tolgee/react';
import { FormatIcu } from '@tolgee/format-icu';

const API_KEY = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatIcu())
  .init({
    language: 'ru', // Default language
    
    // for production, you should use API_URL and API_KEY
    apiUrl: API_URL,
    apiKey: API_KEY,

    // For development - static imports
    staticData: {
      'ru': () => import('../locales/ru.json'),
      'en': () => import('../locales/en.json'),
      'pl': () => import('../locales/pl.json'),
    },

    // Available languages
    availableLanguages: ['ru', 'en', 'pl'],
    
    // Fallback language
    fallbackLanguage: 'ru',

    // Development mode settings
    observerType: process.env.NODE_ENV === 'development' ? 'text' : undefined,
    observerOptions: {
      restrictedElements: ['script', 'style'],
    },
  });

export const supportedLanguages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
];

export default tolgee;
