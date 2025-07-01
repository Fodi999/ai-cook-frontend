import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Bot, 
  ChefHat, 
  AlertTriangle,
  RefreshCw,
  Utensils,
  ShoppingCart,
  TrendingUp,
  Package
} from 'lucide-react';
import { AIFridgeReport, GeneratedRecipe } from '../../lib/api/fridge';

interface FridgeAIChatIntegrationProps {
  report: AIFridgeReport | null;
  recipes: { recipes: GeneratedRecipe[] } | null;
  isLoadingReport: boolean;
  isLoadingRecipes: boolean;
  onGenerateReport: () => void;
  onGenerateRecipes: () => void;
  onSendToChat: (message: string) => void;
}

export default function FridgeAIChatIntegration({
  report,
  recipes,
  isLoadingReport,
  isLoadingRecipes,
  onGenerateReport,
  onGenerateRecipes,
  onSendToChat
}: FridgeAIChatIntegrationProps) {

  const handleSendRecommendationToChat = (recommendation: string) => {
    onSendToChat(`Расскажи подробнее: ${recommendation}`);
  };

  const handleSendRecipeToChat = (recipe: GeneratedRecipe) => {
    const message = `Дай полный рецепт для "${recipe.name}" на ${recipe.servings} порций. Время приготовления: ${recipe.cook_time}`;
    onSendToChat(message);
  };

  const handleAskNutritionQuestion = () => {
    onSendToChat("Проанализируй питательную ценность продуктов в моём холодильнике и дай рекомендации по сбалансированному питанию");
  };

  const handleAskShoppingAdvice = () => {
    onSendToChat("Что мне нужно купить, чтобы дополнить продукты в холодильнике для здорового питания?");
  };

  const handleAskExpirationTips = () => {
    onSendToChat("Дай советы как лучше хранить продукты и продлить их свежесть");
  };

  return (
    <div className="space-y-6">
      {/* Заголовок секции */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ИИ анализ холодильника
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Получите персональные рекомендации на основе содержимого вашего холодильника
        </p>
      </div>

      {/* Кнопки для генерации анализа */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={onGenerateReport}
          disabled={isLoadingReport}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 h-auto"
        >
          <div className="flex flex-col items-center space-y-2">
            {isLoadingReport ? (
              <RefreshCw className="h-6 w-6 animate-spin" />
            ) : (
              <TrendingUp className="h-6 w-6" />
            )}
            <div className="text-center">
              <div className="font-semibold">
                {isLoadingReport ? 'Анализ...' : 'Получить анализ'}
              </div>
              <div className="text-sm opacity-90">
                Персональные рекомендации
              </div>
            </div>
          </div>
        </Button>

        <Button
          onClick={onGenerateRecipes}
          disabled={isLoadingRecipes}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-6 h-auto"
        >
          <div className="flex flex-col items-center space-y-2">
            {isLoadingRecipes ? (
              <RefreshCw className="h-6 w-6 animate-spin" />
            ) : (
              <ChefHat className="h-6 w-6" />
            )}
            <div className="text-center">
              <div className="font-semibold">
                {isLoadingRecipes ? 'Генерация...' : 'Генерировать рецепты'}
              </div>
              <div className="text-sm opacity-90">
                На основе ваших продуктов
              </div>
            </div>
          </div>
        </Button>
      </div>

      {/* Отчёт ИИ */}
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Краткая сводка */}
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-purple-500" />
                <span>Анализ ИИ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{report.summary}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSendToChat(`Расскажи подробнее об анализе моего холодильника: ${report.summary}`)}
                className="w-full"
              >
                💬 Обсудить в чате
              </Button>
            </CardContent>
          </Card>

          {/* Рекомендации */}
          {report.recommendations && report.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5 text-green-500" />
                  <span>Рекомендации</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.recommendations.map((rec, index) => (
                    <div 
                      key={index}
                      className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                        {rec}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendRecommendationToChat(rec)}
                        className="ml-2 text-blue-500 hover:text-blue-600"
                      >
                        💬
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Алерты */}
          {report.alerts && report.alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span>Важные уведомления</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.alerts.map((alert, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.urgency === 'high' 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* Сгенерированные рецепты */}
      {recipes && recipes.recipes && recipes.recipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ChefHat className="h-5 w-5 text-green-500" />
                <span>Рецепты для вас</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {recipes.recipes.map((recipe, index) => (
                  <div 
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {recipe.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {recipe.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            ⏱️ {recipe.cook_time}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            👥 {recipe.servings} порций
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            📊 {recipe.difficulty}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {recipe.available_ingredients.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                                ✅ Есть у вас:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {recipe.available_ingredients.map((ing, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    {ing}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {recipe.missing_ingredients.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">
                                🛒 Нужно купить:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {recipe.missing_ingredients.map((ing, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {ing}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendRecipeToChat(recipe)}
                        className="ml-4"
                      >
                        💬 Рецепт в чат
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Быстрые вопросы для чата */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-500" />
            <span>Быстрые вопросы для ИИ</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handleAskNutritionQuestion}
              className="text-left h-auto p-4 flex flex-col items-start space-y-1"
            >
              <div className="font-medium text-sm">🥗 Питательность</div>
              <div className="text-xs text-gray-500">Анализ питания</div>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleAskShoppingAdvice}
              className="text-left h-auto p-4 flex flex-col items-start space-y-1"
            >
              <div className="font-medium text-sm">🛒 Список покупок</div>
              <div className="text-xs text-gray-500">Что нужно купить</div>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleAskExpirationTips}
              className="text-left h-auto p-4 flex flex-col items-start space-y-1"
            >
              <div className="font-medium text-sm">📅 Хранение</div>
              <div className="text-xs text-gray-500">Советы по свежести</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
