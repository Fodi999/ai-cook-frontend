'use client';

import { motion } from 'framer-motion';
import { AiCard } from './types';

interface AiCardComponentProps {
  card: AiCard;
  index: number;
  messageId: number;
}

export default function AiCardComponent({ card, index, messageId }: AiCardComponentProps) {
  // Определяем цвета и иконки на основе категории
  const getCategoryStyle = (category?: string) => {
    switch (category) {
      case 'nutrition':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          text: 'text-green-700 dark:text-green-300',
          icon: '🥗'
        };
      case 'health':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-300',
          icon: '💪'
        };
      case 'recipe':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
          text: 'text-orange-700 dark:text-orange-300',
          icon: '🍳'
        };
      case 'motivation':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
          text: 'text-purple-700 dark:text-purple-300',
          icon: '🚀'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600',
          text: 'text-gray-700 dark:text-gray-300',
          icon: '💡'
        };
    }
  };

  // Определяем приоритет
  const getPriorityIndicator = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '';
    }
  };

  const style = getCategoryStyle(card.category);
  const priorityIcon = getPriorityIndicator(card.priority);

  return (
    <motion.div
      key={`ai-card-${messageId}-${index}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.1 
      }}
      className={`${style.bg} border ${style.bg.includes('border') ? '' : 'border-gray-200 dark:border-gray-600'} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">
            {card.emoji || style.icon}
          </span>
          <h3 className={`font-semibold text-sm ${style.text}`}>
            {card.title}
          </h3>
        </div>
        {priorityIcon && (
          <span className="text-xs" title={`Приоритет: ${card.priority}`}>
            {priorityIcon}
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {card.content}
      </p>
    </motion.div>
  );
}
