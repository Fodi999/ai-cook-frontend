// API клиент для работы с умным холодильником

// Константы для категорий продуктов (согласно бэкенду)
export const FRIDGE_CATEGORIES = {
  Dairy: 'Dairy',
  Meat: 'Meat', 
  Fish: 'Fish',
  Vegetables: 'Vegetables',
  Fruits: 'Fruits',
  Grains: 'Grains',
  Beverages: 'Beverages',
  Condiments: 'Condiments',
  Snacks: 'Snacks',
  Other: 'Other',
} as const;

// Типы категорий
export type FridgeCategory = keyof typeof FRIDGE_CATEGORIES;

// Единицы измерения
export const UNITS = {
  // Вес
  г: 'г',
  кг: 'кг',
  // Объём
  мл: 'мл',
  л: 'л',
  // Штуки
  шт: 'шт',
  упак: 'упак',
  // Специальные
  буханка: 'буханка',
  пучок: 'пучок',
  долька: 'долька',
  ломтик: 'ломтик',
} as const;

// Локации хранения
export const STORAGE_LOCATIONS = {
  fridge: 'Холодильник',
  freezer: 'Морозильник', 
  pantry: 'Кладовая',
  kitchen_shelf: 'Кухонная полка',
  countertop: 'Столешница',
} as const;

// Причины отходов
export const WASTE_REASONS = {
  Expired: 'Истёк срок годности',
  Spoiled: 'Испортился',
  Overcooked: 'Переготовлен',
  NotLiked: 'Не понравился',
  TooMuch: 'Слишком много приготовили',
  Other: 'Другое',
} as const;
export interface FridgeItem {
  id: string;
  name: string;
  brand?: string;
  quantity: number;
  unit: string;
  category: string;
  price_per_unit?: number; // Цена за единицу (кг, л, шт)
  total_price?: number; // Общая стоимость продукта
  calculated_total_value: number; // Автоматически рассчитанная стоимость
  expiry_date?: string; // Срок годности
  purchase_date?: string; // Дата покупки
  notes?: string; // Заметки
  location?: string; // Место хранения (холодильник, морозильник, кладовая)
  days_until_expiry?: number; // Дни до истечения срока
  is_expired: boolean; // Просрочен ли продукт
  contains_allergens: string[]; // Содержит аллергены
  contains_intolerances?: string[]; // Содержит непереносимость
  suitable_for_diets: string[]; // Подходит для диет
  ingredients?: string; // Состав
  nutritional_info?: string; // Пищевая ценность
  created_at: string;
  updated_at: string;
}

export interface FridgeItemInput {
  name: string;
  brand?: string;
  quantity: number;
  unit: string;
  category: string;
  price_per_unit?: number;
  total_price?: number;
  expiry_date?: string;
  purchase_date?: string;
  location?: string;
  notes?: string;
  contains_allergens?: string[];
  contains_intolerances?: string[];
  suitable_for_diets?: string[];
  ingredients?: string;
  nutritional_info?: string;
}

// Модель для отходов
export interface FoodWaste {
  id: string;
  original_item_id?: string; // Связь с оригинальным продуктом
  name: string;
  brand?: string;
  wasted_quantity: number;
  unit: string;
  category: string;
  waste_reason: 'Expired' | 'Spoiled' | 'Overcooked' | 'NotLiked' | 'TooMuch' | 'Other';
  wasted_value?: number; // Стоимость выброшенного продукта
  waste_date: string;
  notes?: string;
  created_at: string;
}

export interface CreateFoodWaste {
  original_item_id?: string;
  name: string;
  brand?: string;
  wasted_quantity: number;
  unit: string;
  category: string;
  waste_reason: 'Expired' | 'Spoiled' | 'Overcooked' | 'NotLiked' | 'TooMuch' | 'Other';
  wasted_value?: number;
  notes?: string;
}

