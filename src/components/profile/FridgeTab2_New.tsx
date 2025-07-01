'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useFridge, useAIFridge } from '../../hooks/useFridge';
import { FridgeItem, FridgeItemInput } from '../../lib/api/fridge';
import {
  FridgeOverview,
  FridgeItemsList,
  FridgeExpiringItems,
  FridgeQuickAdd,
  FridgeAnalytics,
  FridgeAIInsights,
  FridgeAddForm,
  FridgeNavigation
} from './components';

interface LocalFridgeStats {
  totalItems: number;
  expiringItems: number;
  categoriesCount: number;
  avgDaysToExpiry: number;
}

const QUICK_TEMPLATES = [
  { name: 'Молоко', category: 'Dairy', unit: 'л', icon: '🥛', quantity: 1 },
  { name: 'Хлеб', category: 'Grains', unit: 'шт', icon: '🍞', quantity: 1 },
  { name: 'Яйца', category: 'Dairy', unit: 'упак', icon: '🥚', quantity: 1 },
  { name: 'Курица', category: 'Meat', unit: 'кг', icon: '🐔', quantity: 1 },
  { name: 'Помидоры', category: 'Vegetables', unit: 'кг', icon: '🍅', quantity: 0.5 },
  { name: 'Огурцы', category: 'Vegetables', unit: 'кг', icon: '🥒', quantity: 0.5 },
  { name: 'Сыр', category: 'Dairy', unit: 'г', icon: '🧀', quantity: 200 },
];

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

  const [activeView, setActiveView] = useState<'overview' | 'items' | 'expiring' | 'ai-insights' | 'quick-add' | 'analytics'>('overview');
  const [localStats, setLocalStats] = useState<LocalFridgeStats>({
    totalItems: 0,
    expiringItems: 0,
    categoriesCount: 0,
    avgDaysToExpiry: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<FridgeItemInput>({
    name: '',
    brand: '',
    quantity: 1,
    unit: 'шт',
    category: '',
    location: 'Холодильник',
    price_per_unit: undefined,
    total_price: undefined,
    expiry_date: '',
    purchase_date: '',
    notes: '',
    ingredients: '',
    nutritional_info: '',
    contains_allergens: [],
    contains_intolerances: [],
    suitable_for_diets: []
  });

  // Обновляем локальную статистику при изменении данных
  useEffect(() => {
    if (fridgeItems.length > 0) {
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
        price_per_unit: undefined,
        total_price: undefined,
        expiry_date: '',
        purchase_date: '',
        notes: '',
        ingredients: '',
        nutritional_info: '',
        contains_allergens: [],
        contains_intolerances: [],
        suitable_for_diets: []
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Ошибка добавления продукта:', err);
    }
  };

  // Быстрое добавление из шаблона
  const handleQuickAdd = async (template: typeof QUICK_TEMPLATES[0]) => {
    try {
      const quickItem: FridgeItemInput = {
        name: template.name,
        quantity: template.quantity,
        unit: template.unit,
        category: template.category,
        location: 'Холодильник',
        purchase_date: new Date().toISOString().split('T')[0],
        expiry_date: getDefaultExpiryDate(template.category),
        contains_allergens: [],
        suitable_for_diets: []
      };
      await addItem(quickItem);
    } catch (err) {
      console.error('Ошибка быстрого добавления:', err);
    }
  };

  const getDefaultExpiryDate = (category: string) => {
    const today = new Date();
    const daysToAdd = {
      'Dairy': 7,
      'Meat': 3,
      'Fish': 2,
      'Vegetables': 7,
      'Fruits': 5,
      'Grains': 30,
      'Beverages': 30,
      'Other': 14
    }[category] || 7;
    
    today.setDate(today.getDate() + daysToAdd);
    return today.toISOString().split('T')[0];
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
      <FridgeNavigation activeView={activeView} setActiveView={setActiveView} />
      
      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FridgeOverview
                localStats={localStats}
                setShowAddForm={setShowAddForm}
                setActiveView={setActiveView}
                QUICK_TEMPLATES={QUICK_TEMPLATES}
                handleQuickAdd={handleQuickAdd}
                handleGenerateAIInsights={handleGenerateAIInsights}
                handleGenerateRecipes={handleGenerateRecipes}
                isLoadingReport={isLoadingReport}
                isLoadingRecipes={isLoadingRecipes}
                aiReport={aiReport}
              />
            </motion.div>
          )}
          {activeView === 'items' && (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FridgeItemsList
                fridgeItems={fridgeItems}
                isLoading={isLoading}
                error={error}
                setShowAddForm={setShowAddForm}
                setActiveView={setActiveView}
                handleDeleteItem={handleDeleteItem}
                getDaysUntilExpiry={getDaysUntilExpiry}
                getExpiryStatus={getExpiryStatus}
                getCategoryIcon={getCategoryIcon}
              />
            </motion.div>
          )}
          {activeView === 'expiring' && (
            <motion.div
              key="expiring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FridgeExpiringItems
                fridgeItems={fridgeItems}
                setActiveView={setActiveView}
                getDaysUntilExpiry={getDaysUntilExpiry}
                getCategoryIcon={getCategoryIcon}
              />
            </motion.div>
          )}
          {activeView === 'ai-insights' && (
            <motion.div
              key="ai-insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FridgeAIInsights
                handleGenerateAIInsights={handleGenerateAIInsights}
                isLoadingReport={isLoadingReport}
                aiReport={aiReport}
              />
            </motion.div>
          )}
          {activeView === 'quick-add' && (
            <motion.div
              key="quick-add"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FridgeQuickAdd
                QUICK_TEMPLATES={QUICK_TEMPLATES}
                handleQuickAdd={handleQuickAdd}
                fridgeItems={fridgeItems}
                getCategoryIcon={getCategoryIcon}
              />
            </motion.div>
          )}
          {activeView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FridgeAnalytics
                fridgeItems={fridgeItems}
                getItemsByCategory={getItemsByCategory}
                getExpiredItems={getExpiredItems}
                getExpiringItems={getExpiringItems}
                getCategoryIcon={getCategoryIcon}
                backendStats={backendStats}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FridgeAddForm
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={handleAddItem}
      />
    </div>
  );
}
