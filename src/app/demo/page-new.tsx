'use client';

import { useState, useEffect } from 'react';
import { ChefHat, Play, ArrowLeft, Loader2, CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useT } from '../../hooks/useT';
import Navigation from '../../components/Navigation';

export default function Demo() {
  const [apiUrl, setApiUrl] = useState('http://localhost:3000');
  const [isConnected, setIsConnected] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{[key: string]: any}>({});
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsMessages, setWsMessages] = useState<string[]>([]);
  const t = useT();

  // Test API connection
  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/health`);
      const data = await response.json();
      
      if (response.ok) {
        setIsConnected(true);
        setResults(prev => ({...prev, health: data}));
        toast.success('Подключение к API успешно!');
      } else {
        throw new Error('API недоступен');
      }
    } catch (error) {
      setIsConnected(false);
      toast.error('Ошибка подключения к API');
    } finally {
      setLoading(false);
    }
  };

  // Test endpoints
  const testEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(true);
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();
      
      if (response.ok) {
        setResults(prev => ({...prev, [endpoint]: data}));
        toast.success(`${method} ${endpoint} - успешно!`);
        
        // If it's a login, save the token
        if (endpoint === '/api/v1/auth/login' && data.access_token) {
          setAuthToken(data.access_token);
        }
      } else {
        throw new Error(data.error || 'Ошибка API');
      }
    } catch (error: any) {
      toast.error(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // WebSocket connection
  const connectWebSocket = () => {
    try {
      const websocket = new WebSocket(`ws://localhost:3000/api/v1/realtime/ws`);
      
      websocket.onopen = () => {
        setWsConnected(true);
        setWs(websocket);
        toast.success('WebSocket подключен!');
        
        // Send heartbeat
        websocket.send(JSON.stringify({type: 'heartbeat'}));
      };

      websocket.onmessage = (event) => {
        const message = event.data;
        setWsMessages(prev => [message, ...prev.slice(0, 9)]);
      };

      websocket.onclose = () => {
        setWsConnected(false);
        setWs(null);
        toast.error('WebSocket отключен');
      };

      websocket.onerror = () => {
        toast.error('Ошибка WebSocket');
      };
    } catch (error) {
      toast.error('Не удалось подключиться к WebSocket');
    }
  };

  const disconnectWebSocket = () => {
    if (ws) {
      ws.close();
    }
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const endpoints = [
    {
      name: 'Health Check',
      method: 'GET',
      path: '/health',
      description: 'Проверка состояния сервиса',
      needsAuth: false
    },
    {
      name: t('navigation.register'),
      method: 'POST',
      path: '/api/v1/auth/register',
      description: t('demo.register_desc'),
      needsAuth: false,
      body: {
        username: 'demo_user',
        email: 'demo@example.com',
        password: 'demo_password'
      }
    },
    {
      name: t('navigation.login'),
      method: 'POST',
      path: '/api/v1/auth/login',
      description: t('demo.login_desc'),
      needsAuth: false,
      body: {
        email: 'demo@example.com',
        password: 'demo_password'
      }
    },
    {
      name: t('navigation.recipes'),
      method: 'GET',
      path: '/api/v1/recipes',
      description: t('demo.recipes_desc'),
      needsAuth: true
    },
    {
      name: t('navigation.fridge'),
      method: 'GET',
      path: '/api/v1/fridge',
      description: t('demo.fridge_desc'),
      needsAuth: true
    },
    {
      name: t('navigation.goals'),
      method: 'GET',
      path: '/api/v1/goals',
      description: t('demo.goals_desc'),
      needsAuth: true
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <ChefHat className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('demo.title')}</h1>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    {t('demo.subtitle')}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {isConnected ? t('demo.connected') : t('demo.disconnected')}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* API Connection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('demo.api_settings')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('demo.server_url')}
                    </label>
                    <input
                      type="text"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="http://localhost:3000"
                    />
                  </div>
                  <button
                    onClick={testConnection}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    <span>{t('demo.test_connection')}</span>
                  </button>
                </div>
              </div>

              {/* Auth Token */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('demo.auth_token')}</h3>
                <div className="space-y-4">
                  <textarea
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs"
                    rows={4}
                    placeholder="JWT токен (автоматически заполнится после входа)"
                  />
                  <div className="text-xs text-gray-500">
                    Токен будет автоматически установлен при успешном входе
                  </div>
                </div>
              </div>

              {/* WebSocket */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  {wsConnected ? <Wifi className="h-5 w-5 mr-2 text-green-500" /> : <WifiOff className="h-5 w-5 mr-2 text-red-500" />}
                  {t('demo.websocket')}
                </h3>
                <div className="space-y-4">
                  <button
                    onClick={wsConnected ? disconnectWebSocket : connectWebSocket}
                    className={`w-full px-4 py-2 rounded-lg transition-colors ${
                      wsConnected 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {wsConnected ? t('demo.disconnect') : t('demo.connect')}
                  </button>
                  {wsMessages.length > 0 && (
                    <div className="max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded p-2">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{t('demo.messages')}:</div>
                      {wsMessages.map((msg, i) => (
                        <div key={i} className="text-xs text-gray-800 dark:text-gray-200 font-mono bg-gray-50 dark:bg-gray-700 p-1 rounded mb-1">
                          {msg}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Endpoints Testing */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-6">{t('demo.endpoints_testing')}</h3>
                <div className="space-y-4">
                  {endpoints.map((endpoint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-gray-900 dark:text-white font-mono text-sm">{endpoint.path}</code>
                          {endpoint.needsAuth && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                              {t('demo.auth_required')}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => testEndpoint(endpoint.path, endpoint.method, endpoint.body)}
                          disabled={loading || (endpoint.needsAuth && !authToken)}
                          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                        >
                          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                          <span>{t('demo.test')}</span>
                        </button>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{endpoint.description}</p>
                      
                      {endpoint.body && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">Request Body:</div>
                          <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(endpoint.body, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {results[endpoint.path] && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Response:</div>
                          <pre className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(results[endpoint.path], null, 2)}
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
