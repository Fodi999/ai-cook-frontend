'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Heart, 
  Zap, 
  Moon, 
  Droplets, 
  Activity,
  ChefHat,
  Coffee,
  Utensils,
  Apple,
  Target,
  MessageCircle,
  Smile,
  AlertCircle,
  Star,
  Lightbulb,
  Clock,
  Refrigerator,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { APIClient } from '../lib/api';

interface UniversalMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  suggestions?: string[];
  category?: 'health' | 'cooking' | 'general';
  mood_detected?: string;
}

interface UniversalAIAssistantProps {
  userData: any;
}

export default function UniversalAIAssistant({ userData }: UniversalAIAssistantProps) {
  const [messages, setMessages] = useState<UniversalMessage[]>([
    {
      id: 1,
      type: 'ai',
      message: '🌟 Привет! Я ваш универсальный ИИ-помощник по кулинарии и здоровью! Могу помочь с рецептами, планированием питания, заботой о здоровье и общим благополучием. О чём хотите поговорить?',
      timestamp: new Date(),
      category: 'general',
      suggestions: [
        '🍳 Предложи рецепт на ужин',
        '💪 Как дела с настроением?', 
        '🥗 План питания на неделю',
        '💤 Помочь с качеством сна',
        '🧊 Что приготовить из холодильника?',
        '⚡ Проверить уровень энергии'
      ]
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'health' | 'cooking'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectMessageCategory = (message: string): 'health' | 'cooking' | 'general' => {
    const healthKeywords = ['настроение', 'сон', 'энергия', 'стресс', 'вода', 'здоровье', 'самочувствие', 'усталость', 'тревога'];
    const cookingKeywords = ['рецепт', 'готовить', 'еда', 'блюдо', 'ингредиент', 'кухня', 'плита', 'духовка', 'холодильник'];
    
    const lowerMessage = message.toLowerCase();
    
    if (healthKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'health';
    }
    if (cookingKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'cooking';
    }
    return 'general';
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const category = detectMessageCategory(newMessage);
    
    const userMessage: UniversalMessage = {
      id: messages.length + 1,
      type: 'user',
      message: newMessage,
      timestamp: new Date(),
      category
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    try {
      let response;
      
      // Выбираем API в зависимости от категории вопроса
      if (category === 'health') {
        response = await APIClient.personalHealthChat(currentMessage, true);
      } else {
        // Для кулинарных вопросов и общих используем обычный чат
        const userContext = `Пользователь: ${userData.firstName} ${userData.lastName}. 
          Цели питания: ${userData.nutritionGoals.dailyCalories} ккал/день, 
          ${userData.nutritionGoals.protein}г белка, ${userData.nutritionGoals.carbs}г углеводов, ${userData.nutritionGoals.fat}г жиров.
          Уровень активности: ${userData.activityLevel}. 
          Параметры: рост ${userData.height}см, вес ${userData.weight}кг.`;
        
        response = await APIClient.chatWithAi(currentMessage, userContext);
      }
      
      const aiMessage: UniversalMessage = {
        id: messages.length + 2,
        type: 'ai',
        message: response.response,
        timestamp: new Date(),
        category,
        suggestions: response.suggestions,
        mood_detected: (response as any).mood_detected
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Ошибка при обращении к ИИ:', error);
      
      const fallbackMessage: UniversalMessage = {
        id: messages.length + 2,
        type: 'ai',
        message: 'Извините, произошла ошибка. Попробуйте переформулировать вопрос или спросите о чём-то другом.',
        timestamp: new Date(),
        category: 'general',
        suggestions: [
          'Помощь с рецептами',
          'Анализ самочувствия',
          'Планирование питания',
          'Советы по здоровью'
        ]
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'health': return <Heart className="w-4 h-4 text-red-500" />;
      case 'cooking': return <ChefHat className="w-4 h-4 text-orange-500" />;
      default: return <Bot className="w-4 h-4 text-blue-500" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'health': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'cooking': return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20';
      default: return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickActions = [
    // Кулинарные действия
    { id: 'recipe', label: 'Рецепт', icon: ChefHat, category: 'cooking', message: 'Предложи рецепт на ужин из простых ингредиентов' },
    { id: 'fridge', label: 'Холодильник', icon: Refrigerator, category: 'cooking', message: 'Что приготовить из продуктов в моём холодильнике?' },
    { id: 'meal-plan', label: 'План питания', icon: Calendar, category: 'cooking', message: 'Составь план питания на неделю' },
    
    // Действия по здоровью
    { id: 'mood', label: 'Настроение', icon: Heart, category: 'health', message: 'Как дела с настроением? Хочу проверить своё самочувствие' },
    { id: 'energy', label: 'Энергия', icon: Zap, category: 'health', message: 'Чувствую упадок сил. Как повысить энергию?' },
    { id: 'sleep', label: 'Сон', icon: Moon, category: 'health', message: 'Проблемы со сном. Нужны советы для лучшего отдыха' },
  ];

  const filteredMessages = activeCategory === 'all' 
    ? messages 
    : messages.filter(msg => msg.category === activeCategory || msg.category === 'general');

  return (
    <div className="flex flex-col h-full max-h-[700px] bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex -space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <ChefHat className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Универсальный ИИ-помощник
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Кулинария • Здоровье • Благополучие
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-gray-600 dark:text-gray-300">Онлайн</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Все темы
          </button>
          <button
            onClick={() => setActiveCategory('cooking')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
              activeCategory === 'cooking' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Кулинария</span>
          </button>
          <button
            onClick={() => setActiveCategory('health')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
              activeCategory === 'health' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Здоровье</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white/20 dark:bg-gray-800/20">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Быстрые действия:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => setNewMessage(action.message)}
              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 hover:scale-105 border ${
                action.category === 'cooking' 
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'
                  : action.category === 'health'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
              }`}
            >
              <action.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {filteredMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-2">
                    {getCategoryIcon(message.category)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ИИ-помощник
                    </span>
                    {message.category && (
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(message.category)}`}>
                        {message.category === 'health' ? 'Здоровье' : message.category === 'cooking' ? 'Кулинария' : 'Общее'}
                      </span>
                    )}
                    {message.mood_detected && (
                      <Smile className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : `bg-white dark:bg-gray-700 text-gray-900 dark:text-white border ${
                        message.category === 'health' 
                          ? 'border-red-200 dark:border-red-800'
                          : message.category === 'cooking'
                          ? 'border-orange-200 dark:border-orange-800'
                          : 'border-gray-200 dark:border-gray-600'
                      }`
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.message}
                  </p>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs opacity-75">Предложения:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.type === 'ai' && (
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <div className="flex space-x-1">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${dot * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                анализирую...
              </span>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-b-xl">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Спросите о рецептах, здоровье, питании..."
              className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isTyping}
            />
            <Lightbulb className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ChefHat className="w-3 h-3 text-orange-500" />
              <span>Кулинария</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3 text-red-500" />
              <span>Здоровье</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bot className="w-3 h-3 text-blue-500" />
              <span>ИИ-помощь</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Онлайн</span>
          </div>
        </div>
      </div>
    </div>
  );
}
