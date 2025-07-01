'use client';

import React, { useState, useEffect } from 'react';
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
  Calendar,
  MapPin,
  Clock
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

  // Состояние для автоматически определяемых данных
  const [contextData, setContextData] = useState({
    currentDate: '',
    currentTime: '',
    timezone: '',
    location: null as { 
      lat: number; 
      lon: number; 
      city?: string;
      country?: string;
      state?: string;
      street?: string;
      houseNumber?: string;
      postcode?: string;
      district?: string;
      fullAddress?: string;
    } | null,
    locationError: null as string | null,
    isGettingLocation: false,
    showLocationPicker: false
  });

  // Функция для открытия Google Maps для выбора местоположения
  const openLocationPicker = () => {
    setContextData(prev => ({ ...prev, showLocationPicker: true }));
  };

  // Функция для закрытия карты
  const closeLocationPicker = () => {
    setContextData(prev => ({ ...prev, showLocationPicker: false }));
  };

  // Функция для установки выбранного местоположения
  const setSelectedLocation = async (lat: number, lon: number) => {
    setContextData(prev => ({ ...prev, isGettingLocation: true }));
    
    try {
      // Получаем детальную информацию об адресе для выбранных координат
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru&addressdetails=1&zoom=18`
      );
      const data = await response.json();
      
      console.log('Выбранное местоположение - полный ответ:', data);
      
      // Извлекаем детальную информацию об адресе
      const address = data.address || {};
      const locationData = {
        lat,
        lon,
        city: address.city || address.town || address.village || address.municipality || 'Неизвестный город',
        country: address.country || 'Неизвестная страна',
        state: address.state || address.region || address.province,
        street: address.road || address.street,
        houseNumber: address.house_number,
        postcode: address.postcode,
        district: address.suburb || address.district || address.neighbourhood,
        fullAddress: data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      };

      console.log('Обработанные данные выбранного адреса:', locationData);

      setContextData(prev => ({
        ...prev,
        location: locationData,
        isGettingLocation: false,
        locationError: null,
        showLocationPicker: false
      }));
    } catch (error) {
      console.error('Ошибка определения адреса:', error);
      setContextData(prev => ({
        ...prev,
        location: { lat, lon },
        isGettingLocation: false,
        locationError: null,
        showLocationPicker: false
      }));
    }
  };

  // Автоматическое определение времени и даты
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const currentDate = now.toLocaleDateString('ru-RU', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
      const currentTime = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      setContextData(prev => ({
        ...prev,
        currentDate,
        currentTime,
        timezone
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Обновляем каждую минуту

    return () => clearInterval(interval);
  }, []);

  // Получение геолокации
  useEffect(() => {
    const getLocation = async () => {
      if (!navigator.geolocation) {
        setContextData(prev => ({
          ...prev,
          locationError: 'Геолокация не поддерживается браузером'
        }));
        return;
      }

      setContextData(prev => ({ ...prev, isGettingLocation: true }));

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            // Пытаемся определить подробный адрес через Nominatim API (бесплатный)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru&addressdetails=1&zoom=18`
            );
            const data = await response.json();
            
            console.log('Геолокация - полный ответ:', data);
            
            // Извлекаем детальную информацию об адресе
            const address = data.address || {};
            const locationData = {
              lat,
              lon,
              city: address.city || address.town || address.village || address.municipality || 'Неизвестный город',
              country: address.country || 'Неизвестная страна',
              state: address.state || address.region || address.province,
              street: address.road || address.street,
              houseNumber: address.house_number,
              postcode: address.postcode,
              district: address.suburb || address.district || address.neighbourhood,
              fullAddress: data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`
            };

            console.log('Обработанные данные адреса:', locationData);

            setContextData(prev => ({
              ...prev,
              location: locationData,
              isGettingLocation: false,
              locationError: null
            }));
          } catch (error) {
            console.error('Ошибка определения города:', error);
            setContextData(prev => ({
              ...prev,
              location: { lat, lon },
              isGettingLocation: false,
              locationError: null
            }));
          }
        },
        (error) => {
          let errorMessage = 'Не удалось определить местоположение';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Доступ к геолокации запрещен';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Информация о местоположении недоступна';
              break;
            case error.TIMEOUT:
              errorMessage = 'Превышено время ожидания геолокации';
              break;
          }
          
          setContextData(prev => ({
            ...prev,
            locationError: errorMessage,
            isGettingLocation: false
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 минут кеша
        }
      );
    };

    getLocation();
  }, []);

  const steps = [
    {
      id: 'welcome',
      title: 'Добро пожаловать в IT Cook! 👋',
      subtitle: 'Давайте настроим ваш профиль для лучшего опыта',
      icon: ChefHat
    },
    {
      id: 'context',
      title: 'Персонализация 📍',
      subtitle: 'Определим ваше местоположение и время для лучших рекомендаций',
      icon: MapPin
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

  // Функция для получения персонализированного приветствия
  const getPersonalizedGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        greeting: '🌅 Доброе утро!',
        timeContext: 'Отличное время для планирования завтрака и дневного рациона!',
        emoji: '☀️'
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: '🌞 Добрый день!',
        timeContext: 'Время подумать об обеде и полезных перекусах!',
        emoji: '🌻'
      };
    } else if (hour >= 17 && hour < 22) {
      return {
        greeting: '🌆 Добрый вечер!',
        timeContext: 'Самое время спланировать ужин и подготовиться к завтрашнему дню!',
        emoji: '🌙'
      };
    } else {
      return {
        greeting: '🌙 Поздний вечер!',
        timeContext: 'Даже поздним вечером можно планировать здоровое питание!',
        emoji: '⭐'
      };
    }
  };

  const personalizedGreeting = getPersonalizedGreeting();

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
      // Завершить онбординг и обновить данные пользователя
      const existingUserData = localStorage.getItem('user_data');
      if (existingUserData) {
        const parsedUserData = JSON.parse(existingUserData);
        const updatedUserData = {
          ...parsedUserData,
          // Добавляем данные из онбординга
          height: userData.height ? parseFloat(userData.height) : undefined,
          weight: userData.weight ? parseFloat(userData.weight) : undefined,
          age: userData.age ? parseInt(userData.age) : undefined,
          gender: userData.gender || undefined,
          activity_level: userData.activityLevel || undefined,
          goals: userData.goals,
          experience: userData.experience,
          dietary_restrictions: userData.dietaryRestrictions,
          // Добавляем контекстные данные
          context: {
            timezone: contextData.timezone,
            location: contextData.location,
            onboarding_date: contextData.currentDate,
            onboarding_time: contextData.currentTime
          }
        };
        
        console.log('Onboarding: Updating user data with context', updatedUserData);
        localStorage.setItem('user_data', JSON.stringify(updatedUserData));
      }
      
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
        return userData.activityLevel !== '' && userData.age !== '' && userData.gender !== '';
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
                      {/* Персонализированное приветствие */}
                      <div className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-8">
                        <div className="text-4xl mb-3">{personalizedGreeting.emoji}</div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {personalizedGreeting.greeting}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          {personalizedGreeting.timeContext}
                        </p>
                        {contextData.currentTime && (
                          <div className="mt-3 text-sm text-gray-500 dark:text-gray-500">
                            Сейчас: {contextData.currentTime}
                          </div>
                        )}
                      </div>

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

                  {steps[currentStep].id === 'context' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="w-full max-w-2xl space-y-6"
                    >
                      {/* Информация о времени и дате */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <Clock className="h-6 w-6 text-blue-500" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Текущие дата и время
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Дата</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {contextData.currentDate || 'Определяется...'}
                            </div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Время</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {contextData.currentTime || 'Определяется...'}
                            </div>
                          </div>
                        </div>
                        {contextData.timezone && (
                          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            Часовой пояс: {contextData.timezone}
                          </div>
                        )}
                      </div>

                      {/* Информация о геолокации */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <MapPin className="h-6 w-6 text-green-500" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Местоположение
                          </h3>
                        </div>
                        
                        {contextData.isGettingLocation && (
                          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                            <span>Определяем ваше местоположение...</span>
                          </div>
                        )}

                        {contextData.location && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white mb-2">
                                  📍 Местоположение успешно определено
                                </div>
                                
                                {/* Детальная информация об адресе */}
                                <div className="space-y-2 text-sm">
                                  {contextData.location.country && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">🌍 Страна:</span>
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {contextData.location.country}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {contextData.location.state && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">🏛️ Регион:</span>
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {contextData.location.state}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {contextData.location.city && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">🏙️ Город:</span>
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {contextData.location.city}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {contextData.location.district && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">🏘️ Район:</span>
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {contextData.location.district}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {contextData.location.street && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">🛣️ Улица:</span>
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {contextData.location.street} {contextData.location.houseNumber || ''}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {contextData.location.postcode && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">📮 Индекс:</span>
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {contextData.location.postcode}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Координаты */}
                                <div className="mt-3 pt-2 border-t border-green-200 dark:border-green-700">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Координаты: {contextData.location.lat.toFixed(6)}, {contextData.location.lon.toFixed(6)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-green-500 ml-4">
                                <Check className="h-6 w-6" />
                              </div>
                            </div>
                            
                            {/* Полный адрес */}
                            {contextData.location.fullAddress && (
                              <div className="mt-3 p-3 bg-green-100 dark:bg-green-800/30 rounded-lg">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  Полный адрес:
                                </div>
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {contextData.location.fullAddress}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {contextData.locationError && (
                          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                              <div className="text-orange-500">⚠️</div>
                              <div>
                                <div className="font-medium text-orange-900 dark:text-orange-100">
                                  {contextData.locationError}
                                </div>
                                <div className="text-sm text-orange-600 dark:text-orange-200 mt-1">
                                  Мы всё равно можем предоставить отличные рекомендации!
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Кнопка для ручного выбора местоположения */}
                        <div className="mt-4">
                          <button
                            onClick={() => openLocationPicker()}
                            className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-800"
                          >
                            <MapPin className="h-5 w-5 mr-2" />
                            📍 Выбрать точное местоположение на карте
                          </button>
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                            Откроется Google Maps для точного выбора адреса
                          </p>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            🎯 Как мы используем данные о местоположении?
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-start space-x-2">
                              <span className="text-orange-500">🍅</span>
                              <span><strong>Сезонные продукты:</strong> Рекомендации свежих продуктов, доступных в вашем регионе</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="text-blue-500">🏪</span>
                              <span><strong>Местные магазины:</strong> Поиск ингредиентов в ближайших супермаркетах</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="text-green-500">🌿</span>
                              <span><strong>Региональная кухня:</strong> Традиционные блюда и рецепты вашей местности</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="text-purple-500">🌡️</span>
                              <span><strong>Климат:</strong> Адаптация рациона под погодные условия</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="text-red-500">⏰</span>
                              <span><strong>Часовой пояс:</strong> Напоминания о приемах пищи в правильное время</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="text-yellow-500">📦</span>
                              <span><strong>Доставка:</strong> Информация о службах доставки продуктов в вашем районе</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                              <span>🔒</span>
                              <span className="text-sm font-medium">
                                Ваши данные остаются приватными и используются только для персонализации
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Модальное окно с картой для выбора местоположения */}
                  {contextData.showLocationPicker && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                📍 Выберите ваше местоположение
                              </h3>
                              <button
                                onClick={closeLocationPicker}
                                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                              >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Кликните на карте, чтобы выбрать точное местоположение, или воспользуйтесь поиском.
                              </p>
                            </div>

                            {/* Контейнер для карты */}
                            <div className="relative">
                              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <div className="text-center max-w-md">
                                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Интерактивная карта
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Для демонстрации - выберите один из предустановленных адресов:
                                  </p>
                                  
                                  {/* Предустановленные адреса для демонстрации */}
                                  <div className="space-y-2">
                                    <button
                                      onClick={() => setSelectedLocation(55.7558, 37.6176)}
                                      className="block w-full text-left px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded border border-blue-200 dark:border-blue-700"
                                    >
                                      🏛️ <strong>Москва, Красная площадь</strong><br/>
                                      <span className="text-gray-600 dark:text-gray-400">Центр Москвы, Красная площадь, 1</span>
                                    </button>
                                    <button
                                      onClick={() => setSelectedLocation(59.9311, 30.3609)}
                                      className="block w-full text-left px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded border border-blue-200 dark:border-blue-700"
                                    >
                                      🌊 <strong>Санкт-Петербург, Дворцовая площадь</strong><br/>
                                      <span className="text-gray-600 dark:text-gray-400">Центр СПб, Дворцовая площадь, 2</span>
                                    </button>
                                    <button
                                      onClick={() => setSelectedLocation(55.7887, 49.1221)}
                                      className="block w-full text-left px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded border border-blue-200 dark:border-blue-700"
                                    >
                                      🏢 <strong>Казань, Кремль</strong><br/>
                                      <span className="text-gray-600 dark:text-gray-400">Казань, Кремлёвская улица, 2</span>
                                    </button>
                                    <button
                                      onClick={() => setSelectedLocation(56.8431, 60.6454)}
                                      className="block w-full text-left px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded border border-blue-200 dark:border-blue-700"
                                    >
                                      🏭 <strong>Екатеринбург, центр</strong><br/>
                                      <span className="text-gray-600 dark:text-gray-400">Екатеринбург, улица Ленина, 24</span>
                                    </button>
                                  </div>
                                  
                                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded">
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                      💡 <strong>Примечание:</strong> В полной версии здесь будет интегрирована Google Maps API 
                                      для интерактивного выбора местоположения.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                              onClick={closeLocationPicker}
                              type="button"
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                              Пол
                            </label>
                            <select
                              value={userData.gender}
                              onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="">Выберите пол</option>
                              <option value="male">Мужской</option>
                              <option value="female">Женский</option>
                              <option value="other">Другой</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
