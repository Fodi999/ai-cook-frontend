'use client';

import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { FridgeItem } from '../../../lib/api/fridge';

type FridgeView = 'overview' | 'items' | 'expiring' | 'ai-insights' | 'quick-add' | 'analytics';

interface FridgeItemsListProps {
  fridgeItems: FridgeItem[];
  isLoading: boolean;
  error: string | null;
  setShowAddForm: (show: boolean) => void;
  setActiveView: (view: FridgeView) => void;
  handleDeleteItem: (id: string) => void;
  getDaysUntilExpiry: (expiryDate?: string) => number | null;
  getExpiryStatus: (days: number | null) => string;
  getCategoryIcon: (category: string) => string;
}

export default function FridgeItemsList({
  fridgeItems,
  isLoading,
  error,
  setShowAddForm,
  setActiveView,
  handleDeleteItem,
  getDaysUntilExpiry,
  getExpiryStatus,
  getCategoryIcon
}: FridgeItemsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Все продукты</h3>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowAddForm(true)} 
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Добавить
          </Button>
          <Button onClick={() => setActiveView('overview')} variant="outline" size="sm">
            Назад к обзору
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid gap-4">
          {fridgeItems.map((item) => {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date);
            const expiryStatus = getExpiryStatus(daysUntilExpiry);
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-xl md:text-2xl flex-shrink-0">{getCategoryIcon(item.category)}</div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                        {item.brand && <span className="text-sm text-gray-500 ml-2">({item.brand})</span>}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.quantity} {item.unit}
                        {item.location && <span className="ml-2">• {item.location}</span>}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {daysUntilExpiry !== null && (
                      <Badge 
                        variant={expiryStatus === 'good' ? 'secondary' : 'destructive'}
                        className={`text-xs ${
                          expiryStatus === 'critical' ? 'bg-red-100 text-red-800' :
                          expiryStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          expiryStatus === 'expired' ? 'bg-gray-100 text-gray-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {daysUntilExpiry <= 0 ? 'Просрочен' : 
                         daysUntilExpiry === 1 ? '1 день' : 
                         `${daysUntilExpiry} дн`}
                      </Badge>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 h-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Дополнительная информация о продукте */}
                <div className="mt-3 space-y-2">
                  {/* Цена и стоимость */}
                  {(item.price_per_unit || item.total_price || item.calculated_total_value) && (
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                      {item.price_per_unit && (
                        <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                          💰 {item.price_per_unit}₽/{item.unit}
                        </span>
                      )}
                      {item.calculated_total_value > 0 && (
                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                          💳 {item.calculated_total_value}₽ всего
                        </span>
                      )}
                    </div>
                  )}

                  {/* Даты покупки и срока годности */}
                  {(item.purchase_date || item.expiry_date) && (
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                      {item.purchase_date && (
                        <span className="bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 px-2 py-1 rounded">
                          📅 Куплено: {new Date(item.purchase_date).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                      {item.expiry_date && (
                        <span className={`px-2 py-1 rounded ${
                          item.is_expired 
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          ⏰ До: {new Date(item.expiry_date).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Заметки */}
                  {item.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 p-2 rounded">
                      📝 {item.notes}
                    </div>
                  )}

                  {/* Пищевая ценность */}
                  {item.nutritional_info && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      🍏 {item.nutritional_info}
                    </div>
                  )}

                  {/* Состав */}
                  {item.ingredients && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      🧪 Состав: {item.ingredients}
                    </div>
                  )}

                  {/* Аллергены и диеты */}
                  {((item.contains_allergens?.length || 0) > 0 || (item.suitable_for_diets?.length || 0) > 0 || (item.contains_intolerances?.length || 0) > 0) && (
                    <div className="flex flex-wrap gap-1">
                      {item.contains_allergens?.map((allergen, i) => (
                        <Badge key={`allergen-${i}`} variant="destructive" className="text-xs">
                          ⚠️ {allergen}
                        </Badge>
                      ))}
                      {item.contains_intolerances?.map((intolerance, i) => (
                        <Badge key={`intolerance-${i}`} variant="destructive" className="text-xs bg-orange-100 text-orange-800">
                          🚫 {intolerance}
                        </Badge>
                      ))}
                      {item.suitable_for_diets?.map((diet, i) => (
                        <Badge key={`diet-${i}`} variant="secondary" className="text-xs bg-green-100 text-green-800">
                          ✓ {diet}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
