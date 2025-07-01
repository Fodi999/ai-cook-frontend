# Обновлённый API умного холодильника

## 🆕 Новые возможности

### 📊 Расширенная информация о продуктах

Теперь каждый продукт включает:

- **Цена**: `price_per_unit` (цена за единицу) и `total_price` (общая стоимость)
- **Вес/объём**: точное количество в `граммах`, `килограммах`, `литрах` и т.д.
- **Срок годности**: `expiry_date` с автоматическим расчётом `days_until_expiry`
- **Дата покупки**: `purchase_date` для отслеживания свежести
- **Локация**: `location` (холодильник, морозильник, кладовая, кухонная полка)
- **Заметки**: `notes` для дополнительной информации
- **Состав**: `ingredients` и пищевая ценность `nutritional_info`
- **Диетические ограничения**: аллергены, непереносимости, подходящие диеты

### 🗑️ Управление пищевыми отходами

```typescript
// Добавить отходы
await fridgeApi.addWaste({
  original_item_id: "product-id",
  name: "Молоко",
  wasted_quantity: 0.5,
  unit: "л",
  category: "Dairy",
  waste_reason: "Expired", // Истёк срок годности
  wasted_value: 40.0,
  notes: "Забыл проверить срок годности"
});

// Получить историю отходов
const wasteHistory = await fridgeApi.getWasteHistory('month');
```

### 📈 Аналитика расходов

```typescript
// Получить аналитику за период
const analytics = await fridgeApi.getExpenseAnalytics('month');
// Возвращает:
// - total_purchased: общая сумма покупок
// - total_wasted: сумма выброшенных продуктов  
// - waste_percentage: процент отходов
// - savings_potential: потенциальная экономия
// - category_breakdown: разбивка по категориям
```

### 🏷️ Новые категории продуктов

```typescript
import { FRIDGE_CATEGORIES, getCategoryLabel } from '../lib/api/fridge';

// Доступные категории:
// Dairy, Meat, Fish, Vegetables, Fruits, Grains, 
// Beverages, Condiments, Snacks, Other

const label = getCategoryLabel('Dairy'); // "Молочные продукты"
```

### 📏 Единицы измерения

```typescript
import { UNITS, getUnitLabel } from '../lib/api/fridge';

// Поддерживаемые единицы:
// г, кг, мл, л, шт, упак, буханка, пучок, долька, ломтик

const label = getUnitLabel('кг'); // "килограммы"
```

### 🏠 Локации хранения

```typescript
import { STORAGE_LOCATIONS, getLocationLabel } from '../lib/api/fridge';

// Доступные локации:
// fridge, freezer, pantry, kitchen_shelf, countertop

const label = getLocationLabel('fridge'); // "Холодильник"
```

## 🎯 Использование в компонентах

```typescript
import { useFridge } from '../hooks/useFridge';
import { formatPrice, formatQuantity } from '../lib/api/fridge';

function FridgeComponent() {
  const {
    items,
    wasteHistory,
    expenseAnalytics,
    addItem,
    addWaste,
    loadExpenseAnalytics
  } = useFridge();

  // Добавить продукт с полными данными
  const addProduct = async () => {
    await addItem({
      name: "Молоко",
      brand: "Простоквашино",
      quantity: 1,
      unit: "л",
      category: "Dairy",
      price_per_unit: 80,
      total_price: 80,
      expiry_date: "2025-07-10T00:00:00Z",
      location: "fridge",
      notes: "Для завтрака",
      nutritional_info: "Белки: 3.2г, Жиры: 3.2г на 100мл"
    });
  };

  // Отметить отходы
  const markAsWaste = async (item) => {
    await addWaste({
      original_item_id: item.id,
      name: item.name,
      wasted_quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      waste_reason: "Expired",
      wasted_value: item.total_price
    });
  };

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.name} {item.brand}</h3>
          <p>Количество: {formatQuantity(item.quantity, item.unit)}</p>
          <p>Цена: {formatPrice(item.total_price || 0)}</p>
          <p>Истекает через: {item.days_until_expiry} дней</p>
          <p>Локация: {getLocationLabel(item.location || '')}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Миграция

Если у вас есть существующий код, добавьте опциональные поля постепенно:

```typescript
// Старый код будет работать
const item = {
  name: "Хлеб",
  quantity: 1,
  unit: "буханка", 
  category: "Grains"
};

// Новые поля добавляйте по необходимости
const enhancedItem = {
  ...item,
  price_per_unit: 40,
  total_price: 40,
  expiry_date: "2025-07-05T00:00:00Z",
  location: "kitchen_shelf",
  notes: "Для бутербродов"
};
```
