import { useState, useEffect, useCallback } from 'react';
import { 
  fridgeApi, 
  FridgeItem, 
  FridgeItemInput, 
  FridgeStats, 
  AIFridgeReport, 
  AIRecipeResponse,
  FoodWaste,
  CreateFoodWaste,
  ExpenseAnalytics
} from '../lib/api/fridge';

export const useFridge = () => {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [stats, setStats] = useState<FridgeStats | null>(null);
  const [wasteHistory, setWasteHistory] = useState<FoodWaste[]>([]);
  const [expenseAnalytics, setExpenseAnalytics] = useState<ExpenseAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузить продукты из холодильника
  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fridgeApi.getItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки продуктов');
      console.error('Error loading fridge items:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Загрузить статистику
  const loadStats = useCallback(async () => {
    try {
      const data = await fridgeApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading fridge stats:', err);
    }
  }, []);

  // Добавить продукт
  const addItem = useCallback(async (item: FridgeItemInput) => {
    try {
      setError(null);
      const newItem = await fridgeApi.addItem(item);
      setItems(prev => [...prev, newItem]);
      await loadStats(); // Обновляем статистику
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка добавления продукта';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadStats]);

  // Обновить продукт
  const updateItem = useCallback(async (id: string, updates: Partial<FridgeItemInput>) => {
    try {
      setError(null);
      const updatedItem = await fridgeApi.updateItem(id, updates);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      await loadStats();
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления продукта';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadStats]);

  // Удалить продукт
  const deleteItem = useCallback(async (id: string) => {
    try {
      setError(null);
      await fridgeApi.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      await loadStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления продукта';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadStats]);

  // Получить продукты, которые скоро истекают
  const getExpiringItems = useCallback((days: number = 3) => {
    const now = new Date();
    return items.filter(item => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry <= days && daysUntilExpiry > 0;
    });
  }, [items]);

  // Получить просроченные продукты
  const getExpiredItems = useCallback(() => {
    const now = new Date();
    return items.filter(item => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      return expiryDate < now;
    });
  }, [items]);

  // Получить продукты по категориям
  const getItemsByCategory = useCallback(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, FridgeItem[]>);
  }, [items]);

  // === УПРАВЛЕНИЕ ОТХОДАМИ ===
  
  // Добавить запись об отходах
  const addWaste = useCallback(async (waste: CreateFoodWaste) => {
    try {
      setError(null);
      const newWaste = await fridgeApi.addWaste(waste);
      setWasteHistory(prev => [newWaste, ...prev]);
      await loadStats(); // Обновляем статистику после добавления отходов
      return newWaste;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка добавления отходов';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadStats]);

  // Загрузить историю отходов
  const loadWasteHistory = useCallback(async (period?: string) => {
    try {
      const data = await fridgeApi.getWasteHistory(period);
      setWasteHistory(data);
    } catch (err) {
      console.error('Error loading waste history:', err);
    }
  }, []);

  // === АНАЛИТИКА ===
  
  // Загрузить аналитику расходов
  const loadExpenseAnalytics = useCallback(async (period: string = 'month') => {
    try {
      const data = await fridgeApi.getExpenseAnalytics(period);
      setExpenseAnalytics(data);
    } catch (err) {
      console.error('Error loading expense analytics:', err);
    }
  }, []);

  // Получить экономические инсайты
  const getEconomyInsights = useCallback(async () => {
    try {
      return await fridgeApi.getEconomyInsights();
    } catch (err) {
      console.error('Error loading economy insights:', err);
      return null;
    }
  }, []);

  // Первоначальная загрузка данных
  useEffect(() => {
    loadItems();
    loadStats();
    loadWasteHistory();
    loadExpenseAnalytics();
  }, [loadItems, loadStats, loadWasteHistory, loadExpenseAnalytics]);

  return {
    items,
    stats,
    wasteHistory,
    expenseAnalytics,
    isLoading,
    error,
    loadItems,
    loadStats,
    addItem,
    updateItem,
    deleteItem,
    getExpiringItems,
    getExpiredItems,
    getItemsByCategory,
    // Управление отходами
    addWaste,
    loadWasteHistory,
    // Аналитика
    loadExpenseAnalytics,
    getEconomyInsights,
  };
};

export const useAIFridge = () => {
  const [report, setReport] = useState<AIFridgeReport | null>(null);
  const [recipes, setRecipes] = useState<AIRecipeResponse | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Получить анализ холодильника от ИИ
  const getAIAnalysis = useCallback(async () => {
    try {
      setIsLoadingReport(true);
      setError(null);
      const data = await fridgeApi.getAIAnalysis();
      setReport(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка анализа ИИ';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoadingReport(false);
    }
  }, []);

  // Получить отчёт от ИИ
  const getAIReport = useCallback(async () => {
    try {
      setIsLoadingReport(true);
      setError(null);
      const data = await fridgeApi.getAIReport();
      setReport(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения отчёта ИИ';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoadingReport(false);
    }
  }, []);

  // Генерировать рецепты на основе содержимого холодильника
  const generateRecipes = useCallback(async (dietaryRestrictions?: string[]) => {
    try {
      setIsLoadingRecipes(true);
      setError(null);
      const data = await fridgeApi.generateRecipes(dietaryRestrictions);
      setRecipes(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка генерации рецептов';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoadingRecipes(false);
    }
  }, []);

  return {
    report,
    recipes,
    isLoadingReport,
    isLoadingRecipes,
    error,
    getAIAnalysis,
    getAIReport,
    generateRecipes,
  };
};
