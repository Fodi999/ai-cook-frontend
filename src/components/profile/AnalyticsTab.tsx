'use client';

import { Button } from '../ui/button';

export default function AnalyticsTab() {
  return (
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
  );
}
