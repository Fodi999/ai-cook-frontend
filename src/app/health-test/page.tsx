'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { APIClient } from '../../lib/api';
import Navigation from '../../components/Navigation';

export default function HealthTest() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, result: any, error?: any) => {
    setResults(prev => [...prev, {
      test,
      result: error ? null : result,
      error: error?.message || error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testHealthDashboard = async () => {
    setLoading(true);
    try {
      const result = await APIClient.getHealthDashboard();
      addResult('Health Dashboard', result);
    } catch (error) {
      addResult('Health Dashboard', null, error);
    }
    setLoading(false);
  };

  const testHealthChat = async () => {
    setLoading(true);
    try {
      const result = await APIClient.personalHealthChat('Как дела?', true);
      addResult('Health Chat', result);
    } catch (error) {
      addResult('Health Chat', null, error);
    }
    setLoading(false);
  };

  const testRecommendations = async () => {
    setLoading(true);
    try {
      const result = await APIClient.getPersonalizedRecommendations();
      addResult('Recommendations', result);
    } catch (error) {
      addResult('Recommendations', null, error);
    }
    setLoading(false);
  };

  const testMoodAnalysis = async () => {
    setLoading(true);
    try {
      const result = await APIClient.analyzeMood('Я чувствую себя отлично сегодня!');
      addResult('Mood Analysis', result);
    } catch (error) {
      addResult('Mood Analysis', null, error);
    }
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🧪 Тестирование ИИ-помощника по здоровью
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Button 
                onClick={testHealthDashboard} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                📊 Dashboard
              </Button>
              
              <Button 
                onClick={testHealthChat} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                💬 Chat
              </Button>
              
              <Button 
                onClick={testRecommendations} 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                💡 Рекомендации
              </Button>
              
              <Button 
                onClick={testMoodAnalysis} 
                disabled={loading}
                className="bg-pink-600 hover:bg-pink-700"
              >
                😊 Настроение
              </Button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Результаты тестов ({results.length})
              </h2>
              <Button 
                onClick={clearResults} 
                variant="outline"
                size="sm"
              >
                Очистить
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Нажмите на кнопки выше, чтобы протестировать API
                </div>
              )}
              
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.error 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                      : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-medium ${
                      result.error 
                        ? 'text-red-900 dark:text-red-400' 
                        : 'text-green-900 dark:text-green-400'
                    }`}>
                      {result.error ? '❌' : '✅'} {result.test}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {result.timestamp}
                    </span>
                  </div>
                  
                  {result.error ? (
                    <div className="text-red-700 dark:text-red-300 text-sm">
                      <strong>Ошибка:</strong> {result.error}
                    </div>
                  ) : (
                    <div className="text-green-700 dark:text-green-300 text-sm">
                      <pre className="whitespace-pre-wrap text-xs bg-white dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                        {JSON.stringify(result.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {loading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-900 dark:text-white">Тестирование...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
