'use client';

import { Button } from '../../ui/button';
import { X, Save } from 'lucide-react';
import { FridgeItemInput } from '../../../lib/api/fridge';

interface FridgeAddFormProps {
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  newItem: FridgeItemInput;
  setNewItem: (item: FridgeItemInput) => void;
  handleAddItem: () => void;
}

export default function FridgeAddForm({
  showAddForm,
  setShowAddForm,
  newItem,
  setNewItem,
  handleAddItem
}: FridgeAddFormProps) {
  const resetForm = () => {
    setNewItem({
      name: '',
      brand: '',
      quantity: 1,
      unit: 'шт',
      category: '',
      location: 'Холодильник',
      price_per_unit: undefined,
      total_price: undefined,
      expiry_date: '',
      purchase_date: '',
      notes: '',
      ingredients: '',
      nutritional_info: '',
      contains_allergens: [],
      contains_intolerances: [],
      suitable_for_diets: []
    });
  };

  if (!showAddForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Добавить продукт</h3>
        <div className="space-y-4">
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название *</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Молоко, хлеб, курица..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Бренд</label>
              <input
                type="text"
                value={newItem.brand || ''}
                onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Данон, Простоквашино..."
              />
            </div>
          </div>

          {/* Количество и единицы */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Количество *</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                min="0.1"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Единица измерения *</label>
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="шт">штуки (шт)</option>
                <option value="г">граммы (г)</option>
                <option value="кг">килограммы (кг)</option>
                <option value="мл">миллилитры (мл)</option>
                <option value="л">литры (л)</option>
                <option value="упак">упаковка (упак)</option>
                <option value="буханка">буханка</option>
                <option value="пучок">пучок</option>
                <option value="долька">долька</option>
                <option value="ломтик">ломтик</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Категория *</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Выберите категорию</option>
                <option value="Dairy">Молочные продукты</option>
                <option value="Meat">Мясо</option>
                <option value="Fish">Рыба</option>
                <option value="Vegetables">Овощи</option>
                <option value="Fruits">Фрукты</option>
                <option value="Grains">Крупы</option>
                <option value="Beverages">Напитки</option>
                <option value="Condiments">Приправы</option>
                <option value="Snacks">Снеки</option>
                <option value="Other">Другое</option>
              </select>
            </div>
          </div>

          {/* Цены */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Цена за единицу (₽)</label>
              <input
                type="number"
                value={newItem.price_per_unit || ''}
                onChange={(e) => setNewItem({...newItem, price_per_unit: e.target.value ? Number(e.target.value) : undefined})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Цена за кг/л/шт"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Общая стоимость (₽)</label>
              <input
                type="number"
                value={newItem.total_price || ''}
                onChange={(e) => setNewItem({...newItem, total_price: e.target.value ? Number(e.target.value) : undefined})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Общая сумма покупки"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Даты */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Дата покупки</label>
              <input
                type="date"
                value={newItem.purchase_date || ''}
                onChange={(e) => setNewItem({...newItem, purchase_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Срок годности</label>
              <input
                type="date"
                value={newItem.expiry_date || ''}
                onChange={(e) => setNewItem({...newItem, expiry_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Место хранения */}
          <div>
            <label className="block text-sm font-medium mb-1">Место хранения</label>
            <select
              value={newItem.location || 'Холодильник'}
              onChange={(e) => setNewItem({...newItem, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Холодильник">Холодильник</option>
              <option value="Морозильник">Морозильник</option>
              <option value="Кладовая">Кладовая</option>
              <option value="Кухонная полка">Кухонная полка</option>
              <option value="Столешница">Столешница</option>
            </select>
          </div>

          {/* Дополнительная информация */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Состав</label>
              <textarea
                value={newItem.ingredients || ''}
                onChange={(e) => setNewItem({...newItem, ingredients: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Молоко, сахар, закваска..."
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Пищевая ценность</label>
              <textarea
                value={newItem.nutritional_info || ''}
                onChange={(e) => setNewItem({...newItem, nutritional_info: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Калории: 60 ккал, Белки: 3г, Жиры: 3.2г..."
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Заметки</label>
              <textarea
                value={newItem.notes || ''}
                onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Дополнительные заметки..."
                rows={2}
              />
            </div>
          </div>

          {/* Аллергены и диеты */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Аллергены</label>
              <input
                type="text"
                value={newItem.contains_allergens?.join(', ') || ''}
                onChange={(e) => setNewItem({...newItem, contains_allergens: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Глютен, лактоза, орехи (через запятую)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Подходящие диеты</label>
              <input
                type="text"
                value={newItem.suitable_for_diets?.join(', ') || ''}
                onChange={(e) => setNewItem({...newItem, suitable_for_diets: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Веган, кето, безглютеновая (через запятую)"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Отмена
            </Button>
            <Button
              onClick={handleAddItem}
              disabled={!newItem.name || !newItem.category}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Save className="h-4 w-4 mr-1" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
