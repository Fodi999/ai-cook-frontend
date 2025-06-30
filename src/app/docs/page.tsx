'use client';

import { ChefHat, Code, Database, Zap, Shield, Users, Heart, ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Docs() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/health',
      description: 'Проверка состояния сервиса',
      example: `curl -X GET http://localhost:8080/api/health`,
      response: `{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "database": "connected"
}`
    },
    {
      method: 'POST',
      path: '/api/auth/register',
      description: 'Регистрация нового пользователя',
      example: `curl -X POST http://localhost:8080/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password"
  }'`,
      response: `{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}`
    },
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'Авторизация пользователя',
      example: `curl -X POST http://localhost:8080/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "secure_password"
  }'`,
      response: `{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}`
    },
    {
      method: 'GET',
      path: '/api/recipes',
      description: 'Получение списка рецептов',
      example: `curl -X GET http://localhost:8080/api/recipes \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
      response: `[
  {
    "id": 1,
    "title": "Паста Карбонара",
    "description": "Классическое итальянское блюдо",
    "ingredients": ["паста", "бекон", "яйца", "сыр"],
    "instructions": "...",
    "cooking_time": 30,
    "difficulty": "medium"
  }
]`
    },
    {
      method: 'POST',
      path: '/api/recipes',
      description: 'Создание нового рецепта',
      example: `curl -X POST http://localhost:3000/api/recipes \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Новый рецепт",
    "description": "Описание рецепта",
    "ingredients": ["ингредиент1", "ингредиент2"],
    "instructions": "Инструкции по приготовлению",
    "cooking_time": 45,
    "difficulty": "easy"
  }'`,
      response: `{
  "id": 2,
  "title": "Новый рецепт",
  "description": "Описание рецепта",
  "created_at": "2024-01-15T10:30:00Z"
}`
    },
    {
      method: 'GET',
      path: '/api/fridge',
      description: 'Получение содержимого холодильника',
      example: `curl -X GET http://localhost:3000/api/fridge \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
      response: `[
  {
    "id": 1,
    "product_name": "Молоко",
    "quantity": 1,
    "unit": "л",
    "expiry_date": "2024-01-20",
    "category": "dairy"
  }
]`
    }
  ];

  const models = [
    {
      name: 'User',
      fields: [
        { name: 'id', type: 'i32', description: 'Уникальный идентификатор' },
        { name: 'username', type: 'String', description: 'Имя пользователя' },
        { name: 'email', type: 'String', description: 'Email адрес' },
        { name: 'password_hash', type: 'String', description: 'Хэш пароля' },
        { name: 'created_at', type: 'DateTime', description: 'Дата создания' },
        { name: 'updated_at', type: 'DateTime', description: 'Дата обновления' }
      ]
    },
    {
      name: 'Recipe',
      fields: [
        { name: 'id', type: 'i32', description: 'Уникальный идентификатор' },
        { name: 'title', type: 'String', description: 'Название рецепта' },
        { name: 'description', type: 'String', description: 'Описание' },
        { name: 'ingredients', type: 'Vec<String>', description: 'Список ингредиентов' },
        { name: 'instructions', type: 'String', description: 'Инструкции' },
        { name: 'cooking_time', type: 'i32', description: 'Время приготовления (мин)' },
        { name: 'difficulty', type: 'String', description: 'Сложность (easy/medium/hard)' },
        { name: 'user_id', type: 'i32', description: 'ID автора' }
      ]
    },
    {
      name: 'FridgeItem',
      fields: [
        { name: 'id', type: 'i32', description: 'Уникальный идентификатор' },
        { name: 'product_name', type: 'String', description: 'Название продукта' },
        { name: 'quantity', type: 'f64', description: 'Количество' },
        { name: 'unit', type: 'String', description: 'Единица измерения' },
        { name: 'expiry_date', type: 'Option<DateTime>', description: 'Срок годности' },
        { name: 'category', type: 'String', description: 'Категория продукта' },
        { name: 'user_id', type: 'i32', description: 'ID владельца' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Назад</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IT Cook API</h1>
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  Документация
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Содержание</h3>
              <nav className="space-y-2">
                <a href="#quick-start" className="block text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Быстрый старт
                </a>
                <a href="#authentication" className="block text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Аутентификация
                </a>
                <a href="#endpoints" className="block text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  API Endpoints
                </a>
                <a href="#models" className="block text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Модели данных
                </a>
                <a href="#websocket" className="block text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  WebSocket
                </a>
                <a href="#errors" className="block text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  Коды ошибок
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Start */}
            <section id="quick-start" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-orange-500" />
                Быстрый старт
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                IT Cook Backend API предоставляет полный набор endpoints для создания кулинарного приложения.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Base URL</h4>
                <code className="text-orange-600 dark:text-orange-400">http://localhost:8080</code>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-orange-500" />
                Аутентификация
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                API использует JWT токены для аутентификации. Включите токен в заголовок Authorization:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <code className="text-sm">Authorization: Bearer YOUR_JWT_TOKEN</code>
              </div>
            </section>

            {/* API Endpoints */}
            <section id="endpoints" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Code className="h-6 w-6 mr-2 text-orange-500" />
                API Endpoints
              </h2>
              <div className="space-y-6">
                {endpoints.map((endpoint, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-gray-900 dark:text-white font-mono">{endpoint.path}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(endpoint.example, endpoint.path)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-orange-500 transition-colors"
                      >
                        {copiedEndpoint === endpoint.path ? 
                          <Check className="h-4 w-4" /> : 
                          <Copy className="h-4 w-4" />
                        }
                        <span className="text-xs">
                          {copiedEndpoint === endpoint.path ? 'Скопировано' : 'Копировать'}
                        </span>
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{endpoint.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Пример запроса:</h5>
                        <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                          <code>{endpoint.example}</code>
                        </pre>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Ответ:</h5>
                        <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                          <code>{endpoint.response}</code>
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Data Models */}
            <section id="models" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Database className="h-6 w-6 mr-2 text-orange-500" />
                Модели данных
              </h2>
              <div className="space-y-6">
                {models.map((model, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{model.name}</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-600">
                            <th className="text-left py-2 text-gray-900 dark:text-white">Поле</th>
                            <th className="text-left py-2 text-gray-900 dark:text-white">Тип</th>
                            <th className="text-left py-2 text-gray-900 dark:text-white">Описание</th>
                          </tr>
                        </thead>
                        <tbody>
                          {model.fields.map((field, fieldIndex) => (
                            <tr key={fieldIndex} className="border-b border-gray-100 dark:border-gray-700">
                              <td className="py-2 text-gray-900 dark:text-white font-mono text-sm">{field.name}</td>
                              <td className="py-2 text-orange-600 dark:text-orange-400 font-mono text-sm">{field.type}</td>
                              <td className="py-2 text-gray-600 dark:text-gray-300 text-sm">{field.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* WebSocket */}
            <section id="websocket" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-orange-500" />
                WebSocket
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Подключение к WebSocket для получения real-time уведомлений:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <code className="text-sm">ws://localhost:3000/ws</code>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">События:</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                <li><code>heartbeat</code> - проверка соединения</li>
                <li><code>community_update</code> - обновления в сообществе</li>
                <li><code>fridge_notification</code> - уведомления о холодильнике</li>
                <li><code>goal_progress</code> - прогресс по целям</li>
              </ul>
            </section>

            {/* Error Codes */}
            <section id="errors" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Коды ошибок
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-mono text-red-600">400</span>
                  <span className="text-gray-700 dark:text-gray-300">Bad Request - Неверный запрос</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-mono text-red-600">401</span>
                  <span className="text-gray-700 dark:text-gray-300">Unauthorized - Не авторизован</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-mono text-red-600">404</span>
                  <span className="text-gray-700 dark:text-gray-300">Not Found - Ресурс не найден</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-mono text-red-600">500</span>
                  <span className="text-gray-700 dark:text-gray-300">Internal Server Error - Внутренняя ошибка</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
