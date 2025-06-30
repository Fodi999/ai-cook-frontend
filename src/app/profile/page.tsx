'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Globe, 
  Camera, 
  Edit3, 
  Settings, 
  Shield, 
  Bell, 
  Lock,
  Save,
  X,
  ChefHat,
  Heart,
  Users,
  Target,
  Activity,
  Home,
  ChevronRight,
  Refrigerator,
  Bot,
  Send,
  Sparkles
} from 'lucide-react';
import Navigation from '../../components/Navigation';
import { useT } from '../../hooks/useT';
import { Button } from '../../components/ui/button';
import { APIClient } from '../../lib/api';

// Типы для ИИ сообщений
interface AiMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function Profile() {
  const t = useT();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // ИИ-помощник
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      id: 1,
      type: 'ai',
      message: 'Привет! Я ваш кулинарный ИИ-помощник. Могу помочь с рецептами, планированием питания и советами по готовке. О чём хотите поговорить?',
      timestamp: new Date(),
      suggestions: [
        'Предложи рецепт на ужин',
        'Помоги с планом питания',
        'Что приготовить из моих продуктов?',
        'Как достичь целей по калориям?'
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // User data - загружается из localStorage или API
  const [userData, setUserData] = useState({
    id: '1',
    username: 'chef_alexandra',
    email: 'alexandra@example.com',
    firstName: 'Александра',
    lastName: 'Петрова',
    dateOfBirth: '1990-05-15',
    gender: 'female',
    height: 165,
    weight: 60,
    activityLevel: 'moderately_active',
    bio: 'Страстный кулинар и блогер. Люблю готовить здоровую еду и делиться рецептами.',
    location: 'Москва, Россия',
    website: 'https://alexandra-recipes.com',
    avatarUrl: '/api/placeholder/120/120',
    memberSince: '2024-01-15',
    stats: {
      totalRecipes: 47,
      followers: 1245,
      following: 89,
      likesReceived: 3421,
      recipesShared: 127,
      goalsAchieved: 23,
      daysActive: 156
    },
    nutritionGoals: {
      dailyCalories: 2000,
      protein: 120,
      carbs: 250,
      fat: 70,
      water: 8
    },
    settings: {
      profileVisibility: 'public',
      emailNotifications: true,
      pushNotifications: true
    }
  });

  const [editData, setEditData] = useState(userData);

  // Проверка авторизации и загрузка данных пользователя
  useEffect(() => {
    const loggedIn = localStorage.getItem('user_logged_in');
    const savedUserData = localStorage.getItem('user_data');
    
    if (loggedIn === 'true' && savedUserData) {
      setIsLoggedIn(true);
      const parsedUserData = JSON.parse(savedUserData);
      
      // Обновляем основные данные пользователя
      setUserData(prev => ({
        ...prev,
        email: parsedUserData.email,
        firstName: parsedUserData.name,
        username: parsedUserData.email.split('@')[0],
        id: parsedUserData.id
      }));
      
      setEditData(prev => ({
        ...prev,
        email: parsedUserData.email,
        firstName: parsedUserData.name,
        username: parsedUserData.email.split('@')[0],
        id: parsedUserData.id
      }));

      // Проверяем, нужно ли открыть определённый таб
      const profileTab = localStorage.getItem('profile_tab');
      if (profileTab) {
        setActiveTab(profileTab);
        localStorage.removeItem('profile_tab'); // Очищаем после использования
      }
    } else {
      // Если пользователь не авторизован, перенаправляем на страницу входа
      window.location.href = '/login';
    }
  }, []);

  // Функция выхода из аккаунта
  const handleLogout = () => {
    localStorage.removeItem('user_logged_in');
    localStorage.removeItem('user_data');
    localStorage.removeItem('onboarding_completed');
    window.location.href = '/';
  };

  // Функция обработки клика по предложению
  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
    // Можно сразу отправить или оставить пользователю возможность редактировать
    // handleSendMessage(); // Раскомментировать для автоотправки
  };

