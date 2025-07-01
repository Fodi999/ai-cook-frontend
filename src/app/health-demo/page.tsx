'use client';

import { useState } from 'react';
import PersonalHealthAssistant from '../../components/PersonalHealthAssistant';
import Navigation from '../../components/Navigation';
import { Heart, Bot, Sparkles, Activity } from 'lucide-react';

export default function HealthDemo() {
  const mockUserData = {
    id: '1',
    username: 'demo_user',
    email: 'demo@example.com',
    firstName: 'Демо',
    lastName: 'Пользователь',
    height: 170,
    weight: 65,
    activityLevel: 'moderately_active',
    nutritionGoals: {
      dailyCalories: 2000,
      protein: 120,
      carbs: 250,
      fat: 70,
      water: 8
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Sparkles className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Персональный помощник по здоровью
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Демонстрация заботливого ИИ-помощника, который следит за вашим здоровьем, 
              анализирует самочувствие и дает персонализированные рекомендации
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Мониторинг здоровья
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Отслеживание настроения, энергии, сна, стресса и других важных показателей
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-indigo-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Bot className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ИИ-анализ
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Умный анализ ваших данных с помощью Google Gemini для точных рекомендаций
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Персонализация
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Индивидуальный подход, учет ваших особенностей и целей по здоровью
              </p>
            </div>
          </div>

          {/* Demo Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                Демо: Заботливый ИИ-помощник
              </h2>
              <p className="text-blue-100">
                Попробуйте поговорить с помощником о своём самочувствии
              </p>
            </div>
            
            <div className="p-6">
              <PersonalHealthAssistant userData={mockUserData} />
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
              Попробуйте задать эти вопросы:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  "Как дела с настроением?"
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  "Проверить состояние здоровья"
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  "Нужны рекомендации по питанию"
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  "Помочь с планом сна"
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  "Анализ моих привычек"
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  "Мое настроение 7/10, немного устал"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
