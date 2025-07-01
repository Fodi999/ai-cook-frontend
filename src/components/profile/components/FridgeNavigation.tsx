'use client';

import { Button } from '../../ui/button';
import { Refrigerator, Package, Zap, TrendingUp, Bot } from 'lucide-react';

type FridgeView = 'overview' | 'items' | 'expiring' | 'ai-insights' | 'quick-add' | 'analytics';

interface FridgeNavigationProps {
  activeView: FridgeView;
  setActiveView: (view: FridgeView) => void;
}

export default function FridgeNavigation({ activeView, setActiveView }: FridgeNavigationProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 md:p-6 text-white">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 md:p-3 bg-white/20 rounded-full">
            <Refrigerator className="h-6 w-6 md:h-8 md:w-8" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold">Умный Холодильник</h2>
            <p className="text-blue-100 text-sm md:text-base">Управляйте продуктами с помощью ИИ</p>
          </div>
        </div>
        
        {/* Десктопная навигация */}
        <div className="hidden md:flex items-center space-x-2 flex-wrap">
          <Button
            variant={activeView === 'overview' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('overview')}
            className="text-white border-white/30"
          >
            Обзор
          </Button>
          <Button
            variant={activeView === 'items' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('items')}
            className="text-white border-white/30"
          >
            Продукты
          </Button>
          <Button
            variant={activeView === 'quick-add' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('quick-add')}
            className="text-white border-white/30"
          >
            <Zap className="h-4 w-4 mr-1" />
            Быстро
          </Button>
          <Button
            variant={activeView === 'analytics' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('analytics')}
            className="text-white border-white/30"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Аналитика
          </Button>
          <Button
            variant={activeView === 'ai-insights' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('ai-insights')}
            className="text-white border-white/30"
          >
            <Bot className="h-4 w-4 mr-1" />
            ИИ анализ
          </Button>
        </div>
      </div>
      
      {/* Мобильная горизонтальная навигация */}
      <div className="md:hidden mt-4 overflow-x-auto">
        <div className="flex space-x-2 pb-2 min-w-max">
          <Button
            variant={activeView === 'overview' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('overview')}
            className="text-white border-white/30 whitespace-nowrap"
          >
            <Package className="h-4 w-4 mr-1.5" />
            Обзор
          </Button>
          <Button
            variant={activeView === 'items' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('items')}
            className="text-white border-white/30 whitespace-nowrap"
          >
            <Refrigerator className="h-4 w-4 mr-1.5" />
            Продукты
          </Button>
          <Button
            variant={activeView === 'quick-add' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('quick-add')}
            className="text-white border-white/30 whitespace-nowrap"
          >
            <Zap className="h-4 w-4 mr-1.5" />
            Быстро
          </Button>
          <Button
            variant={activeView === 'analytics' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('analytics')}
            className="text-white border-white/30 whitespace-nowrap"
          >
            <TrendingUp className="h-4 w-4 mr-1.5" />
            Аналитика
          </Button>
          <Button
            variant={activeView === 'ai-insights' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('ai-insights')}
            className="text-white border-white/30 whitespace-nowrap"
          >
            <Bot className="h-4 w-4 mr-1.5" />
            ИИ анализ
          </Button>
        </div>
      </div>
    </div>
  );
}
