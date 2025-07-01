// Система уведомлений для интеграции ИИ с холодильником
export interface FridgeNotification {
  id: string;
  type: 'expiring' | 'expired' | 'low_stock' | 'suggestion' | 'recipe';
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  timestamp: Date;
  data?: any;
}

export interface ChatFridgeIntegration {
  sendFridgeDataToChat: (message: string, data?: any) => void;
  handleFridgeQuestion: (question: string) => Promise<string>;
  generateFridgeRecommendations: () => Promise<string[]>;
}

// Утилиты для генерации сообщений чата на основе данных холодильника
export const fridgeChatUtils = {
  // Генерирует сообщение для чата с анализом холодильника
  generateFridgeAnalysisMessage: (items: any[], stats: any) => {
    const totalItems = items.length;
    const categories = new Set(items.map(item => item.category)).size;
    const expiringItems = items.filter(item => {
      if (!item.expiry_date) return false;
      const days = Math.ceil((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days <= 3 && days > 0;
    });

    return `В вашем холодильнике ${totalItems} продуктов из ${categories} категорий. ${
      expiringItems.length > 0 
        ? `⚠️ ${expiringItems.length} продуктов скоро истекают: ${expiringItems.map(item => item.name).join(', ')}.` 
        : '✅ Все продукты свежие!'
    } Что бы вы хотели приготовить?`;
  },

  // Генерирует вопросы для рецептов
  generateRecipeQuestion: (availableIngredients: string[]) => {
    return `У меня есть: ${availableIngredients.join(', ')}. Что можно приготовить из этих продуктов?`;
  },

  // Генерирует вопрос о питательности
  generateNutritionQuestion: (items: any[]) => {
    const categories = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryList = Object.entries(categories)
      .map(([cat, count]) => `${cat}: ${count}`)
      .join(', ');

    return `Проанализируй питательную ценность моих продуктов: ${categoryList}. Чего не хватает для сбалансированного питания?`;
  },

  // Генерирует вопрос о хранении
  generateStorageQuestion: (expiringItems: any[]) => {
    if (expiringItems.length === 0) {
      return "Дай общие советы по правильному хранению продуктов в холодильнике";
    }
    
    return `Как лучше сохранить свежесть продуктов: ${expiringItems.map(item => item.name).join(', ')}? Дай конкретные советы по хранению.`;
  },

  // Генерирует список покупок
  generateShoppingListQuestion: (currentItems: any[], missingIngredients?: string[]) => {
    const categories = new Set(currentItems.map(item => item.category));
    const categoriesList = Array.from(categories).join(', ');
    
    let message = `У меня есть продукты из категорий: ${categoriesList}. `;
    
    if (missingIngredients && missingIngredients.length > 0) {
      message += `Мне нужно купить: ${missingIngredients.join(', ')}. `;
    }
    
    message += "Что ещё стоит добавить в список покупок для здорового и разнообразного питания?";
    
    return message;
  },

  // Форматирует данные рецепта для отправки в чат
  formatRecipeForChat: (recipe: any) => {
    return `Дай полный рецепт для "${recipe.name}":
• Порций: ${recipe.servings}
• Время: ${recipe.cook_time}
• Сложность: ${recipe.difficulty}
• Есть у меня: ${recipe.available_ingredients?.join(', ') || 'не указано'}
• Нужно купить: ${recipe.missing_ingredients?.join(', ') || 'ничего'}

Напиши пошаговый рецепт с точными пропорциями и временем приготовления.`;
  },

  // Создаёт уведомление о скором истечении
  createExpiringNotification: (items: any[]): FridgeNotification => {
    const count = items.length;
    const itemNames = items.slice(0, 3).map(item => item.name).join(', ');
    const moreText = items.length > 3 ? ` и ещё ${items.length - 3}` : '';
    
    return {
      id: `expiring-${Date.now()}`,
      type: 'expiring',
      title: '⏰ Продукты скоро истекают',
      message: `${itemNames}${moreText} истекают в ближайшие дни`,
      urgency: 'high',
      timestamp: new Date(),
      data: { items }
    };
  },

  // Создаёт уведомление с рекомендацией рецепта
  createRecipeNotification: (recipe: any): FridgeNotification => {
    return {
      id: `recipe-${Date.now()}`,
      type: 'recipe',
      title: '👨‍🍳 Рецепт для вас',
      message: `Попробуйте приготовить "${recipe.name}" из ваших продуктов`,
      urgency: 'low',
      timestamp: new Date(),
      data: { recipe }
    };
  },

  // Создаёт уведомление о нехватке продуктов
  createLowStockNotification: (category: string): FridgeNotification => {
    return {
      id: `low-stock-${Date.now()}`,
      type: 'low_stock',
      title: '📦 Мало продуктов',
      message: `В категории "${category}" заканчиваются продукты`,
      urgency: 'medium',
      timestamp: new Date(),
      data: { category }
    };
  }
};

// Предустановленные шаблоны вопросов для чата
export const fridgeChatTemplates = {
  analysis: "Проанализируй содержимое моего холодильника и дай рекомендации",
  recipes: "Какие блюда можно приготовить из продуктов в холодильнике?",
  nutrition: "Оцени питательную ценность продуктов в холодильнике",
  storage: "Как правильно хранить продукты для максимальной свежести?",
  shopping: "Что добавить в список покупок для сбалансированного питания?",
  mealPlan: "Составь план питания на неделю из моих продуктов",
  substitutes: "Чем можно заменить недостающие ингредиенты?",
  preservation: "Как продлить срок годности скоропортящихся продуктов?",
  waste: "Как уменьшить количество пищевых отходов?",
  budgetTips: "Советы по экономному использованию продуктов"
};
