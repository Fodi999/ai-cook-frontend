'use client';

import { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Bot, Send, Sparkles, X, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AiCardComponent from './AiCardComponent';

import { AiMessage } from './types';

interface FullscreenAiChatProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AiMessage[];
  newMessage: string;
  isAiTyping: boolean;
  isAnimating: boolean;
  animatedParts: {[messageId: number]: string[]};
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onSuggestionClick: (suggestion: string) => void;
}

export default function FullscreenAiChat({
  isOpen,
  onClose,
  messages,
  newMessage,
  isAiTyping,
  isAnimating,
  animatedParts,
  onMessageChange,
  onSendMessage,
  onSuggestionClick
}: FullscreenAiChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = [
    'План питания на день',
    'Здоровые завтраки',
    'Быстрые рецепты на ужин', 
    'Полезные перекусы',
    'Как считать КБЖУ?',
    'Рецепты для набора массы',
    'ПП-ужины для похудения',
    'Перекусы для спортсменов'
  ];

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Фокус на поле ввода при открытии
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = () => {
    if (newMessage.trim() && !isAiTyping && !isAnimating) {
      onSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
          className="absolute inset-4 md:inset-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Bot className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">ИИ Кулинарный Помощник</h2>
                  <p className="text-purple-100 text-sm">Ваш персональный гид в мире кулинарии</p>
                </div>
                <div className="hidden md:block">
                  <Sparkles className="h-8 w-8 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  <Minimize2 className="h-5 w-5" />
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Область сообщений */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-800">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl space-y-3`}>
                  <div
                    className={`px-6 py-4 rounded-3xl shadow-sm ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white ml-auto'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {msg.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-3">
                        <Bot className="h-5 w-5 text-purple-500" />
                        <span className="text-sm font-medium text-purple-500">ИИ Помощник</span>
                      </div>
                    )}
                    
                    {/* Анимированные части сообщения для ИИ */}
                    {msg.type === 'ai' && animatedParts[msg.id] ? (
                      <div className="space-y-3">
                        <AnimatePresence>
                          {animatedParts[msg.id].map((part, index) => {
                            // Создаём уникальный ключ на основе содержимого части
                            const partHash = part.substring(0, 10).replace(/[^a-zA-Z0-9]/g, '');
                            const uniqueKey = `fullscreen-msg-${msg.id}-part-${index}-${partHash}`;
                            
                            return (
                              <motion.div
                                key={uniqueKey}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ 
                                  duration: 0.5,
                                  ease: "easeOut",
                                  delay: index * 0.1 
                                }}
                                className="whitespace-pre-wrap leading-relaxed font-mono text-sm"
                              >
                                {part}
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed font-mono text-sm">{msg.message}</p>
                    )}
                    
                    <p className={`text-xs mt-2 ${
                      msg.type === 'user' ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('ru-RU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  {/* Карточки от ИИ */}
                  {msg.type === 'ai' && msg.cards && msg.cards.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 max-w-4xl"
                    >
                      {msg.cards.map((card, index) => (
                        <AiCardComponent
                          key={`fullscreen-card-${msg.id}-${index}`}
                          card={card}
                          index={index}
                          messageId={msg.id}
                        />
                      ))}
                    </motion.div>
                  )}
                  
                  {/* Предложения от ИИ */}
                  {msg.type === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestions.map((suggestion, index) => {
                        // Создаём уникальный ключ для кнопки предложения
                        const suggestionHash = suggestion.substring(0, 5).replace(/[^a-zA-Z0-9]/g, '');
                        const uniqueKey = `fullscreen-msg-${msg.id}-suggestion-${index}-${suggestionHash}`;
                        
                        return (
                          <motion.button
                            key={uniqueKey}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSuggestionClick(suggestion)}
                            className="px-4 py-2 text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-all duration-200 border border-purple-200 dark:border-purple-800 hover:scale-105"
                          >
                            {suggestion}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isAiTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white dark:bg-gray-700 px-6 py-4 rounded-3xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Печатает</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Поле ввода */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
            <div className="flex space-x-4 mb-4">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => onMessageChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Спросите что-нибудь о готовке, рецептах или питании..."
                className="flex-1 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isAiTyping || isAnimating}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Быстрые вопросы */}
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onMessageChange(question)}
                  className="px-4 py-2 text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-all duration-200 hover:scale-105"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
