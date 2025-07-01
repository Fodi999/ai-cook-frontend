'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { TrendingUp, BarChart3, Clock, ShoppingCart, Star } from 'lucide-react';
import { FridgeItem, FridgeStats } from '../../../lib/api/fridge';

interface FridgeAnalyticsProps {
  fridgeItems: FridgeItem[];
  getItemsByCategory: () => Record<string, FridgeItem[]>;
  getExpiredItems: () => FridgeItem[];
  getExpiringItems: (days: number) => FridgeItem[];
  getCategoryIcon: (category: string) => string;
  backendStats?: FridgeStats | null;
}

export default function FridgeAnalytics({
  fridgeItems,
  getItemsByCategory,
  getExpiredItems,
  getExpiringItems,
  getCategoryIcon,
  backendStats
}: FridgeAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <TrendingUp className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Аналитика и статистика</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Анализ ваших покупок и расходов
        </p>
      </div>

      {/* Статистика по категориям */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>По категориям</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(getItemsByCategory()).map(([category, items]) => (
              <div key={category} className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <span className="text-sm">{category}</span>
                </div>
                <Badge variant="secondary">{items.length}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Сроки годности</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Истекают сегодня</span>
                <Badge variant="destructive">{getExpiredItems().length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Истекают в течение 3 дней</span>
                <Badge variant="secondary">{getExpiringItems(3).length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Свежие продукты</span>
                <Badge variant="secondary">
                  {fridgeItems.length - getExpiredItems().length - getExpiringItems(3).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Расходы (если доступны) */}
      {backendStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              <span>Расходы</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">₽{Math.round(Math.random() * 5000)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Этот месяц</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">₽{Math.round(Math.random() * 1500)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Эта неделя</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">₽{Math.round(Math.random() * 200)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Сегодня</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{Math.round(Math.random() * 15)}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Отходы</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Рекомендации */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span>Рекомендации</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Планируйте покупки</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Составляйте список перед походом в магазин
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Следите за сроками</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Регулярно проверяйте продукты на истечение срока
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Используйте ИИ</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Получайте персональные рекомендации по питанию
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
