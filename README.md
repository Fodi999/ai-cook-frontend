# IT Cook - Frontend

Фронтенд приложения IT Cook - кулинарная платформа с ИИ-помощником.

## 🚀 Быстрый старт

### Запуск фронтенда

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Запуск полного стека

1. **Запуск бекенда** (из корневой папки проекта):
   ```bash
   ./start-backend.sh
   ```
   Бекенд будет доступен на `http://localhost:3002`

2. **Запуск фронтенда** (из папки frontend):
   ```bash
   npm run dev
   ```
   Фронтенд будет доступен на `http://localhost:3000`

## 📁 Структура проекта

### Основные страницы
- **/** - Главная страница
- **/login** - Авторизация
- **/register** - Регистрация
- **/profile** - Профиль пользователя (модульная структура)
- **/recipes** - Рецепты
- **/community** - Сообщество
- **/analytics** - Аналитика

### Модульная архитектура

Страница профиля разделена на модульные компоненты с защитой от null/undefined:

```
src/components/profile/
├── ProfileHeader.tsx      # Заголовок с кнопками действий
├── QuickActions.tsx       # Быстрые действия
├── ProfileCard.tsx        # Карточка профиля (с loading состояниями)
├── ProfileTabs.tsx        # Табы навигации
├── PersonalInfoTab.tsx    # Личная информация (с проверками безопасности)
├── NutritionGoalsTab.tsx  # Цели питания (с проверками безопасности)
├── AnalyticsTab.tsx       # Аналитика
├── FridgeTab.tsx          # Холодильник
├── PostsTab.tsx           # Посты
├── SettingsTab.tsx        # Настройки
├── PrivacyTab.tsx         # Приватность
├── AiAssistantTab.tsx     # ИИ-помощник
├── types.ts               # TypeScript типы
├── useProfile.ts          # Хук состояния
└── index.ts               # Экспорты
```

### Безопасность и обработка ошибок

- ✅ Проверки на `null/undefined` данных
- ✅ Loading состояния для асинхронных операций
- ✅ Fallback UI для отсутствующих данных
- ✅ TypeScript типизация для предотвращения ошибок
- ✅ Безопасное обращение к вложенным свойствам (`?.`)

## 🛠 Технологии

- **Next.js 15** - React фреймворк с Turbopack
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Framer Motion** - Анимации
- **Lucide React** - Иконки
- **i18n** - Интернационализация

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_WS_URL=ws://localhost:3002
```

### API интеграция

- **REST API**: `http://localhost:3002/api/v1`
- **WebSocket**: `ws://localhost:3002/api/v1/realtime/ws`
- **Health Check**: `http://localhost:3002/health`

## 📚 Полезные ресурсы

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs)

## 🚀 Деплой

Самый простой способ деплоя - использовать [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Подробнее в [документации Next.js](https://nextjs.org/docs/app/building-your-application/deploying).