  // Функция отправки сообщения ИИ
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: AiMessage = {
      id: aiMessages.length + 1,
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsAiTyping(true);

    try {
      // Создаем контекст пользователя для персонализации
      const userContext = `Пользователь: ${userData.firstName} ${userData.lastName}. 
        Цели питания: ${userData.nutritionGoals.dailyCalories} ккал/день, 
        ${userData.nutritionGoals.protein}г белка, ${userData.nutritionGoals.carbs}г углеводов, ${userData.nutritionGoals.fat}г жиров.
        Уровень активности: ${userData.activityLevel}. 
        Параметры: рост ${userData.height}см, вес ${userData.weight}кг.`;

      // Вызываем API для получения ответа от ИИ
      const response = await APIClient.chatWithAi(currentMessage, userContext);

      const aiMessage: AiMessage = {
        id: aiMessages.length + 2,
        type: 'ai',
        message: response.response,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      
      setAiMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Ошибка при обращении к ИИ:', error);
      
      // Fallback к локальной генерации при ошибке API
      const fallbackResponse = generateAiResponse(currentMessage);
      const aiMessage: AiMessage = {
        id: aiMessages.length + 2,
        type: 'ai',
        message: fallbackResponse,
        timestamp: new Date()
      };
      
      setAiMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Генерация ответов ИИ (в реальном приложении здесь будет API)
  const generateAiResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('рецепт') || message.includes('готовить')) {
      return `Отлично! Учитывая ваш уровень активности (${getActivityLevelText(userData.activityLevel)}) и цель в ${userData.nutritionGoals.dailyCalories} калорий, рекомендую:\n\n🍗 Курица с овощами (450 ккал)\n🥗 Греческий салат (320 ккал)\n🍲 Овощной суп (180 ккал)\n\nКакой рецепт вас интересует?`;
    }
    
    if (message.includes('калории') || message.includes('диета')) {
      return `Исходя из ваших целей (${userData.nutritionGoals.dailyCalories} калорий в день), рекомендую:\n\n• Белки: ${userData.nutritionGoals.protein}г (${Math.round(userData.nutritionGoals.protein * 4)} ккал)\n• Углеводы: ${userData.nutritionGoals.carbs}г (${Math.round(userData.nutritionGoals.carbs * 4)} ккал)\n• Жиры: ${userData.nutritionGoals.fat}г (${Math.round(userData.nutritionGoals.fat * 9)} ккал)\n\nХотите план питания на сегодня?`;
    }
    
    if (message.includes('продукты') || message.includes('холодильник')) {
      return 'Давайте посмотрим на ваши продукты в холодильнике. Вижу у вас есть:\n\n🥕 Морковь\n🥛 Молоко\n🥩 Мясо\n🧅 Лук\n🥔 Картофель\n🧀 Сыр\n\nИз этого можно приготовить мясное рагу с овощами или картофельную запеканку с сыром!';
    }
    
    if (message.includes('цель') || message.includes('прогресс')) {
      return `Ваш прогресс отличный! 📊\n\nТекущие достижения:\n• Рецептов добавлено: ${userData.stats.totalRecipes}\n• Целей достигнуто: ${userData.stats.goalsAchieved}\n• Дней активности: ${userData.stats.daysActive}\n\nПродолжайте в том же духе! Не забывайте пить ${userData.nutritionGoals.water} стаканов воды в день.`;
    }

    if (message.includes('план питания') || message.includes('меню')) {
      return `Составлю персональный план на день для достижения ${userData.nutritionGoals.dailyCalories} ккал:\n\n🌅 Завтрак (400 ккал):\n• Овсянка с ягодами и орехами\n\n🌞 Обед (600 ккал):\n• Запечённая рыба с овощами\n\n🌆 Ужин (500 ккал):\n• Куриная грудка с салатом\n\n🍎 Перекусы (500 ккал):\n• Фрукты, орехи, йогурт\n\nНужны подробные рецепты?`;
    }
    
    if (message.includes('вес') || message.includes('похудеть') || message.includes('набрать')) {
      return `Учитывая ваши параметры (рост: ${userData.height}см, вес: ${userData.weight}кг) и уровень активности, ваш текущий план питания хорошо сбалансирован.\n\nРекомендации:\n• Поддерживайте текущий калораж\n• Следите за балансом БЖУ\n• Пейте достаточно воды\n• Регулярное питание 4-5 раз в день\n\nХотите скорректировать план под конкретную цель?`;
    }
    
    return 'Интересный вопрос! Я анализирую ваш профиль и готов помочь с:\n\n🍳 Персональными рецептами\n📊 Планированием питания\n🎯 Достижением целей\n🥗 Советами по готовке\n\nРасскажите подробнее, что вас интересует?';
  };

  // Проверка на несохранённые изменения
  const hasUnsavedChanges = JSON.stringify(userData) !== JSON.stringify(editData);

  // Предупреждение при выходе со страницы с несохранёнными изменениями
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing && hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditing, hasUnsavedChanges]);

  const tabs = [
    { id: 'profile', label: t('profile.personal_info'), icon: User },
    { id: 'goals', label: t('profile.nutrition_goals'), icon: Target },
    { id: 'settings', label: t('profile.account_settings'), icon: Settings },
    { id: 'privacy', label: t('profile.privacy_settings'), icon: Shield },
  ];

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
    // В реальном приложении здесь будет API запрос
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getActivityLevelText = (level: string) => {
    const levels = {
      sedentary: t('profile.sedentary'),
      lightly_active: t('profile.lightly_active'),
      moderately_active: t('profile.moderately_active'),
      very_active: t('profile.very_active'),
      extremely_active: t('profile.extremely_active')
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getGenderText = (gender: string) => {
    const genders = {
      male: t('profile.male'),
      female: t('profile.female'),
      other: t('profile.other')
    };
    return genders[gender as keyof typeof genders] || gender;
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm mb-4">
              <a href="/" className="flex items-center text-gray-500 hover:text-orange-500 transition-colors">
                <Home className="h-4 w-4 mr-1" />
                Главная
              </a>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white font-medium">Профиль</span>
            </nav>

            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('profile.title')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('profile.subtitle')}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>{t('profile.cancel')}</span>
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600"
                    >
                      <Save className="h-4 w-4" />
                      <span>{t('profile.save_changes')}</span>
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>{t('profile.edit_profile')}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Уведомление о несохранённых изменениях */}
          {isEditing && hasUnsavedChanges && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                      У вас есть несохранённые изменения
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                    >
                      Отменить
                    </Button>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Сохранить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex overflow-x-auto space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'profile' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' : ''
                }`}
              >
                <User className="h-4 w-4" />
                <span>Основная информация</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('goals')}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'goals' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' : ''
                }`}
              >
                <Target className="h-4 w-4" />
                <span>Цели питания</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('ai')}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'ai' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' : ''
                }`}
              >
                <Bot className="h-4 w-4" />
                <span>ИИ-помощник</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'analytics' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' : ''
                }`}
              >
                <Activity className="h-4 w-4" />
                <span>Моя аналитика</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('fridge')}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'fridge' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' : ''
                }`}
              >
                <ChefHat className="h-4 w-4" />
                <span>Мой холодильник</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('posts')}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'posts' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' : ''
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Мои посты</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <a href="/settings">
                  <Settings className="h-4 w-4" />
                  <span>Настройки</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {userData.firstName[0]}{userData.lastName[0]}
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">@{userData.username}</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('profile.member_since')} {formatDate(userData.memberSince)}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{userData.email}</span>
                  </div>
                  {userData.location && (
                    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{userData.location}</span>
                    </div>
                  )}
                  {userData.website && (
                    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">{userData.website}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <ChefHat className="h-4 w-4 text-orange-500" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {userData.stats.totalRecipes}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t('profile.total_recipes')}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {userData.stats.followers}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t('profile.followers')}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {userData.stats.likesReceived}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t('profile.likes_received')}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Target className="h-4 w-4 text-green-500" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {userData.stats.goalsAchieved}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t('profile.goals_achieved')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'profile' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      {t('profile.personal_info')}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.first_name')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.firstName}
                            onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.last_name')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.lastName}
                            onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.lastName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.email')}
                        </label>
                        <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                          {userData.email}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.username')}
                        </label>
                        <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                          @{userData.username}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.date_of_birth')}
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editData.dateOfBirth}
                            onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {formatDate(userData.dateOfBirth)}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.gender')}
                        </label>
                        {isEditing ? (
                          <select
                            value={editData.gender}
                            onChange={(e) => setEditData({...editData, gender: e.target.value})}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="male">{t('profile.male')}</option>
                            <option value="female">{t('profile.female')}</option>
                            <option value="other">{t('profile.other')}</option>
                          </select>
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {getGenderText(userData.gender)}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.height')} ({t('profile.cm')})
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.height}
                            onChange={(e) => setEditData({...editData, height: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.height} {t('profile.cm')}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.weight')} ({t('profile.kg')})
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.weight}
                            onChange={(e) => setEditData({...editData, weight: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.weight} {t('profile.kg')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('profile.activity_level')}
                      </label>
                      {isEditing ? (
                        <select
                          value={editData.activityLevel}
                          onChange={(e) => setEditData({...editData, activityLevel: e.target.value})}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="sedentary">{t('profile.sedentary')}</option>
                          <option value="lightly_active">{t('profile.lightly_active')}</option>
                          <option value="moderately_active">{t('profile.moderately_active')}</option>
                          <option value="very_active">{t('profile.very_active')}</option>
                          <option value="extremely_active">{t('profile.extremely_active')}</option>
                        </select>
                      ) : (
                        <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                          {getActivityLevelText(userData.activityLevel)}
                        </p>
                      )}
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('profile.bio')}
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editData.bio}
                          onChange={(e) => setEditData({...editData, bio: e.target.value})}
                          rows={4}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                          {userData.bio}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.location')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.location}
                            onChange={(e) => setEditData({...editData, location: e.target.value})}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.location}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.website')}
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            value={editData.website}
                            onChange={(e) => setEditData({...editData, website: e.target.value})}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.website}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'goals' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      {t('profile.nutrition_goals')}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.daily_calorie_goal')} ({t('profile.kcal')})
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.nutritionGoals.dailyCalories}
                            onChange={(e) => setEditData({
                              ...editData, 
                              nutritionGoals: {...editData.nutritionGoals, dailyCalories: parseInt(e.target.value)}
                            })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.nutritionGoals.dailyCalories} {t('profile.kcal')}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.protein_goal')} ({t('profile.g')})
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.nutritionGoals.protein}
                            onChange={(e) => setEditData({
                              ...editData, 
                              nutritionGoals: {...editData.nutritionGoals, protein: parseInt(e.target.value)}
                            })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.nutritionGoals.protein} {t('profile.g')}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.carbs_goal')} ({t('profile.g')})
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.nutritionGoals.carbs}
                            onChange={(e) => setEditData({
                              ...editData, 
                              nutritionGoals: {...editData.nutritionGoals, carbs: parseInt(e.target.value)}
                            })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.nutritionGoals.carbs} {t('profile.g')}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.fat_goal')} ({t('profile.g')})
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.nutritionGoals.fat}
                            onChange={(e) => setEditData({
                              ...editData, 
                              nutritionGoals: {...editData.nutritionGoals, fat: parseInt(e.target.value)}
                            })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.nutritionGoals.fat} {t('profile.g')}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('profile.water_goal')} ({t('analytics.glasses')})
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.nutritionGoals.water}
                            onChange={(e) => setEditData({
                              ...editData, 
                              nutritionGoals: {...editData.nutritionGoals, water: parseInt(e.target.value)}
                            })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {userData.nutritionGoals.water} {t('analytics.glasses')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Таб аналитики */}
                {activeTab === 'analytics' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Моя аналитика
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Цели питания</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Прогресс по дневным целям</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Калории</span>
                            <span className="text-sm font-medium">1650 / 2000</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '82%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Активность</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">За последние 7 дней</p>
                        <div className="text-2xl font-bold text-green-600 mb-2">5</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">дней готовки</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button asChild>
                        <a href="/analytics">Подробная аналитика</a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Таб холодильника */}
                {activeTab === 'fridge' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Мой холодильник
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['🥕 Морковь', '🥛 Молоко', '🥩 Мясо', '🧅 Лук', '🥔 Картофель', '🧀 Сыр'].map((item, index) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                          <div className="text-2xl mb-2">{item.split(' ')[0]}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{item.split(' ')[1]}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button>Управлять продуктами</Button>
                    </div>
                  </div>
                )}

                {/* Таб постов */}
                {activeTab === 'posts' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Мои посты
                      </h3>
                      <Button asChild>
                        <a href="/community">Создать пост</a>
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { title: 'Мой первый торт Napoleon', likes: 12, comments: 3, time: '2 дня назад' },
                        { title: 'Секрет идеального борща', likes: 28, comments: 7, time: '1 неделю назад' },
                        { title: 'Домашняя паста с грибами', likes: 15, comments: 2, time: '2 недели назад' }
                      ].map((post, index) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">{post.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>❤️ {post.likes}</span>
                            <span>💬 {post.comments}</span>
                            <span>{post.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button asChild variant="outline">
                        <a href="/community">Все мои посты</a>
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      {t('profile.account_settings')}
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                          {t('profile.change_password')}
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          <input
                            type="password"
                            placeholder={t('profile.current_password')}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <input
                            type="password"
                            placeholder={t('profile.new_password')}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <input
                            type="password"
                            placeholder={t('profile.confirm_new_password')}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <Button className="w-fit">
                            {t('profile.change_password')}
                          </Button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                          {t('profile.notifications')}
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Bell className="h-5 w-5 text-gray-400" />
                              <span className="text-gray-900 dark:text-white">{t('profile.email_notifications')}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userData.settings.emailNotifications}
                                onChange={(e) => setUserData({
                                  ...userData,
                                  settings: {...userData.settings, emailNotifications: e.target.checked}
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Activity className="h-5 w-5 text-gray-400" />
                              <span className="text-gray-900 dark:text-white">{t('profile.push_notifications')}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userData.settings.pushNotifications}
                                onChange={(e) => setUserData({
                                  ...userData,
                                  settings: {...userData.settings, pushNotifications: e.target.checked}
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      {t('profile.privacy_settings')}
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                          {t('profile.profile_visibility')}
                        </h4>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="profileVisibility"
                              value="public"
                              checked={userData.settings.profileVisibility === 'public'}
                              onChange={(e) => setUserData({
                                ...userData,
                                settings: {...userData.settings, profileVisibility: e.target.value}
                              })}
                              className="text-blue-600"
                            />
                            <div>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {t('profile.public_profile')}
                              </span>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Ваш профиль виден всем пользователям
                              </p>
                            </div>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="profileVisibility"
                              value="private"
                              checked={userData.settings.profileVisibility === 'private'}
                              onChange={(e) => setUserData({
                                ...userData,
                                settings: {...userData.settings, profileVisibility: e.target.value}
                              })}
                              className="text-blue-600"
                            />
                            <div>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {t('profile.private_profile')}
                              </span>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Ваш профиль виден только подписчикам
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                                Выйти из аккаунта
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Завершить текущую сессию
                              </p>
                            </div>
                            <Button
                              onClick={handleLogout}
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                              Выйти
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div>
                              <h4 className="text-md font-medium text-red-900 dark:text-red-400">
                                {t('profile.delete_account')}
                              </h4>
                              <p className="text-sm text-red-700 dark:text-red-300">
                                Это действие нельзя отменить
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              {t('profile.delete_account')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Таб ИИ-помощника */}
                {activeTab === 'ai' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-white/20 rounded-full">
                          <Bot className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">ИИ Кулинарный Помощник</h3>
                          <p className="text-purple-100">Ваш персональный гид в мире кулинарии</p>
                        </div>
                        <div className="ml-auto">
                          <Sparkles className="h-6 w-6 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Область сообщений */}
                    <div className="h-96 overflow-y-auto p-6 space-y-4">
                      {aiMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md space-y-2`}>
                            <div
                              className={`px-4 py-3 rounded-2xl ${
                                msg.type === 'user'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}
                            >
                              {msg.type === 'ai' && (
                                <div className="flex items-center space-x-2 mb-2">
                                  <Bot className="h-4 w-4 text-purple-500" />
                                  <span className="text-xs font-medium text-purple-500">ИИ Помощник</span>
                                </div>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              <p className={`text-xs mt-1 ${
                                msg.type === 'user' ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {msg.timestamp.toLocaleTimeString('ru-RU', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                            
                            {/* Предложения от ИИ */}
                            {msg.type === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                              <div className="flex flex-wrap gap-2 max-w-md">
                                {msg.suggestions.map((suggestion, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors border border-purple-200 dark:border-purple-800"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isAiTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
                            <div className="flex items-center space-x-2">
                              <Bot className="h-4 w-4 text-purple-500" />
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Поле ввода */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Спросите что-нибудь о готовке, рецептах или питании..."
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || isAiTyping}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-6"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Быстрые вопросы */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {[
                          'Предложи рецепт на ужин',
                          'Помоги с планом питания',
                          'Что приготовить из моих продуктов?',
                          'Как достичь целей по калориям?'
                        ].map((question, index) => (
                          <button
                            key={index}
                            onClick={() => setNewMessage(question)}
                            className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
