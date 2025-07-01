'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Plus, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  Bot, 
  ChefHat, 
  ShoppingCart,
  BarChart3,
  Refrigerator,
  Calendar,
  Package,
  RefreshCw,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useFridge } from '../../hooks/useFridge';

export default function FridgeTabMobile() {
  const { 
    items: fridgeItems, 
    isLoading, 
    error,
    addItem,
    deleteItem,
    getExpiringItems
  } = useFridge();

  const [activeView, setActiveView] = useState<'overview' | 'items' | 'add'>('overview');
  const [showAddForm, setShowAddForm] = useState(false);

  const expiringItems = getExpiringItems(3);
  const categories = new Set(fridgeItems.map(item => item.category));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Dairy': return '🥛';
      case 'Meat': return '🥩';
      case 'Vegetables': return '🥬';
      case 'Fruits': return '🍎';
      case 'Grains': return '🌾';
      default: return '📦';
    }
  };

  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const quickItems = [
    { name: 'Молоко', category: 'Dairy', icon: '🥛' },
    { name: 'Хлеб', category: 'Grains', icon: '🍞' },
    { name: 'Яйца', category: 'Dairy', icon: '🥚' },
    { name: 'Курица', category: 'Meat', icon: '🐔' },
  ];

  const handleQuickAdd = async (item: typeof quickItems[0]) => {
    try {
      await addItem({
        name: item.name,
        quantity: 1,
        unit: 'шт',
        category: item.category,
        location: 'Холодильник',
        purchase_date: new Date().toISOString().split('T')[0],
        contains_allergens: [],
        suitable_for_diets: []
      });
    } catch (err) {
      console.error('Ошибка добавления:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Загружаем данные...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Мобильный заголовок */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <Refrigerator className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Умный Холодильник</h2>
            <p className="text-blue-100 text-sm">Управляйте продуктами</p>
          </div>
        </div>
        
        {/* Мобильная навигация */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          <Button
            variant={activeView === 'overview' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('overview')}
            className="text-white border-white/30 whitespace-nowrap"
          >
            <Package className="h-4 w-4 mr-1.5" />
            Обзор
          </Button>
          <Button
            variant={activeView === 'items' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('items')}
            className="text-white border-white/30 whitespace-nowrap"
          >
            <Refrigerator className="h-4 w-4 mr-1.5" />
            Продукты
          </Button>
          <Button
            variant={activeView === 'add' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('add')}
            className="text-white border-white/30 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Добавить
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Обзор */}
        {activeView === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Статистика */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Всего</p>
                      <p className="text-lg font-bold">{fridgeItems.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Истекают</p>
                      <p className="text-lg font-bold text-orange-600">{expiringItems.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Категорий</p>
                      <p className="text-lg font-bold text-green-600">{categories.size}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">ИИ анализ</p>
                      <p className="text-lg font-bold text-purple-600">Готов</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Быстрые действия */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleQuickAdd(item)}
                    className="w-full justify-start text-sm h-10"
                  >
                    <span className="mr-2 text-base">{item.icon}</span>
                    <span>Добавить {item.name}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Продукты */}
        {activeView === 'items' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Все продукты</h3>
              <Button 
                onClick={() => setShowAddForm(true)} 
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Добавить
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <div className="space-y-3">
              {fridgeItems.map((item) => {
                const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date);
                
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="text-xl">{getCategoryIcon(item.category)}</div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {daysUntilExpiry !== null && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            daysUntilExpiry <= 0 ? 'bg-red-100 text-red-800' :
                            daysUntilExpiry <= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {daysUntilExpiry <= 0 ? 'Просрочен' : `${daysUntilExpiry} дн`}
                          </span>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteItem(item.id)}
                          className="p-1 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Добавление */}
        {activeView === 'add' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Быстрое добавление</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {quickItems.map((item, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleQuickAdd(item)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">{item.category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить свой продукт
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
