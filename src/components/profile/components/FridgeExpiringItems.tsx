'use client';

import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Clock, ChefHat, Trash2 } from 'lucide-react';
import { FridgeItem } from '../../../lib/api/fridge';

type FridgeView = 'overview' | 'items' | 'expiring' | 'ai-insights' | 'quick-add' | 'analytics';

interface FridgeExpiringItemsProps {
  fridgeItems: FridgeItem[];
  setActiveView: (view: FridgeView) => void;
  getDaysUntilExpiry: (expiryDate?: string) => number | null;
  getCategoryIcon: (category: string) => string;
}

export default function FridgeExpiringItems({
  fridgeItems,
  setActiveView,
  getDaysUntilExpiry,
  getCategoryIcon
}: FridgeExpiringItemsProps) {
  const expiringItems = fridgeItems.filter(item => {
    const days = getDaysUntilExpiry(item.expiry_date);
    return days !== null && days <= 3 && days > 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Скоро истекающие продукты</h3>
        <Button onClick={() => setActiveView('overview')} variant="outline" size="sm">
          Назад к обзору
        </Button>
      </div>
      
      {expiringItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-green-500 mb-4">
              <Clock className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Отлично!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Нет продуктов, которые скоро истекут
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {expiringItems.map((item) => {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date)!;
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border-l-4 border-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                        Истекает через {daysUntilExpiry} {daysUntilExpiry === 1 ? 'день' : 'дня'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <ChefHat className="h-4 w-4 mr-1" />
                      Рецепты
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
