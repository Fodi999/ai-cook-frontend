'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';

interface NotificationSettings {
  enabled: boolean;
  expiringItems: boolean;
  newRecipes: boolean;
  healthReminders: boolean;
  communityUpdates: boolean;
}

export default function NotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    expiringItems: true,
    newRecipes: true,
    healthReminders: true,
    communityUpdates: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Проверяем поддержку уведомлений
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Загружаем сохраненные настройки
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;

    setIsLoading(true);
    
    try {
      // Регистрируем service worker
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js');
      }

      // Запрашиваем разрешение на уведомления
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        // Подписываемся на push-уведомления
        const registration = await navigator.serviceWorker.ready;
        
        // Здесь должен быть ваш VAPID ключ
        const vapidKey = 'YOUR_VAPID_PUBLIC_KEY'; // Замените на реальный ключ
        
        try {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey)
          });

          // Отправляем подписку на сервер
          await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
          });

          setSettings(prev => ({ ...prev, enabled: true }));
          localStorage.setItem('notificationSettings', JSON.stringify({ ...settings, enabled: true }));
        } catch (error) {
          console.log('Push subscription failed:', error);
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disableNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Уведомляем сервер об отписке
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }

      setSettings(prev => ({ ...prev, enabled: false }));
      localStorage.setItem('notificationSettings', JSON.stringify({ ...settings, enabled: false }));
    } catch (error) {
      console.error('Error disabling notifications:', error);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('IT Cook Test', {
        body: 'Тестовое уведомление от IT Cook',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png'
      });
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          Ваш браузер не поддерживает push-уведомления
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {settings.enabled ? (
            <Bell className="h-6 w-6 text-blue-600" />
          ) : (
            <BellOff className="h-6 w-6 text-gray-400" />
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Push-уведомления
            </h3>
            <p className="text-sm text-gray-500">
              Получайте уведомления о важных событиях
            </p>
          </div>
        </div>
        
        {permission === 'granted' && settings.enabled ? (
          <button
            onClick={disableNotifications}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
          >
            Отключить
          </button>
        ) : (
          <button
            onClick={requestPermission}
            disabled={isLoading || permission === 'denied'}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Загрузка...' : 'Включить'}
          </button>
        )}
      </div>

      {permission === 'denied' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            Уведомления заблокированы. Разрешите их в настройках браузера.
          </p>
        </div>
      )}

      {settings.enabled && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Типы уведомлений
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Истекающие продукты</span>
              <input
                type="checkbox"
                checked={settings.expiringItems}
                onChange={(e) => updateSetting('expiringItems', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Новые рецепты</span>
              <input
                type="checkbox"
                checked={settings.newRecipes}
                onChange={(e) => updateSetting('newRecipes', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Напоминания о здоровье</span>
              <input
                type="checkbox"
                checked={settings.healthReminders}
                onChange={(e) => updateSetting('healthReminders', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Обновления сообщества</span>
              <input
                type="checkbox"
                checked={settings.communityUpdates}
                onChange={(e) => updateSetting('communityUpdates', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>

          <button
            onClick={sendTestNotification}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
          >
            Отправить тестовое уведомление
          </button>
        </div>
      )}
    </div>
  );
}

// Вспомогательная функция для конвертации VAPID ключа
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
