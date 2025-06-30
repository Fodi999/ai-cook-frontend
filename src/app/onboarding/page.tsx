'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat, 
  Target, 
  Users, 
  BarChart3, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  User,
  Scale,
  Activity,
  Calendar
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import Navigation from '../../components/Navigation';
import { useT } from '../../hooks/useT';

export default function Onboarding() {
  const t = useT();
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    goals: [] as string[],
    experience: '',
    activityLevel: '',
    dietaryRestrictions: [] as string[],
    weight: '',
    height: '',
    age: '',
    gender: ''
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Добро пожаловать в IT Cook! 👋',
      subtitle: 'Давайте настроим ваш профиль для лучшего опыта',
      icon: ChefHat
    },
    {
      id: 'goals',
      title: 'Какие у вас цели? 🎯',
      subtitle: 'Выберите то, что вас интересует больше всего',
      icon: Target
    },
    {
      id: 'experience',
      title: 'Ваш кулинарный опыт? 👨‍🍳',
      subtitle: 'Это поможет нам подобрать подходящие рецепты',
      icon: ChefHat
    },
    {
      id: 'health',
      title: 'Расскажите о себе 📊',
      subtitle: 'Для расчета персональных рекомендаций по питанию',
      icon: BarChart3
    },
    {
      id: 'complete',
      title: 'Всё готово! 🎉',
      subtitle: 'Добро пожаловать в IT Cook. Начнем готовить!',
      icon: Check
    }
  ];

  const goalOptions = [
    { id: 'lose_weight', label: 'Похудеть', icon: '⚖️' },
    { id: 'gain_weight', label: 'Набрать вес', icon: '💪' },
    { id: 'maintain_weight', label: 'Поддерживать вес', icon: '⚖️' },
    { id: 'eat_healthy', label: 'Питаться здорово', icon: '🥗' },
    { id: 'save_money', label: 'Экономить на еде', icon: '💰' },
    { id: 'learn_cooking', label: 'Научиться готовить', icon: '👨‍🍳' },
    { id: 'meal_planning', label: 'Планировать питание', icon: '📅' },
    { id: 'family_cooking', label: 'Готовить для семьи', icon: '👨‍👩‍👧‍👦' }
  ];

  const experienceOptions = [
    { id: 'beginner', label: 'Новичок', desc: 'Только начинаю готовить' },
    { id: 'intermediate', label: 'Средний уровень', desc: 'Умею готовить основные блюда' },
    { id: 'advanced', label: 'Продвинутый', desc: 'Готовлю сложные блюда' },
    { id: 'expert', label: 'Эксперт', desc: 'Профессиональный повар' }
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Малоподвижный', desc: 'Офисная работа, мало спорта' },
    { id: 'lightly_active', label: 'Слабоактивный', desc: '1-3 тренировки в неделю' },
    { id: 'moderately_active', label: 'Умеренно активный', desc: '3-5 тренировок в неделю' },
    { id: 'very_active', label: 'Очень активный', desc: '6-7 тренировок в неделю' },
    { id: 'extremely_active', label: 'Крайне активный', desc: 'Спортсмен/физический труд' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Завершить онбординг и перенаправить на главную страницу
      localStorage.setItem('onboarding_completed', 'true');
      window.location.href = '/';
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'goals':
        return userData.goals.length > 0;
      case 'experience':
        return userData.experience !== '';
      case 'health':
        return userData.activityLevel !== '' && userData.age !== '';
      default:
        return true;
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="h-1 bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Шаг {currentStep + 1} из {steps.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progressPercentage)}% завершено
              </span>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[600px] flex flex-col"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="mx-auto h-16 w-16 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full flex items-center justify-center mb-6"
                  >
                    {React.createElement(steps[currentStep].icon, {
                      className: "h-8 w-8 text-white"
                    })}
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {steps[currentStep].title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {steps[currentStep].subtitle}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center">
                  {steps[currentStep].id === 'welcome' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="text-center max-w-2xl"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                          <ChefHat className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">Рецепты</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">10,000+ рецептов</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                          <Target className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">Цели</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Умные рекомендации</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                          <Users className="h-8 w-8 text-green-500 mx-auto mb-3" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">Сообщество</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Делитесь рецептами</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                          <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">Аналитика</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Отслеживайте прогресс</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-8">
                        IT Cook поможет вам готовить вкусную и здоровую еду, достигать целей питания 
                        и делиться опытом с другими пользователями.
                      </p>
                    </motion.div>
                  )}

                  {steps[currentStep].id === 'goals' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="w-full max-w-4xl"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {goalOptions.map((goal) => (
                          <motion.button
                            key={goal.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleGoalToggle(goal.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              userData.goals.includes(goal.id)
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className="text-3xl mb-2">{goal.icon}</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {goal.label}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {steps[currentStep].id === 'experience' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="w-full max-w-2xl space-y-4"
                    >
                      {experienceOptions.map((option) => (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setUserData(prev => ({ ...prev, experience: option.id }))}
                          className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
                            userData.experience === option.id
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {option.desc}
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {steps[currentStep].id === 'health' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="w-full max-w-2xl space-y-6"
                    >
                      {/* Basic Info */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                          Основная информация
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Возраст
                            </label>
                            <input
                              type="number"
                              value={userData.age}
                              onChange={(e) => setUserData(prev => ({ ...prev, age: e.target.value }))}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="25"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Рост (см)
                            </label>
                            <input
                              type="number"
                              value={userData.height}
                              onChange={(e) => setUserData(prev => ({ ...prev, height: e.target.value }))}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="170"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Вес (кг)
                            </label>
                            <input
                              type="number"
                              value={userData.weight}
                              onChange={(e) => setUserData(prev => ({ ...prev, weight: e.target.value }))}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="70"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Activity Level */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                          Уровень активности
                        </h3>
                        <div className="space-y-3">
                          {activityLevels.map((level) => (
                            <button
                              key={level.id}
                              onClick={() => setUserData(prev => ({ ...prev, activityLevel: level.id }))}
                              className={`w-full p-4 rounded-lg border text-left transition-all ${
                                userData.activityLevel === level.id
                                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              <div className="font-medium text-gray-900 dark:text-white">
                                {level.label}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {level.desc}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {steps[currentStep].id === 'complete' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="text-center max-w-2xl"
                    >
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                          Настройка завершена!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Ваш профиль настроен. Теперь вы можете пользоваться всеми возможностями IT Cook: 
                          находить рецепты, отслеживать питание и общаться с другими кулинарами.
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {userData.goals.length}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Целей выбрано</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {userData.experience ? experienceOptions.find(e => e.id === userData.experience)?.label : 'Не указан'}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Уровень опыта</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {userData.activityLevel ? activityLevels.find(a => a.id === userData.activityLevel)?.label : 'Не указан'}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Активность</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Назад</span>
                  </Button>

                  <div className="flex space-x-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index <= currentStep
                            ? 'bg-orange-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <span>
                      {currentStep === steps.length - 1 ? 'Начать готовить!' : 'Далее'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
