'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Bot, Send, Sparkles, Maximize2 } from 'lucide-react';
import FullscreenAiChat from './FullscreenAiChat';
import AiCardComponent from './AiCardComponent';

import { AiMessage } from './types';

interface AIAssistantTabProps {
  messages: AiMessage[];
  newMessage: string;
  isAiTyping: boolean;
  isAnimating: boolean;
  animatedParts: {[messageId: number]: string[]};
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onSuggestionClick: (suggestion: string) => void;
}

export default function AIAssistantTab({
  messages,
  newMessage,
  isAiTyping,
  isAnimating,
  animatedParts,
  onMessageChange,
  onSendMessage,
  onSuggestionClick
}: AIAssistantTabProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  
  const quickQuestions = [
    'План питания на день',
    'Здоровые завтраки', 
    'Быстрые рецепты на ужин',
    'Полезные перекусы'
  ];

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-full">
                <Bot className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">ИИ Кулинарный Помощник</h3>
                <p className="text-purple-100">Ваш персональный гид в мире кулинарии</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsFullscreenOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 flex items-center space-x-2 transition-all duration-200"
                title="Открыть в полноэкранном режиме"
              >
                <Maximize2 className="h-4 w-4" />
                <span className="text-sm font-medium">Полный экран</span>
              </Button>
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
          </div>
        </div>
      
      {/* Область сообщений */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
                  
                  {/* Анимированные части сообщения для ИИ */}
                  {msg.type === 'ai' && animatedParts[msg.id] ? (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {animatedParts[msg.id].map((part, index) => {
                          // Создаём уникальный ключ на основе содержимого части
                          const partHash = part.substring(0, 10).replace(/[^a-zA-Z0-9]/g, '');
                          const uniqueKey = `msg-${msg.id}-part-${index}-${partHash}`;
                          
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
                              className="text-sm whitespace-pre-wrap font-mono leading-relaxed"
                            >
                              {part}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap font-mono leading-relaxed">{msg.message}</p>
                  )}
                  
                  {/* Карточки от ИИ */}
                  {msg.type === 'ai' && msg.cards && msg.cards.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
                    >
                      {msg.cards.map((card, index) => (
                        <AiCardComponent
                          key={`card-${msg.id}-${index}`}
                          card={card}
                          index={index}
                          messageId={msg.id}
                        />
                      ))}
                    </motion.div>
                  )}
                  
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
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="flex flex-wrap gap-2 max-w-md"
                  >
                    {msg.suggestions.map((suggestion, index) => {
                      // Создаём уникальный ключ для кнопки предложения
                      const suggestionHash = suggestion.substring(0, 5).replace(/[^a-zA-Z0-9]/g, '');
                      const uniqueKey = `msg-${msg.id}-suggestion-${index}-${suggestionHash}`;
                      
                      return (
                        <motion.button
                          key={uniqueKey}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.2 }}
                          onClick={() => onSuggestionClick(suggestion)}
                          className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors border border-purple-200 dark:border-purple-800"
                        >
                          {suggestion}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isAiTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-purple-500" />
                <div className="flex space-x-1">
                  <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-purple-500 rounded-full"
                  />
                  <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                    className="w-2 h-2 bg-purple-500 rounded-full"
                  />
                  <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-purple-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Поле ввода */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Спросите что-нибудь о готовке, рецептах или питании..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button
            onClick={onSendMessage}
            disabled={!newMessage.trim() || isAiTyping || isAnimating}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Быстрые вопросы */}
        <div className="mt-4 flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onMessageChange(question)}
              className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Полноэкранный чат */}
    <FullscreenAiChat
      isOpen={isFullscreenOpen}
      onClose={() => setIsFullscreenOpen(false)}
      messages={messages}
      newMessage={newMessage}
      isAiTyping={isAiTyping}
      isAnimating={isAnimating}
      animatedParts={animatedParts}
      onMessageChange={onMessageChange}
      onSendMessage={onSendMessage}
      onSuggestionClick={onSuggestionClick}
    />
    </>
  );
}