// Аналитика расходов
export interface ExpenseAnalytics {
  period: string; // "day", "week", "month"
  start_date: string;
  end_date: string;
  total_purchased: number;   // Общая сумма купленных продуктов
  total_wasted: number;      // Общая сумма выброшенных продуктов
  waste_percentage: number;  // Процент отходов
  savings_potential: number; // Потенциальная экономия
  category_breakdown: CategoryExpense[];
  waste_reasons: WasteReasonStats[];
}

export interface CategoryExpense {
  category: string;
  purchased: number;
  wasted: number;
  waste_percentage: number;
}

export interface WasteReasonStats {
  reason: string;
  count: number;
  value: number;
  percentage: number;
}

export interface FridgeStats {
  total_items: number;
  items_by_category: Record<string, number>;
  expiring_items: FridgeItem[];
  expired_items: FridgeItem[];
  total_value?: number;
  // Дополнительная статистика
  average_price_per_item?: number;
  most_expensive_item?: FridgeItem;
  cheapest_item?: FridgeItem;
  items_by_location?: Record<string, number>;
  upcoming_expirations?: FridgeItem[]; // Продукты, истекающие в ближайшие дни
}

export interface AIFridgeReport {
  summary: string;
  recommendations: string[];
  nutritional_analysis: {
    protein_sources: string[];
    carb_sources: string[];
    vitamin_sources: string[];
    lacking_nutrients: string[];
  };
  shopping_suggestions: string[];
  alerts: {
    type: string;
    message: string;
    urgency: string;
  }[];
}

