'use client';

import { useState, useEffect, useRef } from 'react';
import { UserData, AiMessage, AiCard } from './types';
import { APIClient } from '../../lib/api';
import { safeLocalStorage } from '../../lib/safeLocalStorage';

// Вспомогательная функция для текста уровня активности
const getActivityLevelText = (level: string) => {
  const levels = {
    sedentary: 'Сидячий образ жизни',
    lightly_active: 'Легкие нагрузки',
    moderately_active: 'Умеренные нагрузки',
    very_active: 'Высокие нагрузки',
    extremely_active: 'Экстремальные нагрузки'
  };
  return levels[level as keyof typeof levels] || level;
};

export function useProfile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Счётчик для генерации уникальных ID сообщений
  const messageIdCounter = useRef(0);
  
  // Функция для генерации уникального ID
  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return Date.now() + messageIdCounter.current + Math.floor(Math.random() * 1000);
  };
  
  // User data - загружается из localStorage или API
  const [userData, setUserData] = useState<UserData>({
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

  // ИИ-помощник - инициализируем пустым массивом, заполним в useEffect
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Состояние для анимированных частей сообщений
  const [animatedParts, setAnimatedParts] = useState<{[messageId: number]: string[]}>({}); 
  // Проверка авторизации и загрузка данных пользователя
  useEffect(() => {
    const loggedIn = safeLocalStorage.getItem('user_logged_in');
    const savedUserData = safeLocalStorage.getJSON('user_data');
    
    console.log('useProfile: Checking auth status', { loggedIn, savedUserData });
    
    if (loggedIn === 'true' && savedUserData) {
      setIsLoggedIn(true);
      const parsedUserData = savedUserData;
      
      console.log('useProfile: Parsed user data', parsedUserData);
      
      // Формируем строку местоположения из данных контекста
      const formatLocationString = (context: any) => {
        if (!context?.location) return 'Не указано';
        
        const location = context.location;
        const parts = [];
        
        if (location.city) parts.push(location.city);
        if (location.state && location.state !== location.city) parts.push(location.state);
        if (location.country) parts.push(location.country);
        
        return parts.length > 0 ? parts.join(', ') : 'Не указано';
      };

      // Обновляем основные данные пользователя с правильными полями
      const updatedUserData = {
        ...userData,
        email: parsedUserData.email,
        firstName: parsedUserData.first_name || parsedUserData.firstName || parsedUserData.name || '',
        lastName: parsedUserData.last_name || parsedUserData.lastName || '',
        username: parsedUserData.username || parsedUserData.email.split('@')[0],
        id: parsedUserData.id,
        // Дополнительные поля из онбординга или регистрации
        height: parsedUserData.height,
        weight: parsedUserData.weight,
        age: parsedUserData.age,
        gender: parsedUserData.gender,
        activityLevel: parsedUserData.activity_level || parsedUserData.activityLevel,
        goals: parsedUserData.goals,
        experience: parsedUserData.experience,
        dietaryRestrictions: parsedUserData.dietary_restrictions || parsedUserData.dietaryRestrictions,
        // Извлекаем и форматируем местоположение из контекста
        location: formatLocationString(parsedUserData.context),
        // Сохраняем полный контекст для других целей
        context: parsedUserData.context
      };
      
      console.log('useProfile: Updated user data', updatedUserData);
      
      setUserData(updatedUserData);
      setEditData(updatedUserData);

      // Инициализация приветственного сообщения ИИ с персональными данными
      if (aiMessages.length === 0) {
        const welcomeData = {
          message: `🤗 **Привет, ${updatedUserData.firstName || 'дорогой друг'}!**\n\nЯ очень рад тебя видеть! Меня зовут Алекс, и я твой персональный кулинарный наставник.`,
          cards: [
            {
              title: "Твой профиль",
              content: `💪 Цель: ${updatedUserData.nutritionGoals.dailyCalories} ккал в день\n🏃‍♂️ Активность: ${getActivityLevelText(updatedUserData.activityLevel)}\n📊 Параметры: ${updatedUserData.height}см, ${updatedUserData.weight}кг`,
              emoji: "📊",
              category: "general" as const,
              priority: "high" as const
            },
            {
              title: "Персональные рецепты",
              content: "Подберу рецепты под твои цели с точным расчётом КБЖУ и временем приготовления",
              emoji: "🍳",
              category: "recipe" as const,
              priority: "medium" as const
            },
            {
              title: "План питания",
              content: "Составлю персональный план питания на день или неделю с учётом твоих предпочтений",
              emoji: "📅",
              category: "nutrition" as const,
              priority: "medium" as const
            },
            {
              title: "Поддержка и мотивация",
              content: "Помогу не сойти с пути к цели и поддержу добрым советом в любой момент!",
              emoji: "💪",
              category: "motivation" as const,
              priority: "medium" as const
            }
          ]
        };
        
        // Показываем приветственное сообщение с карточками
        setTimeout(() => {
          animateAiMessageWithCards(welcomeData);
        }, 500); // Небольшая задержка перед показом приветствия
        
        // Загружаем активное сообщение от ИИ через некоторое время после приветствия
        setTimeout(() => {
          loadProactiveMessage();
        }, 3000); // Через 3 секунды после приветствия
      } else {
        // Если сообщения уже есть, просто загружаем новое активное сообщение
        setTimeout(() => {
          loadProactiveMessage();
        }, 1000);
      }

      // Проверяем, нужно ли открыть определённый таб
      const profileTab = safeLocalStorage.getItem('profile_tab');
      if (profileTab) {
        setActiveTab(profileTab);
        safeLocalStorage.removeItem('profile_tab'); // Очищаем после использования
      }
    } else {
      // Если пользователь не авторизован, перенаправляем на страницу входа
      window.location.href = '/login';
    }
  }, []);

  // Слушаем изменения в localStorage (например, после onboarding)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_data' && e.newValue) {
        const parsedUserData = JSON.parse(e.newValue);
        console.log('useProfile: Storage changed, updating user data', parsedUserData);
        
        // Формируем строку местоположения из данных контекста
        const formatLocationString = (context: any) => {
          if (!context?.location) return 'Не указано';
          
          const location = context.location;
          const parts = [];
          
          if (location.city) parts.push(location.city);
          if (location.state && location.state !== location.city) parts.push(location.state);
          if (location.country) parts.push(location.country);
          
          return parts.length > 0 ? parts.join(', ') : 'Не указано';
        };
        
        const updatedUserData = {
          ...userData,
          email: parsedUserData.email,
          firstName: parsedUserData.first_name || parsedUserData.firstName || parsedUserData.name || '',
          lastName: parsedUserData.last_name || parsedUserData.lastName || '',
          username: parsedUserData.username || parsedUserData.email.split('@')[0],
          id: parsedUserData.id,
          // Дополнительные поля из онбординга или регистрации
          height: parsedUserData.height,
          weight: parsedUserData.weight,
          age: parsedUserData.age,
          gender: parsedUserData.gender,
          activityLevel: parsedUserData.activity_level || parsedUserData.activityLevel,
          goals: parsedUserData.goals,
          experience: parsedUserData.experience,
          dietaryRestrictions: parsedUserData.dietary_restrictions || parsedUserData.dietaryRestrictions,
          // Извлекаем и форматируем местоположение из контекста
          location: formatLocationString(parsedUserData.context),
          // Сохраняем полный контекст для других целей
          context: parsedUserData.context
        };
        
        setUserData(updatedUserData);
        setEditData(updatedUserData);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userData]);

  // Предупреждение при выходе со страницы с несохранёнными изменениями
  useEffect(() => {
    const hasUnsavedChanges = JSON.stringify(userData) !== JSON.stringify(editData);
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing && hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditing, userData, editData]);

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
    // В реальном приложении здесь будет API запрос
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    safeLocalStorage.removeItem('user_logged_in');
    safeLocalStorage.removeItem('user_data');
    safeLocalStorage.removeItem('onboarding_completed');
    window.location.href = '/';
  };

  // Функция обработки клика по предложению
  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  // Функция отправки сообщения ИИ
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isAiTyping || isAnimating) return;

    const userMessage: AiMessage = {
      id: generateUniqueId(),
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsAiTyping(true);

    try {
      // Реалистичная задержка для имитации "печати" ИИ (1-3 секунды)
      const typingDelay = Math.random() * 2000 + 1000;
      await new Promise(resolve => setTimeout(resolve, typingDelay));

      // Создаем контекст пользователя для персонализации
      const userContext = `ВАЖНО: Отвечай ТОЛЬКО на русском языке! Используй русскую кулинарную терминологию.
      
      Пользователь: ${userData.firstName} ${userData.lastName}. 
      Цели питания: ${userData.nutritionGoals.dailyCalories} ккал/день, 
      ${userData.nutritionGoals.protein}г белка, ${userData.nutritionGoals.carbs}г углеводов, ${userData.nutritionGoals.fat}г жиров.
      Уровень активности: ${userData.activityLevel}. 
      Параметры: рост ${userData.height}см, вес ${userData.weight}кг.
      
      Формат ответа: используй структуру с эмодзи-заголовками и разделителями ––––––––––––––––––––.
      Будь кратким, практичным и полезным. Указывай конкретные цифры КБЖУ для рецептов.`;

      // Пробуем вызвать API для получения ответа от ИИ
      let response;
      try {
        response = await APIClient.chatWithAi(currentMessage, userContext);
      } catch (apiError) {
        console.log('API недоступен, используем локальную генерацию');
        // Fallback к локальной генерации карточек
        const fallbackResponse = generateAiResponseCards(currentMessage);
        response = { response: fallbackResponse.message, suggestions: generateSuggestions(currentMessage), cards: fallbackResponse.cards };
      }

      setIsAiTyping(false);
      
      // Используем анимированный показ карточек если они есть
      if (response.cards && response.cards.length > 0) {
        await animateAiMessageWithCards({ message: response.response, cards: response.cards });
      } else {
        // Используем старый метод анимации для обычных сообщений
        await animateAiMessage(response.response, response.suggestions);
      }
      
    } catch (error) {
      console.error('Ошибка при обращении к ИИ:', error);
      
      // Fallback к локальной генерации карточек при ошибке
      const fallbackResponse = generateAiResponseCards(currentMessage);
      
      setIsAiTyping(false);
      await animateAiMessageWithCards(fallbackResponse);
    }
  };

  // Генерация ответов ИИ (в реальном приложении здесь будет API)
  const generateAiResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    const firstName = userData.firstName || 'друг';
    
    if (message.includes('рецепт') || message.includes('готовить')) {
      return `😊 **${firstName}, отличный вопрос о рецептах!**
––––––––––––––––––––
Я знаю, как важно готовить вкусно и полезно! Учитывая твой уровень активности (${getActivityLevelText(userData.activityLevel)}) и цель в ${userData.nutritionGoals.dailyCalories} ккал, я подобрал для тебя идеальные варианты:

🍽️ **Мои рекомендации специально для тебя:**
––––––––––––––––––––
**🍗 Курица с овощами** (~450 ккал)
• Белок: 35г | Углеводы: 25г | Жиры: 18г
• Время: 25 минут | Сложность: простая

**🥗 Греческий салат** (~320 ккал) 
• Белок: 12г | Углеводы: 15г | Жиры: 24г
• Время: 10 минут | Идеально для ланча!

**🍲 Овощной суп** (~180 ккал)
• Белок: 8г | Углеводы: 30г | Жиры: 4г
• Время: 35 минут | Согреет душу

❤️ **Я верю в тебя, ${firstName}!**
––––––––––––––––––––
Выбери рецепт, и я дам пошаговую инструкцию. Ты справишься - я в этом уверен!`;
    }
    
    if (message.includes('калории') || message.includes('диета') || message.includes('план питания')) {
      const firstName = userData.firstName || 'друг';
      const proteinCal = Math.round(userData.nutritionGoals.protein * 4);
      const carbsCal = Math.round(userData.nutritionGoals.carbs * 4);
      const fatCal = Math.round(userData.nutritionGoals.fat * 9);
      
      return `😊 **${firstName}, давай составим твой идеальный план!**
––––––––––––––––––––
Как здорово, что ты заботишься о правильном питании! Я учёл все твои особенности и составил план специально для тебя.

🎯 **Твои цели на сегодня:**
––––––––––––––––––––
• Калории: ${userData.nutritionGoals.dailyCalories} ккал - отличная цель!
• Рост: ${userData.height}см | Вес: ${userData.weight}кг
• Активность: ${getActivityLevelText(userData.activityLevel)}

📊 **Распределение КБЖУ специально для тебя:**
––––––––––––––––––––
**🥩 Белки:** ${userData.nutritionGoals.protein}г (${proteinCal} ккал)
**🍞 Углеводы:** ${userData.nutritionGoals.carbs}г (${carbsCal} ккал)  
**🥑 Жиры:** ${userData.nutritionGoals.fat}г (${fatCal} ккал)

🌅 **ЗАВТРАК** (~${Math.round(userData.nutritionGoals.dailyCalories * 0.25)} ккал)
––––––––––––––––––––
**Овсянка с фруктами и орехами**
• 60г овсянки + 1 банан + 20г орехов
• Белки: 18г | Углеводы: 65г | Жиры: 15г
• Напиток: зелёный чай или кофе
*Это даст тебе энергию на всё утро!*

🍽️ **ОБЕД** (~${Math.round(userData.nutritionGoals.dailyCalories * 0.35)} ккал)
––––––––––––––––––––
**Куриная грудка с гречкой и овощами**
• 150г курицы + 80г гречки + салат из овощей
• Белки: 45г | Углеводы: 70г | Жиры: 18г
• 1 ст.л. оливкового масла для заправки
*Идеальное сочетание для твоих мышц!*

🥗 **ПЕРЕКУС** (~${Math.round(userData.nutritionGoals.dailyCalories * 0.1)} ккал)
––––––––––––––––––––
**Творог с ягодами**
• 150г творога 5% + 100г ягод
• Белки: 15г | Углеводы: 12г | Жиры: 8г
*Лёгкий и питательный!*

🌙 **УЖИН** (~${Math.round(userData.nutritionGoals.dailyCalories * 0.25)} ккал)
––––––––––––––––––––
**Запечённая рыба с овощами**
• 140г семги + тушёные овощи (брокколи, кабачок)
• Белки: 35г | Углеводы: 20г | Жиры: 22г
*Омега-3 для твоего мозга и сердца!*

💧 **Питьевой режим (очень важно!):**
––––––––––––––––––––
• Вода: ~${Math.round(userData.weight * 35)}мл в день
• Утром: 400мл воды натощак
• Между приёмами пищи: по 200-300мл

❤️ **${firstName}, помни:**
––––––––––––––––––––
• Принимай пищу каждые 3-4 часа
• Последний приём за 2-3 часа до сна
• Если что-то не нравится - скажи, подберём альтернативы!

🚀 **Ты обязательно справишься!**
––––––––––––––––––––
Я верю в тебя и всегда готов помочь скорректировать план!`;
    }

    if (message.includes('завтрак')) {
      return `🌅 **Доброе утро, ${firstName}!**
––––––––––––––––––––
Как спалось? Надеюсь, готов к новому дню! Завтрак - это основа твоего успеха, и я приготовил для тебя отличные варианты.

� **Цель утра:** ${Math.round(userData.nutritionGoals.dailyCalories * 0.25)} ккал
––––––––––––––––––––
Именно столько нужно твоему организму для бодрого старта!

🥚 **Вариант 1: Энергичный старт**
––––––––––––––––––––
**Омлет с овощами и зеленью** (~320 ккал)
• 2 яйца + шпинат + помидоры + зелень
• Белок: 22г | Углеводы: 8г | Жиры: 18г
• Готовится за 10 минут!

� **Вариант 2: Сытный и полезный**  
––––––––––––––––––––
**Овсянка с фруктами и орехами** (~380 ккал)
• 50г овсянки + банан + 20г орехов + мёд
• Белок: 12г | Углеводы: 65г | Жиры: 8г
• Заряд энергии на всё утро!

☕ **Не забудь про напитки, ${firstName}!**
––––––––––––––––––––
• Начни с 300-400 мл чистой воды
• Зелёный чай или кофе без сахара
• Это поможет "разбудить" метаболизм

💪 **Ты молодец, что заботишься о питании!**
––––––––––––––––––––
С таким подходом ты точно достигнешь своих целей!`;
    }

    if (message.includes('ужин')) {
      return `� **${firstName}, время восстановления!**
––––––––––––––––––––
День подходит к концу, и твой организм заслуживает качественного "топлива" для восстановления. Как прошёл день? Надеюсь, всё было отлично!

� **Цель ужина:** ${Math.round(userData.nutritionGoals.dailyCalories * 0.25)} ккал  
––––––––––––––––––––
Легко для пищеварения, но богато белком для твоих мышц!

🐟 **Вариант 1: Изысканный** (~420 ккал)
––––––––––––––––––––
**Запечённая семга с овощами**
• 150г семги + брокколи + морковь + лимон
• Белок: 35г | Углеводы: 15г | Жиры: 20г
• Омега-3 для мозга и сердца!

🥗 **Вариант 2: Лёгкий и свежий** (~350 ккал)
––––––––––––––––––––  
**Салат с курицей и авокадо**
• 120г курицы + микс салатов + авокадо + оливковое масло
• Белок: 28г | Углеводы: 12г | Жиры: 18г
• Идеально после тренировки!

💤 **Забота о твоём сне, ${firstName}:**
––––––––––––––––––––
• Ужинай за 2-3 часа до сна
• После еды - лёгкая прогулка
• Травяной чай с ромашкой поможет расслабиться

❤️ **Спокойной ночи и сладких снов!**`;
    }

    if (message.includes('перекус') || message.includes('снек')) {
      return `🍎 **${firstName}, отличная идея с перекусом!**
––––––––––––––––––––
Перекусы - это твоя "страховка" от переедания! Ты правильно делаешь, что планируешь питание заранее.

⚡ **Цель:** 100-150 ккал каждый перекус
––––––––––––––––––––
Это поддержит энергию и не нарушит твой план!

🥜 **Белковые варианты** (~120 ккал)
––––––––––––––––––––
• **Греческий йогурт + ягоды** - мой фаворит!
• **Творог с зеленью** - классика для мышц
• **Горсть орехов (20г)** - полезные жиры для мозга

🍓 **Фруктовые варианты** (~80 ккал)
––––––––––––––––––––
• **Яблоко + корица** - естественная сладость
• **Ягоды (150г)** - антиоксиданты для красоты
• **Апельсин** - витамин С для иммунитета

🥕 **Овощные варианты** (~60 ккал)
––––––––––––––––––––
• **Морковь + хумус** - хрустящая радость
• **Огурцы с творожным сыром** - свежесть
• **Помидоры черри** - ликопин для здоровья

😊 **${firstName}, ты на правильном пути!**
––––––––––––––––––––
Такой подход к питанию - залог твоего успеха!`;
    }

    if (message.includes('мотив') || message.includes('поддерж') || message.includes('как дела')) {
      return `💪 **${firstName}, я очень горжусь тобой!**
––––––––––––––––––––
То, что ты заботишься о своём питании - это уже огромный шаг к успеху! Многие только мечтают, а ты уже действуешь.

🎯 **Посмотри на свои достижения:**
––––––––––––––––––––
• ✅ У тебя есть чёткие цели: ${userData.nutritionGoals.dailyCalories} ккал
• ✅ Ты ведёшь активный образ жизни: ${getActivityLevelText(userData.activityLevel)}
• ✅ Ты обращаешься за помощью - это мудро!

❤️ **Помни, ${firstName}:**
––––––––––––––––––––
• Каждый день - это новая возможность
• Маленькие шаги ведут к большим результатам
• Я всегда рядом, чтобы поддержать тебя

� **Сегодняшний совет от меня:**
––––––––––––––––––––
Не стремись к идеалу, стремись к прогрессу! Даже если сегодня что-то пошло не по плану - завтра новый день, новые возможности.

🚀 **Ты справишься, я в тебя верю!**
––––––––––––––––––––
Расскажи, что тебя сейчас беспокоит? Я готов помочь!`;
    }
    
    return `🤗 **${firstName}, рад снова тебя видеть!**
––––––––––––––––––––
Как дела? Как продвигается план питания? Я готов помочь тебе с любыми вопросами!

🧠 **О чём поговорим сегодня?**
––––––––––––––––––––
• 🍳 Персональные рецепты под твои цели (${userData.nutritionGoals.dailyCalories} ккал)
• 📊 Планирование питания на день/неделю  
• 💪 Советы по достижению нормы КБЖУ
• 🥗 Рекомендации по готовке и хранению продуктов

❤️ **Помни: я всегда на твоей стороне!**
––––––––––––––––––––
Расскажи, что тебя интересует, и я дам максимально полезные советы именно для тебя!`;
  };

  // Генерация ответов ИИ в формате карточек
  const generateAiResponseCards = (userMessage: string): { message: string, cards: AiCard[] } => {
    const message = userMessage.toLowerCase();
    const firstName = userData.firstName || 'друг';
    
    if (message.includes('рецепт') || message.includes('готовить')) {
      return {
        message: `🍳 **${firstName}, вот идеальные рецепты для тебя!**`,
        cards: [
          {
            title: "Курица с овощами",
            content: `450 ккал • Белок: 35г, Углеводы: 25г, Жиры: 18г\n⏱️ 25 минут • Сложность: простая\n\nИдеально для твоих целей в ${userData.nutritionGoals.dailyCalories} ккал!`,
            emoji: "🍗",
            category: "recipe",
            priority: "high"
          },
          {
            title: "Греческий салат",
            content: `320 ккал • Белок: 12г, Углеводы: 15г, Жиры: 24г\n⏱️ 10 минут • Отлично для ланча!\n\nСвежий и питательный вариант.`,
            emoji: "🥗",
            category: "recipe",
            priority: "medium"
          },
          {
            title: "Овощной суп",
            content: `180 ккал • Белок: 8г, Углеводы: 30г, Жиры: 4г\n⏱️ 35 минут • Согреет душу\n\nЛёгкий и полезный вариант.`,
            emoji: "🍲",
            category: "recipe",
            priority: "medium"
          }
        ]
      };
    }
    
    if (message.includes('калории') || message.includes('диета') || message.includes('план питания')) {
      const proteinCal = Math.round(userData.nutritionGoals.protein * 4);
      const carbsCal = Math.round(userData.nutritionGoals.carbs * 4);
      const fatCal = Math.round(userData.nutritionGoals.fat * 9);
      
      return {
        message: `📊 **${firstName}, твой персональный план питания готов!**`,
        cards: [
          {
            title: "Твои цели",
            content: `🎯 Калории: ${userData.nutritionGoals.dailyCalories} ккал\n📏 Рост: ${userData.height}см | Вес: ${userData.weight}кг\n🏃‍♂️ Активность: ${getActivityLevelText(userData.activityLevel)}`,
            emoji: "🎯",
            category: "nutrition",
            priority: "high"
          },
          {
            title: "Распределение КБЖУ",
            content: `🥩 Белки: ${userData.nutritionGoals.protein}г (${proteinCal} ккал)\n🍞 Углеводы: ${userData.nutritionGoals.carbs}г (${carbsCal} ккал)  
🥑 Жиры: ${userData.nutritionGoals.fat}г (${fatCal} ккал)`,
            emoji: "📊",
            category: "nutrition",
            priority: "high"
          },
          {
            title: "Завтрак",
            content: `🌅 ~${Math.round(userData.nutritionGoals.dailyCalories * 0.25)} ккал\n\nОвсянка с фруктами и орехами:\n• 60г овсянки + 1 банан + 20г орехов\n• Белки: 18г | Углеводы: 65г | Жиры: 15г`,
            emoji: "🌅",
            category: "nutrition",
            priority: "medium"
          },
          {
            title: "Обед",
            content: `🍽️ ~${Math.round(userData.nutritionGoals.dailyCalories * 0.35)} ккал\n\nКуриная грудка с гречкой:\n• 150г курицы + 80г гречки + салат\n• Белки: 45г | Углеводы: 70г | Жиры: 18г`,
            emoji: "🍽️",
            category: "nutrition",
            priority: "medium"
          }
        ]
      };
    }

    if (message.includes('завтрак')) {
      return {
        message: `🌅 **Доброе утро, ${firstName}! Время для энергичного старта!**`,
        cards: [
          {
            title: "Цель утра",
            content: `${Math.round(userData.nutritionGoals.dailyCalories * 0.25)} ккал для бодрого старта дня!`,
            emoji: "⚡",
            category: "nutrition",
            priority: "high"
          },
          {
            title: "Омлет с овощами",
            content: `320 ккал • Белок: 22г, Углеводы: 8г, Жиры: 18г\n\n2 яйца + шпинат + помидоры + зелень\n⏱️ Готовится за 10 минут!`,
            emoji: "🥚",
            category: "recipe",
            priority: "high"
          },
          {
            title: "Овсянка с фруктами",
            content: `380 ккал • Белок: 12г, Углеводы: 65г, Жиры: 8г\n\n50г овсянки + банан + 20г орехов + мёд\n⚡ Заряд энергии на всё утро!`,
            emoji: "🥣",
            category: "recipe",
            priority: "medium"
          }
        ]
      };
    }

    if (message.includes('мотив') || message.includes('поддерж') || message.includes('как дела')) {
      return {
        message: `💪 **${firstName}, я очень горжусь тобой!**`,
        cards: [
          {
            title: "Твои достижения",
            content: `✅ Чёткие цели: ${userData.nutritionGoals.dailyCalories} ккал\n✅ Активный образ жизни: ${getActivityLevelText(userData.activityLevel)}\n✅ Ты обращаешься за помощью - это мудро!`,
            emoji: "🏆",
            category: "motivation",
            priority: "high"
          },
          {
            title: "Помни главное",
            content: `• Каждый день - новая возможность\n• Маленькие шаги ведут к большим результатам\n• Я всегда рядом, чтобы поддержать тебя`,
            emoji: "❤️",
            category: "motivation",
            priority: "medium"
          },
          {
            title: "Совет дня",
            content: `Не стремись к идеалу, стремись к прогрессу! Даже если сегодня что-то пошло не по плану - завтра новый день, новые возможности.`,
            emoji: "🌟",
            category: "motivation",
            priority: "medium"
          }
        ]
      };
    }
    
    // Общий ответ по умолчанию
    return {
      message: `🤗 **${firstName}, рад снова тебя видеть!**`,
      cards: [
        {
          title: "Персональные рецепты",
          content: `Рецепты под твои цели в ${userData.nutritionGoals.dailyCalories} ккал с точным расчётом КБЖУ`,
          emoji: "🍳",
          category: "recipe",
          priority: "medium"
        },
        {
          title: "Планирование питания",
          content: `Составлю план питания на день или неделю с учётом твоих предпочтений`,
          emoji: "📅",
          category: "nutrition", 
          priority: "medium"
        },
        {
          title: "Советы по КБЖУ",
          content: `Помогу достичь нормы белков, жиров и углеводов для твоих целей`,
          emoji: "📊",
          category: "nutrition",
          priority: "low"
        },
        {
          title: "Мотивация",
          content: `Поддержу добрым советом и помогу не сойти с пути к цели!`,
          emoji: "💪",
          category: "motivation",
          priority: "low"
        }
      ]
    };
  };

  // Генерация предложений для продолжения диалога
  const generateSuggestions = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('рецепт') || message.includes('готовить')) {
      return [
        'Рецепт курицы с овощами',
        'Быстрые рецепты на 20 минут',
        'Рецепты для набора массы',
        'Вегетарианские блюда'
      ];
    }
    
    if (message.includes('калории') || message.includes('диета') || message.includes('план питания')) {
      return [
        'План питания на завтра',
        'Как считать КБЖУ?',
        'Полезные перекусы',
        'Дефицит/профицит калорий'
      ];
    }

    if (message.includes('завтрак')) {
      return [
        'ПП-завтраки на неделю',
        'Быстрые завтраки',
        'Белковые завтраки',
        'Что пить с утра?'
      ];
    }

    if (message.includes('ужин')) {
      return [
        'Лёгкие ужины',
        'Ужин для похудения', 
        'Белковые ужины',
        'Что есть перед сном?'
      ];
    }

    if (message.includes('перекус')) {
      return [
        'ПП-перекусы на работе',
        'Перекусы для спортсменов',
        'Фруктовые снеки',
        'Что брать в дорогу?'
      ];
    }
    
    return [
      'План питания на день',
      'Здоровые завтраки',
      'Быстрые рецепты',
      'Перекусы для энергии'
    ];
  };

  // Функция для загрузки активного сообщения от ИИ
  const loadProactiveMessage = async () => {
    try {
      // Создаем контекст для активного сообщения
      const now = new Date();
      const context = {
        user_context: `Пользователь: ${userData.firstName} ${userData.lastName}. Цели: ${userData.nutritionGoals.dailyCalories} ккал/день. Активность: ${userData.activityLevel}. Параметры: ${userData.height}см, ${userData.weight}кг.`,
        last_activity: safeLocalStorage.getItem('last_visit') || now.toISOString(),
        current_time: now.toISOString()
      };
      
      // Получаем активное сообщение от API
      const proactiveMessage = await APIClient.getProactiveMessage(context);
      
      // Конвертируем в формат AiMessage и показываем
      const aiMessage: AiMessage = {
        id: generateUniqueId(),
        type: 'ai',
        message: proactiveMessage.message,
        timestamp: new Date(),
        cards: proactiveMessage.cards || [],
        suggestions: proactiveMessage.suggestions || [],
        isProactive: true // Помечаем как активное сообщение
      };
      
      // Добавляем сообщение с анимацией
      if (proactiveMessage.cards && proactiveMessage.cards.length > 0) {
        await animateAiMessageWithCards({ 
          message: proactiveMessage.message, 
          cards: proactiveMessage.cards 
        });
      } else {
        await animateAiMessage(proactiveMessage.message, proactiveMessage.suggestions);
      }
      
      // Сохраняем время последнего визита
      safeLocalStorage.setItem('last_visit', now.toISOString());
      
    } catch (error) {
      console.log('Не удалось загрузить активное сообщение от ИИ:', error);
      // Не показываем ошибку пользователю, просто логируем
    }
  };

  // Новая функция для анимированного показа карточек
  const animateAiMessageWithCards = async (responseData: { message: string, cards: AiCard[] }) => {
    setIsAnimating(true);
    
    // Создаем уникальный ID сообщения
    const messageId = generateUniqueId();
    const aiMessage: AiMessage = {
      id: messageId,
      type: 'ai',
      message: responseData.message,
      timestamp: new Date(),
      cards: [], // Начинаем с пустых карточек
      suggestions: generateSuggestions(responseData.message)
    };
    
    // Добавляем сообщение в список
    setAiMessages(prev => [...prev, aiMessage]);
    
    // Инициализируем анимированные части пустым массивом
    setAnimatedParts(prev => ({ ...prev, [messageId]: [] }));
    
    // 1. Сначала анимируем текст сообщения по частям
    const fullMessage = responseData.message;
    
    // Простое разбиение текста на части (можно улучшить по необходимости)
    const textParts: string[] = [];
    const sentences = fullMessage.split(/(?<=[.!?])\s+/).filter(s => s.trim());
    
    // Группируем предложения по 1-2 штуки для плавной анимации
    for (let i = 0; i < sentences.length; i++) {
      const part = sentences[i];
      if (part.trim()) textParts.push(part);
    }
    
    // Если текст короткий, разбиваем по словам
    if (textParts.length <= 1 && fullMessage.length > 50) {
      const words = fullMessage.split(' ');
      textParts.length = 0;
      for (let i = 0; i < words.length; i += 3) {
        const wordGroup = words.slice(i, i + 3).join(' ');
        if (wordGroup.trim()) textParts.push(wordGroup);
      }
    }
    
    // Если текст очень короткий, показываем целиком
    if (textParts.length === 0) {
      textParts.push(fullMessage);
    }
    
    // Постепенно добавляем части текста
    for (let i = 0; i < textParts.length; i++) {
      const delay = i === 0 ? 300 : 800; // Первая часть быстрее, остальные медленнее
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      setAnimatedParts(prev => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), textParts[i]]
      }));
    }
    
    // 2. Дополнительная пауза перед показом карточек
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Теперь показываем карточки одну за другой
    if (responseData.cards && responseData.cards.length > 0) {
      for (let i = 0; i < responseData.cards.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600)); // Пауза между карточками
        
        // Добавляем карточку к сообщению
        setAiMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, cards: [...(msg.cards || []), responseData.cards[i]] }
            : msg
        ));
      }
    }
    
    setIsAnimating(false);
  };

  const hasUnsavedChanges = JSON.stringify(userData) !== JSON.stringify(editData);

  // Функция для анимированного показа сообщения ИИ по частям
  const animateAiMessage = async (fullMessage: string, suggestions?: string[]) => {
    setIsAnimating(true);
    
    // Улучшенный алгоритм разбиения сообщения на блоки
    const parts: string[] = [];
    
    // Сначала разбиваем по эмодзи-заголовкам
    const emojiSplit = fullMessage.split(/(?=🤗|😊|🧠|🎯|🍽️|🌅|🌙|🍎|💪|❤️|🚀|📊|💧)/);
    
    for (const section of emojiSplit) {
      if (section.trim().length === 0) continue;
      
      // Если секция содержит разделители, разбиваем по ним
      if (section.includes('––––––––––––––––––––')) {
        const subParts = section.split('––––––––––––––––––––').filter(p => p.trim());
        parts.push(...subParts);
      }
      // Если секция длинная (больше 200 символов), разбиваем по предложениям
      else if (section.length > 200) {
        const sentences = section.split(/(?<=[.!?])\s+/).filter(s => s.trim());
        // Группируем предложения по 2-3 штуки для более плавной анимации
        for (let i = 0; i < sentences.length; i += 2) {
          const group = sentences.slice(i, i + 2).join(' ');
          if (group.trim()) parts.push(group);
        }
      }
      // Иначе добавляем секцию целиком
      else {
        parts.push(section);
      }
    }
    
    // Создаем уникальный ID сообщения
    const messageId = generateUniqueId();
    const aiMessage: AiMessage = {
      id: messageId,
      type: 'ai',
      message: fullMessage, // Полное сообщение для хранения
      timestamp: new Date(),
      suggestions: suggestions || []
    };
    
    // Добавляем сообщение в список
    setAiMessages(prev => [...prev, aiMessage]);
    
    // Инициализируем анимированные части пустым массивом
    setAnimatedParts(prev => ({ ...prev, [messageId]: [] }));
    
    // Постепенно добавляем части с анимацией
    for (let i = 0; i < parts.length; i++) {
      // Варьируем задержку для более естественного ощущения
      const baseDelay = i === 0 ? 200 : 600;
      const randomDelay = Math.random() * 400 + baseDelay;
      
      await new Promise(resolve => setTimeout(resolve, randomDelay));
      
      setAnimatedParts(prev => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), parts[i]]
      }));
    }
    
    setIsAnimating(false);
  };

  return {
    // State
    isLoggedIn,
    isEditing,
    activeTab,
    userData,
    editData,
    aiMessages,
    newMessage,
    isAiTyping,
    isAnimating,
    animatedParts,
    hasUnsavedChanges,
    
    // Actions
    setIsEditing,
    setActiveTab,
    setUserData,
    setEditData,
    setNewMessage,
    handleSave,
    handleCancel,
    handleLogout,
    handleSuggestionClick,
    handleSendMessage
  };
}
