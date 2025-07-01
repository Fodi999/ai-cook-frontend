'use client';

import { useState, useEffect } from 'react';
import { Bell, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FridgeItem {
  id: string;
  name: string;
  expiryDate: string;
  category: string;
}

interface NotificationData {
  expiringItems: FridgeItem[];
  expiredItems: FridgeItem[];
  lowStockItems: string[];
}

export default function FridgeNotifications() {
  const [notifications, setNotifications] = useState<NotificationData>({
    expiringItems: [],
    expiredItems: [],
    lowStockItems: []
  });
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Проверяем разрешение на уведомления
    setHasPermission(Notification.permission === 'granted');

    // Симуляция данных холодильника для демонстрации
    const mockData: NotificationData = {
      expiringItems: [
        { id: '1', name: 'Молоко', expiryDate: '2024-01-15', category: 'Молочные продукты' },
        { id: '2', name: 'Хлеб', expiryDate: '2024-01-16', category: 'Выпечка' }
      ],
      expiredItems: [
        { id: '3', name: 'Йогурт', expiryDate: '2024-01-12', category: 'Молочные продукты' }
      ],
      lowStockItems: ['Яйца', 'Масло сливочное']
    };

    setNotifications(mockData);

    // Отправляем уведомления при обновлении данных
    if (hasPermission && (mockData.expiringItems.length > 0 || mockData.expiredItems.length > 0)) {
      scheduleNotifications(mockData);
    }
  }, [hasPermission]);

  const scheduleNotifications = (data: NotificationData) => {
    // Уведомление о истекающих продуктах
    if (data.expiringItems.length > 0) {
      setTimeout(() => {
        new Notification('IT Cook - Холодильник', {
          body: `${data.expiringItems.length} продуктов скоро истекут!`,
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
          tag: 'expiring-items'
        });
      }, 1000);
    }

    // Уведомление о просроченных продуктах
    if (data.expiredItems.length > 0) {
      setTimeout(() => {
        new Notification('IT Cook - Внимание!', {
          body: `${data.expiredItems.length} продуктов просрочены`,
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
          tag: 'expired-items',
          requireInteraction: true
        });
      }, 2000);
    }
  };

  const getTotalNotifications = () => {
    return notifications.expiringItems.length + 
           notifications.expiredItems.length + 
           notifications.lowStockItems.length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Просрочено';
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    return `${diffDays} дней`;
  };

  if (!hasPermission) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-yellow-600" />
          <p className="text-yellow-800 text-sm">
            Включите уведомления в настройках, чтобы получать напоминания о продуктах
          </p>
        </div>
      </div>
    );
  }

  const totalNotifications = getTotalNotifications();

  if (totalNotifications === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-green-600" />
          <p className="text-green-800 text-sm">
            Все продукты в порядке! Уведомления активны.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Заголовок с количеством уведомлений */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Уведомления холодильника</span>
        </h3>
        <Badge variant="destructive">{totalNotifications}</Badge>
      </div>

      {/* Просроченные продукты */}
      {notifications.expiredItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h4 className="font-medium text-red-900">Просроченные продукты</h4>
          </div>
          <div className="space-y-2">
            {notifications.expiredItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-red-800">{item.name}</span>
                <span className="text-red-600 text-sm">{formatDate(item.expiryDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Истекающие продукты */}
      {notifications.expiringItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-5 w-5 text-orange-600" />
            <h4 className="font-medium text-orange-900">Скоро истекут</h4>
          </div>
          <div className="space-y-2">
            {notifications.expiringItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-orange-800">{item.name}</span>
                <span className="text-orange-600 text-sm">{formatDate(item.expiryDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Мало в наличии */}
      {notifications.lowStockItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Bell className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Мало в наличии</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {notifications.lowStockItems.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-blue-800 bg-blue-100">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
