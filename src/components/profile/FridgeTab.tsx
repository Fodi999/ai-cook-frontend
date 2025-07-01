'use client';

import { Button } from '../ui/button';

export default function FridgeTab() {
  const fridgeItems = ['🥕 Морковь', '🥛 Молоко', '🥩 Мясо', '🧅 Лук', '🥔 Картофель', '🧀 Сыр'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Мой холодильник
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fridgeItems.map((item, index) => (
          <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
            <div className="text-2xl mb-2">{item.split(' ')[0]}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{item.split(' ')[1]}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button>Управлять продуктами</Button>
      </div>
    </div>
  );
}
