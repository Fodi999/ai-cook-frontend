'use client';

import { Button } from '../ui/button';
import { User, Target, Bot, Activity, ChefHat, Users, Settings } from 'lucide-react';

interface QuickActionsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function QuickActions({ activeTab, onTabChange }: QuickActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex overflow-x-auto space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTabChange('profile')}
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
            onClick={() => onTabChange('goals')}
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
            onClick={() => onTabChange('ai')}
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
            onClick={() => onTabChange('analytics')}
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
            onClick={() => onTabChange('fridge')}
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
            onClick={() => onTabChange('posts')}
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
  );
}
