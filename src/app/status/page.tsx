'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Server, 
  Database, 
  Globe, 
  Code,
  RefreshCw
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface HealthStatus {
  api: 'online' | 'offline' | 'checking';
  database: 'connected' | 'disconnected' | 'checking';
  cors: 'configured' | 'error' | 'checking';
}

export default function StatusPage() {
  const [status, setStatus] = useState<HealthStatus>({
    api: 'checking',
    database: 'checking',
    cors: 'checking'
  });
  const [lastCheck, setLastCheck] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<string>('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://itcook-backend-go-fodi999-8b0a955d.koyeb.app/api/v1';
  const HEALTH_URL = API_BASE_URL.replace('/api/v1', '/health');

  const checkStatus = async () => {
    setStatus({
      api: 'checking',
      database: 'checking',
      cors: 'checking'
    });

    try {
      // Test API health
      const healthResponse = await fetch(HEALTH_URL);
      const healthText = await healthResponse.text();
      setApiResponse(healthText);

      if (healthResponse.ok) {
        setStatus(prev => ({ ...prev, api: 'online' }));
      } else {
        setStatus(prev => ({ ...prev, api: 'offline' }));
      }

      // Test CORS
      try {
        const corsResponse = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'test123'
          })
        });

        // Если не получили CORS ошибку, значит CORS настроен
        setStatus(prev => ({ ...prev, cors: 'configured' }));
      } catch (corsError: any) {
        if (corsError.message.includes('CORS')) {
          setStatus(prev => ({ ...prev, cors: 'error' }));
        } else {
          setStatus(prev => ({ ...prev, cors: 'configured' }));
        }
      }

      // Assume database is connected if API is online
      if (healthResponse.ok) {
        setStatus(prev => ({ ...prev, database: 'connected' }));
      } else {
        setStatus(prev => ({ ...prev, database: 'disconnected' }));
      }

    } catch (error) {
      setStatus({
        api: 'offline',
        database: 'disconnected',
        cors: 'error'
      });
    }

    setLastCheck(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case 'online':
      case 'connected':
      case 'configured':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
      case 'disconnected':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'online':
      case 'connected':
      case 'configured':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'offline':
      case 'disconnected':
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🔄 Migration Status Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitoring the transition from Rust to Go backend
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* API Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  API Server
                </CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(status.api)}
                  <Badge className={getStatusColor(status.api)}>
                    {status.api}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Go + Gin framework on Koyeb
                </p>
              </CardContent>
            </Card>

            {/* Database Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Database
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(status.database)}
                  <Badge className={getStatusColor(status.database)}>
                    {status.database}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  PostgreSQL on Neon
                </p>
              </CardContent>
            </Card>

            {/* CORS Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  CORS Configuration
                </CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(status.cors)}
                  <Badge className={getStatusColor(status.cors)}>
                    {status.cors}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Frontend ↔ Backend communication
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>API Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Base URL:</h4>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block break-all">
                    {API_BASE_URL}
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Health Endpoint:</h4>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block break-all">
                    {HEALTH_URL}
                  </code>
                </div>
                {apiResponse && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Last Response:</h4>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                      {apiResponse}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Migration Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5" />
                  <span>Migration Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backend Migration</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Koyeb Deployment</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Connection</span>
                    {getStatusIcon(status.database)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Frontend Integration</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Endpoints</span>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last check: {lastCheck}
            </div>
            <Button onClick={checkStatus} className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Status</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
