'use client';

import { useState } from 'react';
import { Download, Share2, Smartphone, X, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export default function PWAInstallPrompt() {
  const { isInstallable, isInstalled, isOnline, installApp, shareApp, canShare } = usePWA();
  const [isVisible, setIsVisible] = useState(true);

  if (!isInstallable || isInstalled || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Индикатор онлайн/офлайн статуса */}
      <div className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-xs font-medium ${
        isOnline 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isOnline ? (
          <div className="flex items-center space-x-1">
            <Wifi className="h-3 w-3" />
            <span>Онлайн</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <WifiOff className="h-3 w-3" />
            <span>Офлайн</span>
          </div>
        )}
      </div>

      {/* Баннер установки */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg z-40">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-8 w-8" />
              <div>
                <h3 className="font-semibold text-sm">Установить IT Cook</h3>
                <p className="text-xs opacity-90">Получите быстрый доступ с главного экрана</p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex space-x-2 mt-3">
            <button
              onClick={installApp}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Установить</span>
            </button>
            
            {canShare && (
              <button
                onClick={shareApp}
                className="bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-md flex items-center justify-center"
              >
                <Share2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function PWAFeatures() {
  const features = [
    {
      icon: Smartphone,
      title: 'Установка на главный экран',
      description: 'Быстрый доступ к приложению без браузера'
    },
    {
      icon: WifiOff,
      title: 'Работа офлайн',
      description: 'Просматривайте рецепты и данные холодильника без интернета'
    },
    {
      icon: Download,
      title: 'Быстрая загрузка',
      description: 'Мгновенный запуск благодаря кэшированию'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {features.map((feature, index) => (
        <div key={index} className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <feature.icon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
