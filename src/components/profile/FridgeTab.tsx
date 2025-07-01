'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
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
  Edit,
  Save,
  X
} from 'lucide-react';
import { useFridge, useAIFridge } from '../../hooks/useFridge';
import { FridgeItem, FridgeItemInput } from '../../lib/api/fridge';

interface LocalFridgeStats {
  totalItems: number;
  expiringItems: number;
  categoriesCount: number;
  avgDaysToExpiry: number;
}

export default function FridgeTab() {
  const { 
    items: fridgeItems, 
    stats: backendStats, 
    isLoading, 
    error,
    loadItems,
    addItem,
    updateItem,
    deleteItem,
    getExpiringItems,
    getExpiredItems,
    getItemsByCategory
  } = useFridge();

  const {
    report: aiReport,
    recipes: aiRecipes,
    isLoadingReport,
    isLoadingRecipes,
    error: aiError,
    getAIAnalysis,
    getAIReport,
    generateRecipes
  } = useAIFridge();

  const [activeView, setActiveView] = useState<'overview' | 'items' | 'expiring' | 'ai-insights'>('overview');
  const [localStats, setLocalStats] = useState<LocalFridgeStats>({
    totalItems: 0,
    expiringItems: 0,
    categoriesCount: 0,
    avgDaysToExpiry: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<FridgeItemInput>({
    name: '',
    brand: '',
    quantity: 1,
    unit: 'шт',
    category: '',
    location: 'Холодильник',
    contains_allergens: [],
    suitable_for_diets: []
  });

  // Обновляем локальную статистику при изменении данных
  useEffect(() => {
    if (fridgeItems && fridgeItems.length > 0) {
      const expiringItems = getExpiringItems(3);
      const categories = new Set(fridgeItems.map(item => item.category));
      
      // Рассчитываем средний срок годности
      const itemsWithExpiry = fridgeItems.filter(item => item.expiry_date);
      const avgDays = itemsWithExpiry.length > 0 
        ? itemsWithExpiry.reduce((sum, item) => {
            const days = getDaysUntilExpiry(item.expiry_date);
            return sum + (days || 0);
          }, 0) / itemsWithExpiry.length
        : 0;

      setLocalStats({
        totalItems: fridgeItems.length,
        expiringItems: expiringItems.length,
        categoriesCount: categories.size,
        avgDaysToExpiry: Math.round(avgDays * 10) / 10
      });
    }
  }, [fridgeItems, getExpiringItems]);

  const handleAddItem = async () => {
    try {
      await addItem(newItem);
      setNewItem({
        name: '',
        brand: '',
        quantity: 1,
        unit: 'шт',
        category: '',
        location: 'Холодильник',
        contains_allergens: [],
        suitable_for_diets: []
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Ошибка добавления продукта:', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (err) {
      console.error('Ошибка удаления продукта:', err);
    }
  };

  const handleGenerateAIInsights = async () => {
    try {
      await getAIAnalysis();
    } catch (err) {
      console.error('Ошибка генерации ИИ анализа:', err);
    }
  };

  const handleGenerateRecipes = async () => {
    try {
      await generateRecipes();
    } catch (err) {
      console.error('Ошибка генерации рецептов:', err);
    }
  };

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

  const getExpiryStatus = (days: number | null) => {
    if (days === null) return 'none';
    if (days <= 0) return 'expired';
    if (days <= 1) return 'critical';
    if (days <= 3) return 'warning';
    return 'good';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Всего продуктов</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{localStats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Скоро истекут</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{localStats.expiringItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Категорий</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{localStats.categoriesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Средний срок</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{localStats.avgDaysToExpiry} дн</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setShowAddForm(true)}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Добавить продукт</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Пополните ваш холодильник</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveView('expiring')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Истекающие продукты</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Проверьте сроки годности</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={handleGenerateAIInsights}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">ИИ анализ</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{isLoadingReport ? 'Анализ...' : 'Получить рекомендации'}</p>
          </CardContent>
        </Card>
      </div>

      {/* ИИ отчёт */}
      {aiReport && (
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-green-600" />
              <span>ИИ рекомендации</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{aiReport.summary}</p>
            
            <div>
              <h4 className="font-semibold mb-2">Рекомендации:</h4>
              <ul className="space-y-1">
                {aiReport.recommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {aiReport.alerts && aiReport.alerts.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Важные уведомления:</h4>
                {aiReport.alerts?.map((alert: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-orange-700 dark:text-orange-400">{alert.message}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderItems = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Все продукты</h3>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowAddForm(true)} 
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Добавить
          </Button>
          <Button onClick={() => setActiveView('overview')} variant="outline" size="sm">
            Назад к обзору
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid gap-4">
          {fridgeItems?.length > 0 ? fridgeItems.map((item) => {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date);
            const expiryStatus = getExpiryStatus(daysUntilExpiry);
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                        {item.brand && <span className="text-sm text-gray-500 ml-2">({item.brand})</span>}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.quantity} {item.unit}
                        {item.location && <span className="ml-2">• {item.location}</span>}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {daysUntilExpiry !== null && (
                      <Badge 
                        variant={expiryStatus === 'good' ? 'secondary' : 'destructive'}
                        className={
                          expiryStatus === 'critical' ? 'bg-red-100 text-red-800' :
                          expiryStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          expiryStatus === 'expired' ? 'bg-gray-100 text-gray-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {daysUntilExpiry <= 0 ? 'Просрочен' : 
                         daysUntilExpiry === 1 ? '1 день' : 
                         `${daysUntilExpiry} дн`}
                      </Badge>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {((item.contains_allergens?.length || 0) > 0 || (item.suitable_for_diets?.length || 0) > 0) && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.contains_allergens?.map((allergen, i) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        ⚠️ {allergen}
                      </Badge>
                    ))}
                    {item.suitable_for_diets?.map((diet, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        ✓ {diet}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          }) : (
            <div className="text-center py-8 text-gray-500">
              Холодильник пуст. Добавьте первый продукт!
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderExpiring = () => {
    const expiringItems = (fridgeItems || []).filter(item => {
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
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Загружаем данные холодильника...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-full">
              <Refrigerator className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Умный Холодильник</h2>
              <p className="text-blue-100">Управляйте продуктами с помощью ИИ</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={activeView === 'overview' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('overview')}
              className="text-white border-white/30"
            >
              Обзор
            </Button>
            <Button
              variant={activeView === 'items' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('items')}
              className="text-white border-white/30"
            >
              Продукты
            </Button>
            <Button
              variant={activeView === 'ai-insights' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('ai-insights')}
              className="text-white border-white/30"
            >
              <Bot className="h-4 w-4 mr-1" />
              ИИ анализ
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderOverview()}
            </motion.div>
          )}
          {activeView === 'items' && (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderItems()}
            </motion.div>
          )}
          {activeView === 'expiring' && (
            <motion.div
              key="expiring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderExpiring()}
            </motion.div>
          )}
          {activeView === 'ai-insights' && (
            <motion.div
              key="ai-insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">ИИ анализ холодильника</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Получите персональные рекомендации на основе содержимого вашего холодильника
                </p>
                <Button
                  onClick={handleGenerateAIInsights}
                  disabled={isLoadingReport}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  <span>{isLoadingReport ? 'Анализ...' : 'Начать анализ'}</span>
                </Button>
                
                {aiReport && (
                  <Card className="mt-6 text-left">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Bot className="h-5 w-5 text-blue-500" />
                        <span>Результаты анализа</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300">{aiReport.summary}</p>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Рекомендации:</h4>
                        <ul className="space-y-1">
                          {aiReport.recommendations?.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {aiReport.alerts && aiReport.alerts.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Важные уведомления:</h4>
                          {aiReport.alerts?.map((alert: any, index: number) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-orange-700 dark:text-orange-400">{alert.message}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Модальное окно добавления продукта */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Добавить продукт</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Молоко, хлеб, курица..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Категория</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите категорию</option>
                  <option value="Dairy">Молочные продукты</option>
                  <option value="Meat">Мясо</option>
                  <option value="Vegetables">Овощи</option>
                  <option value="Fruits">Фрукты</option>
                  <option value="Grains">Крупы</option>
                  <option value="Beverages">Напитки</option>
                  <option value="Frozen">Замороженные</option>
                  <option value="Bakery">Хлебобулочные</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewItem({
                      name: '',
                      brand: '',
                      quantity: 1,
                      unit: 'шт',
                      category: '',
                      location: 'Холодильник',
                      contains_allergens: [],
                      suitable_for_diets: []
                    });
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Отмена
                </Button>
                <Button
                  onClick={handleAddItem}
                  disabled={!newItem.name || !newItem.category}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Сохранить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
