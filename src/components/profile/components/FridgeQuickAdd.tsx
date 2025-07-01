'use client';

import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Plus, Zap, History } from 'lucide-react';
import { FridgeItem } from '../../../lib/api/fridge';

interface FridgeQuickAddProps {
  QUICK_TEMPLATES: any[];
  handleQuickAdd: (template: any) => void;
  fridgeItems: FridgeItem[];
  getCategoryIcon: (category: string) => string;
}

export default function FridgeQuickAdd({
  QUICK_TEMPLATES,
  handleQuickAdd,
  fridgeItems,
  getCategoryIcon
}: FridgeQuickAddProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Zap className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Быстрое добавление</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Добавьте популярные продукты одним нажатием
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_TEMPLATES.map((template, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            onClick={() => handleQuickAdd(template)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{template.icon}</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{template.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {template.quantity} {template.unit}
              </p>
              <div className="mt-3">
                <Button size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Добавить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5 text-green-600" />
              <span>Часто покупаемые</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              На основе вашей истории покупок
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fridgeItems.slice(-6).map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd({
                    name: item.name,
                    category: item.category,
                    unit: item.unit,
                    quantity: item.quantity,
                    icon: getCategoryIcon(item.category)
                  })}
                  className="justify-start"
                >
                  <span className="mr-2">{getCategoryIcon(item.category)}</span>
                  {item.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