export interface GeneratedRecipe {
  name: string;
  description: string;
  cook_time: string;
  servings: number;
  difficulty: string;
  available_ingredients: string[];
  missing_ingredients: string[];
  instructions?: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface AIRecipeResponse {
  recipes: GeneratedRecipe[];
  used_ingredients: string[];
  shopping_list: string[];
}

// Утилитарные функции для работы с константами

// Получить читаемое название категории
export const getCategoryLabel = (category: string): string => {
  const categoryMap: Record<string, string> = {
    Dairy: 'Молочные продукты',
    Meat: 'Мясо',
    Fish: 'Рыба',
    Vegetables: 'Овощи', 
    Fruits: 'Фрукты',
    Grains: 'Злаки и хлеб',
    Beverages: 'Напитки',
    Condiments: 'Приправы',
    Snacks: 'Закуски',
    Other: 'Другое',
  };
  return categoryMap[category] || category;
};

// Получить читаемое название единицы измерения
export const getUnitLabel = (unit: string): string => {
  const unitMap: Record<string, string> = {
    г: 'граммы',
    кг: 'килограммы',
    мл: 'миллилитры',
    л: 'литры',
    шт: 'штуки',
    упак: 'упаковки',
    буханка: 'буханки',
    пучок: 'пучки',
    долька: 'дольки',
    ломтик: 'ломтики',
  };
  return unitMap[unit] || unit;
};

// Получить читаемое название локации
export const getLocationLabel = (location: string): string => {
  const locationMap: Record<string, string> = {
    fridge: 'Холодильник',
    freezer: 'Морозильник',
    pantry: 'Кладовая', 
    kitchen_shelf: 'Кухонная полка',
    countertop: 'Столешница',
    main_fridge: 'Основная камера',
  };
  return locationMap[location] || location;
};

// Получить читаемое название причины отходов
export const getWasteReasonLabel = (reason: string): string => {
  const reasonMap: Record<string, string> = {
    Expired: 'Истёк срок годности',
    Spoiled: 'Испортился',
    Overcooked: 'Переготовлен',
    NotLiked: 'Не понравился',
    TooMuch: 'Слишком много приготовили',
    Other: 'Другое',
  };
  return reasonMap[reason] || reason;
};

// Форматировать цену
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

// Форматировать количество с единицей
export const formatQuantity = (quantity: number, unit: string): string => {
  return `${quantity} ${unit}`;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

// Получить токен из localStorage или cookies
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Базовая функция для API запросов
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// API функции для холодильника
export const fridgeApi = {
  // Получить все продукты из холодильника
  async getItems(): Promise<FridgeItem[]> {
    return apiRequest<FridgeItem[]>('/fridge');
  },

  // Добавить продукт в холодильник
  async addItem(item: FridgeItemInput): Promise<FridgeItem> {
    return apiRequest<FridgeItem>('/fridge', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  // Обновить продукт
  async updateItem(id: string, item: Partial<FridgeItemInput>): Promise<FridgeItem> {
    return apiRequest<FridgeItem>(`/fridge/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  },

  // Удалить продукт
  async deleteItem(id: string): Promise<void> {
    return apiRequest<void>(`/fridge/${id}`, {
      method: 'DELETE',
    });
  },

  // Получить статистику холодильника
  async getStats(): Promise<FridgeStats> {
    // Получаем все продукты и считаем статистику на клиенте
    const items = await this.getItems();
    const now = new Date();
    
    const total_items = items.length;
    const items_by_category: Record<string, number> = {};
    const expiring_items: FridgeItem[] = [];
    const expired_items: FridgeItem[] = [];
    
    items.forEach(item => {
      // Подсчёт по категориям
      items_by_category[item.category] = (items_by_category[item.category] || 0) + 1;
      
      // Проверка срока годности
      if (item.expiry_date) {
        const expiryDate = new Date(item.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 0) {
          expired_items.push(item);
        } else if (daysUntilExpiry <= 3) {
          expiring_items.push(item);
        }
      }
    });
    
    return {
      total_items,
      items_by_category,
      expiring_items,
      expired_items,
    };
  },

  // ИИ анализ холодильника
  async getAIAnalysis(): Promise<AIFridgeReport> {
    return apiRequest<AIFridgeReport>('/ai/fridge/analyze', {
      method: 'POST',
      body: JSON.stringify({ 
        analysis_type: 'report',
        max_recipes: 5,
        include_diet_check: true
      }),
    });
  },

  // Получить отчёт от ИИ
  async getAIReport(): Promise<AIFridgeReport> {
    return apiRequest<AIFridgeReport>('/ai/fridge/report');
  },

  // Генерация рецептов на основе содержимого холодильника
  async generateRecipes(dietaryRestrictions?: string[]): Promise<AIRecipeResponse> {
    return apiRequest<AIRecipeResponse>('/ai/fridge/recipes', {
      method: 'POST',
      body: JSON.stringify({ dietary_restrictions: dietaryRestrictions || [] }),
    });
  },

  // === УПРАВЛЕНИЕ ОТХОДАМИ ===
  
  // Добавить запись об отходах
  async addWaste(waste: CreateFoodWaste): Promise<FoodWaste> {
    return apiRequest<FoodWaste>('/fridge/waste', {
      method: 'POST',
      body: JSON.stringify(waste),
    });
  },

  // Получить историю отходов
  async getWasteHistory(period?: string): Promise<FoodWaste[]> {
    const params = period ? `?period=${period}` : '';
    return apiRequest<FoodWaste[]>(`/fridge/waste${params}`);
  },

  // === АНАЛИТИКА И СТАТИСТИКА ===
  
  // Получить аналитику расходов
  async getExpenseAnalytics(period: string = 'month'): Promise<ExpenseAnalytics> {
    return apiRequest<ExpenseAnalytics>(`/fridge/analytics/expenses?period=${period}`);
  },

  // Получить экономические инсайты
  async getEconomyInsights(): Promise<any> {
    return apiRequest<any>('/fridge/analytics/insights');
  },

  // Получить список категорий продуктов
  async getCategories(): Promise<string[]> {
    return apiRequest<string[]>('/fridge/categories');
  },

  // Получить продукты с истекающим сроком годности
  async getExpiringItems(days: number = 3): Promise<FridgeItem[]> {
    return apiRequest<FridgeItem[]>(`/fridge/expiring?days=${days}`);
  },

  // Получить предложения рецептов
  async getRecipeSuggestions(): Promise<any> {
    return apiRequest<any>('/fridge/suggestions');
  },
};
