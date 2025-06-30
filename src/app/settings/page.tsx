'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  Bell,
  Shield,
  Lock,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Home,
  ChevronRight,
  Save,
  User
} from 'lucide-react';
import Navigation from '../../components/Navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import toast, { Toaster } from 'react-hot-toast';

export default function SettingsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      recipes: true,
      community: false,
      analytics: true
    },
    privacy: {
      profileVisibility: 'public',
      showStats: true,
      allowMessages: true
    },
    preferences: {
      language: 'ru',
      theme: 'system',
      timezone: 'Europe/Moscow'
    }
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('user_logged_in');
    if (loggedIn !== 'true') {
      window.location.href = '/login';
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSaveSettings = () => {
    // Сохранение настроек в localStorage
    localStorage.setItem('user_settings', JSON.stringify(settings));
    toast.success('Настройки сохранены!');
  };

  const updateSettings = (category: string, key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Navigation />
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm mb-4">
              <a href="/" className="flex items-center text-gray-500 hover:text-orange-500 transition-colors">
                <Home className="h-4 w-4 mr-1" />
                Главная
              </a>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <a href="/profile" className="text-gray-500 hover:text-orange-500 transition-colors">
                Профиль
              </a>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white font-medium">Настройки</span>
            </nav>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Настройки аккаунта
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Управление предпочтениями и приватностью
                  </p>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Сохранить изменения</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Уведомления */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Уведомления</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Email уведомления</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Получать уведомления на почту</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(value) => updateSettings('notifications', 'email', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Push уведомления</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Уведомления в браузере</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(value) => updateSettings('notifications', 'push', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Новые рецепты</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Уведомления о рекомендованных рецептах</p>
                    </div>
                    <Switch
                      checked={settings.notifications.recipes}
                      onCheckedChange={(value) => updateSettings('notifications', 'recipes', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Активность сообщества</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Лайки, комментарии, новые подписчики</p>
                    </div>
                    <Switch
                      checked={settings.notifications.community}
                      onCheckedChange={(value) => updateSettings('notifications', 'community', value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Приватность */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Приватность</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Видимость профиля</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Кто может видеть ваш профиль</p>
                    </div>
                    <Select
                      value={settings.privacy.profileVisibility}
                      onValueChange={(value) => updateSettings('privacy', 'profileVisibility', value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Всем</SelectItem>
                        <SelectItem value="friends">Друзьям</SelectItem>
                        <SelectItem value="private">Только мне</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Показывать статистику</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Отображать количество рецептов и активность</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showStats}
                      onCheckedChange={(value) => updateSettings('privacy', 'showStats', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Разрешить сообщения</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Другие пользователи могут писать вам</p>
                    </div>
                    <Switch
                      checked={settings.privacy.allowMessages}
                      onCheckedChange={(value) => updateSettings('privacy', 'allowMessages', value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Предпочтения */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Предпочтения</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Язык интерфейса</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Выберите предпочитаемый язык</p>
                    </div>
                    <Select
                      value={settings.preferences.language}
                      onValueChange={(value) => updateSettings('preferences', 'language', value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pl">Polski</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Тема оформления</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Светлая, тёмная или системная</p>
                    </div>
                    <Select
                      value={settings.preferences.theme}
                      onValueChange={(value) => updateSettings('preferences', 'theme', value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Светлая</SelectItem>
                        <SelectItem value="dark">Тёмная</SelectItem>
                        <SelectItem value="system">Системная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Быстрые действия */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Быстрые действия</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button asChild variant="outline" className="h-16 flex-col">
                      <a href="/profile">
                        <User className="h-6 w-6 mb-2" />
                        Вернуться к профилю
                      </a>
                    </Button>
                    
                    <Button asChild variant="outline" className="h-16 flex-col">
                      <a href="/analytics">
                        <Settings className="h-6 w-6 mb-2" />
                        Аналитика
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
