// API Configuration для локальной разработки и продакшена
export interface APIConfig {
  name: string;
  baseURL: string;
  healthEndpoint: string;
  websocketURL?: string;
  description: string;
  isLocal: boolean;
}

// Конфигурации API
export const API_CONFIGS: Record<string, APIConfig> = {
  // Локальный Go Backend (для разработки)
  local_go: {
    name: 'Local Go Backend',
    baseURL: 'http://localhost:8080/api/v1',
    healthEndpoint: 'http://localhost:8080/health',
    websocketURL: 'ws://localhost:8080/api/v1/realtime/ws',
    description: 'Локальный Go бэкенд на порту 8080',
    isLocal: true
  },

  // Локальный Rust Backend (если есть)
  local_rust: {
    name: 'Local Rust Backend',
    baseURL: 'http://localhost:3002/api/v1',
    healthEndpoint: 'http://localhost:3002/health',
    websocketURL: 'ws://localhost:3002/api/v1/realtime/ws',
    description: 'Локальный Rust бэкенд на порту 3002',
    isLocal: true
  },

  // Production Go Backend на Koyeb
  production: {
    name: 'Production Koyeb',
    baseURL: 'https://itcook-backend-go-fodi999-8b0a955d.koyeb.app/api/v1',
    healthEndpoint: 'https://itcook-backend-go-fodi999-8b0a955d.koyeb.app/health',
    websocketURL: 'wss://itcook-backend-go-fodi999-8b0a955d.koyeb.app/api/v1/realtime/ws',
    description: 'Продакшен Go бэкенд на Koyeb',
    isLocal: false
  }
};

// Автоматическое определение API конфигурации
export function getDefaultAPIConfig(): APIConfig {
  // В development режиме пытаемся использовать локальный бэкенд
  if (process.env.NODE_ENV === 'development') {
    // Проверяем переменную среды для выбора локального API
    const localBackend = process.env.NEXT_PUBLIC_LOCAL_BACKEND || 'local_go';
    if (API_CONFIGS[localBackend]) {
      return API_CONFIGS[localBackend];
    }
  }

  // В production или если переменная NEXT_PUBLIC_USE_PRODUCTION установлена
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_USE_PRODUCTION === 'true') {
    return API_CONFIGS.production;
  }

  // Fallback на продакшен
  return API_CONFIGS.production;
}

// Получить конфигурацию по имени
export function getAPIConfig(configName?: string): APIConfig {
  if (configName && API_CONFIGS[configName]) {
    return API_CONFIGS[configName];
  }
  return getDefaultAPIConfig();
}

// Проверка доступности API
export async function checkAPIHealth(config: APIConfig): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(config.healthEndpoint, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn(`API ${config.name} недоступен:`, error);
    return false;
  }
}

// Автоматический выбор доступного API
export async function selectAvailableAPI(): Promise<APIConfig> {
  const defaultConfig = getDefaultAPIConfig();
  
  // Если это локальная разработка, проверяем доступность локального API
  if (process.env.NODE_ENV === 'development') {
    for (const [key, config] of Object.entries(API_CONFIGS)) {
      if (config.isLocal) {
        const isAvailable = await checkAPIHealth(config);
        if (isAvailable) {
          console.log(`🟢 Используем локальный API: ${config.name}`);
          return config;
        }
      }
    }
    
    console.log(`🟡 Локальные API недоступны, переключаемся на продакшен`);
  }

  // Fallback на продакшен
  return API_CONFIGS.production;
}

// Текущая конфигурация (будет установлена при инициализации)
let currentAPIConfig: APIConfig = getDefaultAPIConfig();

export function getCurrentAPIConfig(): APIConfig {
  return currentAPIConfig;
}

export function setCurrentAPIConfig(config: APIConfig): void {
  currentAPIConfig = config;
  console.log(`🔄 API конфигурация изменена на: ${config.name} (${config.baseURL})`);
}
