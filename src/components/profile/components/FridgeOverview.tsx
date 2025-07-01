'use client';

import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  Plus, 
  Zap, 
  AlertTriangle, 
  TrendingUp,
  Package,
  Clock,
  BarChart3,
  Calendar,
  Bot,
  ChefHat
} from 'lucide-react';

type FridgeView = 'overview' | 'items' | 'expiring' | 'ai-insights' | 'quick-add' | 'analytics';

interface LocalFridgeStats {
  totalItems: number;
  expiringItems: number;
  categoriesCount: number;
  avgDaysToExpiry: number;
}

interface FridgeOverviewProps {
  localStats: LocalFridgeStats;
  setShowAddForm: (show: boolean) => void;
  setActiveView: (view: FridgeView) => void;
  QUICK_TEMPLATES: any[];
  handleQuickAdd: (template: any) => void;
  handleGenerateAIInsights: () => void;
  handleGenerateRecipes: () => void;
  isLoadingReport: boolean;
  isLoadingRecipes: boolean;
  aiReport: any;
}

export default function FridgeOverview({
  localStats,
  setShowAddForm,
  setActiveView,
  QUICK_TEMPLATES,
  handleQuickAdd,
  handleGenerateAIInsights,
  handleGenerateRecipes,
  isLoadingReport,
  isLoadingRecipes,
  aiReport
}: FridgeOverviewProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                <Package className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">Всего продуктов</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{localStats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="p-1.5 md:p-2 bg-orange-100 dark:bg-orange-900 rounded-lg flex-shrink-0">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">Скоро истекут</p>
                <p className="text-lg md:text-2xl font-bold text-orange-600 dark:text-orange-400">{localStats.expiringItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">Категорий</p>
                <p className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">{localStats.categoriesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="p-1.5 md:p-2 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">Средний срок</p>
                <p className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">{localStats.avgDaysToExpiry} дн</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setShowAddForm(true)}>
          <CardContent className="p-4 md:p-6 text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Plus className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base">Добавить продукт</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Полная форма</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveView('quick-add')}>
          <CardContent className="p-4 md:p-6 text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base">Быстрое добавление</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Популярные продукты</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveView('expiring')}>
          <CardContent className="p-4 md:p-6 text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base">Истекающие продукты</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Проверьте сроки годности</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveView('analytics')}>
          <CardContent className="p-4 md:p-6 text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base">Аналитика</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Статистика покупок</p>
          </CardContent>
        </Card>
      </div>

      {/* Дополнительная секция с популярными действиями */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
              <span>Быстрые действия</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            {QUICK_TEMPLATES.slice(0, 4).map((template, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleQuickAdd(template)}
                className="w-full justify-start text-sm h-10 md:h-auto md:text-base"
              >
                <span className="mr-2 md:mr-3 text-base md:text-lg">{template.icon}</span>
                <span>Добавить {template.name}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
              <Bot className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              <span>ИИ помощник</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            <Button
              onClick={handleGenerateAIInsights}
              disabled={isLoadingReport}
              className="w-full text-sm h-10 md:h-auto md:text-base"
              variant="outline"
            >
              <Bot className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              {isLoadingReport ? 'Анализ...' : 'Анализ холодильника'}
            </Button>
            <Button
              onClick={handleGenerateRecipes}
              disabled={isLoadingRecipes}
              className="w-full text-sm h-10 md:h-auto md:text-base"
              variant="outline"
            >
              <ChefHat className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              {isLoadingRecipes ? 'Создание...' : 'Рецепты из продуктов'}
            </Button>
            <Button
              onClick={() => setActiveView('ai-insights')}
              className="w-full text-sm h-10 md:h-auto md:text-base"
              variant="outline"
            >
              <Bot className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              Перейти к ИИ анализу
            </Button>
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
                {aiReport.recommendations.map((rec: string, index: number) => (
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
                {aiReport.alerts.map((alert: any, index: number) => (
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
}
