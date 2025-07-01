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
  TrendingUp,
  MessageCircle,
  Smile,
  Coffee,
  Sun,
  Star,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { Button } from './ui/button';
import { APIClient, PersonalizedResponse, HealthDashboard, WellbeingCheckRequest } from '../lib/api';

interface HealthMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  suggestions?: string[];
  recommendations?: any[];
  mood_detected?: string;
}

interface PersonalHealthAssistantProps {
  userData: any;
}

export default function PersonalHealthAssistant({ userData }: PersonalHealthAssistantProps) {
  const [messages, setMessages] = useState<HealthMessage[]>([
    {
      id: 1,
      type: 'ai',
      message: '🌟 Привет! Я ваш персональный помощник по здоровью и благополучию. Расскажите, как дела? Как ваше самочувствие сегодня?',
      timestamp: new Date(),
      suggestions: [
        'Как дела с настроением?',
        'Проверить состояние здоровья',
        'Нужны рекомендации по питанию',
        'Помочь с планом сна',
        'Анализ моих привычек'
      ]
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [healthDashboard, setHealthDashboard] = useState<HealthDashboard | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadHealthDashboard();
  }, []);

  const loadHealthDashboard = async () => {
    try {
      const dashboard = await APIClient.getHealthDashboard();
      setHealthDashboard(dashboard);
    } catch (error) {
      console.error('Ошибка загрузки дашборда здоровья:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: HealthMessage = {
      id: messages.length + 1,
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    try {
      const response = await APIClient.personalHealthChat(currentMessage, true);
      
      const aiMessage: HealthMessage = {
        id: messages.length + 2,
        type: 'ai',
        message: response.response,
        timestamp: new Date(),
        suggestions: response.suggestions,
        recommendations: response.recommendations,
        mood_detected: response.mood_detected
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Ошибка при обращении к ИИ:', error);
      
      const fallbackMessage: HealthMessage = {
        id: messages.length + 2,
        type: 'ai',
        message: 'Извините, произошла ошибка. Давайте попробуем по-другому. Расскажите мне о своём самочувствии сегодня?',
        timestamp: new Date(),
        suggestions: [
          'Как настроение?',
          'Уровень энергии',
          'Качество сна',
          'Состояние стресса'
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

  const handleQuickAction = async (action: string) => {
    setActiveQuickAction(action);
    
    const quickMessages = {
      mood: 'Как твоё настроение сегодня? Оцени от 1 до 10',
      energy: 'Какой у тебя уровень энергии? Чувствуешь усталость?',
      sleep: 'Как спал прошлой ночью? Сколько часов спал?',
      water: 'Сколько воды выпил сегодня? Не забываешь пить?',
      stress: 'Какой уровень стресса испытываешь сегодня?',
      nutrition: 'Как дела с питанием? Что ел сегодня?'
    };

    const message = quickMessages[action as keyof typeof quickMessages];
    if (message) {
      setNewMessage(message);
    }
  };

  const getMoodIcon = (mood?: string) => {
    const icons = {
      happy: <Smile className="w-4 h-4 text-yellow-500" />,
      excited: <Star className="w-4 h-4 text-orange-500" />,
      calm: <Moon className="w-4 h-4 text-blue-500" />,
      anxious: <AlertCircle className="w-4 h-4 text-red-500" />,
      tired: <Coffee className="w-4 h-4 text-gray-500" />,
      motivated: <Zap className="w-4 h-4 text-green-500" />
    };
    return icons[mood as keyof typeof icons] || <MessageCircle className="w-4 h-4" />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickActions = [
    { id: 'mood', label: 'Настроение', icon: Heart, color: 'bg-pink-100 text-pink-600' },
    { id: 'energy', label: 'Энергия', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'sleep', label: 'Сон', icon: Moon, color: 'bg-blue-100 text-blue-600' },
    { id: 'water', label: 'Вода', icon: Droplets, color: 'bg-cyan-100 text-cyan-600' },
    { id: 'stress', label: 'Стресс', icon: Activity, color: 'bg-red-100 text-red-600' },
    { id: 'nutrition', label: 'Питание', icon: Target, color: 'bg-green-100 text-green-600' }
  ];

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-blue-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Персональный помощник
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Заботится о вашем здоровье 24/7
            </p>
          </div>
        </div>
        
        {healthDashboard && (
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-gray-600 dark:text-gray-300">
              Прогресс отличный!
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="p-4 border-b border-blue-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Быстрая проверка состояния:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 hover:scale-105 ${action.color} ${
                  activeQuickAction === action.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <action.icon className="w-4 h-4 mb-1" />
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
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
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Персональный помощник
                    </span>
                    {message.mood_detected && getMoodIcon(message.mood_detected)}
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
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
      <div className="p-4 border-t border-blue-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-b-xl">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Расскажите о своём самочувствии..."
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
          <div className="flex items-center space-x-2">
            <Heart className="w-3 h-3 text-red-500" />
            <span>Забочусь о вашем здоровье</span>
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
