'use client';

import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://itcook-backend-go-fodi999-8b0a955d.koyeb.app/api/v1';

export default function APITestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL.replace('/api/v1', '/health'));
      setResult(`✅ Health Check: ${response.data}`);
    } catch (error: any) {
      setResult(`❌ Health Check Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testRegisterEndpoint = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email: 'test@example.com',
        password: 'test123'
      });
      setResult(`✅ Register API: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setResult(`❌ Register API Error: ${error.message} - ${JSON.stringify(error.response?.data)}`);
    }
    setLoading(false);
  };

  const testLoginEndpoint = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'test123'
      });
      setResult(`✅ Login API: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setResult(`❌ Login API Error: ${error.message} - ${JSON.stringify(error.response?.data)}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 API Connection Test
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              <strong>API Base URL:</strong> {API_BASE_URL}
            </p>
            <p className="text-gray-600">
              <strong>Backend:</strong> Go + Gin на Koyeb
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <button
              onClick={testHealthCheck}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳ Testing...' : '🏥 Test Health Check'}
            </button>

            <button
              onClick={testRegisterEndpoint}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 ml-4"
            >
              {loading ? '⏳ Testing...' : '📝 Test Register API'}
            </button>

            <button
              onClick={testLoginEndpoint}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 ml-4"
            >
              {loading ? '⏳ Testing...' : '🔐 Test Login API'}
            </button>
          </div>

          {result && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Result:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              🔄 Migration Status
            </h3>
            <ul className="space-y-2 text-blue-700">
              <li>✅ Rust → Go бэкенд создан</li>
              <li>✅ Go бэкенд развернут на Koyeb</li>
              <li>✅ CORS настройки сконфигурированы</li>
              <li>✅ Фронтенд переключен на новый API</li>
              <li>🚧 Тестирование API endpoints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
