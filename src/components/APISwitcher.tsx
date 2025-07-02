'use client';

import { useState, useEffect } from 'react';
import { Settings, Server, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { API_CONFIGS, type APIConfig, checkAPIHealth, getCurrentAPIConfig } from '../lib/apiConfig';
import { switchAPIConfig, getAPIConfig } from '../lib/api';

export default function APISwitcher() {
  const [currentConfig, setCurrentConfig] = useState<APIConfig>(getCurrentAPIConfig());
  const [apiStatuses, setApiStatuses] = useState<Record<string, boolean>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Показывать только в development режиме
  useEffect(() => {
    setIsVisible(process.env.NODE_ENV === 'development');
  }, []);

  // Проверка статуса всех API
  const checkAllAPIs = async () => {
    setIsChecking(true);
    const statuses: Record<string, boolean> = {};
    
    for (const [key, config] of Object.entries(API_CONFIGS)) {
      try {
        statuses[key] = await checkAPIHealth(config);
      } catch (error) {
        statuses[key] = false;
      }
    }
    
    setApiStatuses(statuses);
    setIsChecking(false);
  };

  // Переключение API
  const handleAPISwitch = async (configName: string) => {
    const success = await switchAPIConfig(configName);
    if (success) {
      setCurrentConfig(getAPIConfig());
    }
  };

  // Проверяем статусы при загрузке
  useEffect(() => {
    if (isVisible) {
      checkAllAPIs();
      setCurrentConfig(getAPIConfig());
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-2 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4" />
          API Switcher (Development)
          <Button
            variant="outline"
            size="sm"
            onClick={checkAllAPIs}
            disabled={isChecking}
            className="ml-auto"
          >
            <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Текущая конфигурация */}
        <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Текущий API:</span>
            <Badge variant={currentConfig.isLocal ? 'default' : 'secondary'}>
              {currentConfig.name}
            </Badge>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {currentConfig.baseURL}
          </div>
        </div>

        {/* Селектор API */}
        <div>
          <label className="text-sm font-medium mb-2 block">Переключить на:</label>
          <Select onValueChange={handleAPISwitch} value={currentConfig.name}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите API" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(API_CONFIGS).map(([key, config]: [string, APIConfig]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <Server className="h-3 w-3" />
                    <span>{config.name}</span>
                    {apiStatuses[key] !== undefined && (
                      apiStatuses[key] ? 
                        <Wifi className="h-3 w-3 text-green-500" /> : 
                        <WifiOff className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Статусы API */}
        <div className="space-y-1">
          <span className="text-sm font-medium">Статус API:</span>
          {Object.entries(API_CONFIGS).map(([key, config]: [string, APIConfig]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className={config.isLocal ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}>
                {config.description}
              </span>
              <div className="flex items-center gap-1">
                {isChecking ? (
                  <RefreshCw className="h-3 w-3 animate-spin text-gray-400" />
                ) : apiStatuses[key] !== undefined ? (
                  apiStatuses[key] ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Wifi className="h-2 w-2 mr-1" />
                      Online
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      <WifiOff className="h-2 w-2 mr-1" />
                      Offline
                    </Badge>
                  )
                ) : (
                  <Badge variant="outline" className="text-gray-400">
                    <span className="h-2 w-2 mr-1">?</span>
                    Unknown
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Подсказки */}
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
          💡 Запустите локальный Go бэкенд на порту 8080 для разработки
        </div>
      </CardContent>
    </Card>
  );
}
