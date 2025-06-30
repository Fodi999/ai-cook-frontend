import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api/v1';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена аутентификации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Удаляем токен и перенаправляем на страницу входа
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Типы данных
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  height?: number;
  weight?: number;
  activity_level?: string;
  role: string;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  height?: number;
  weight?: number;
  activity_level?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface APIError {
  error: string;
  message: string;
  details?: any;
}

// API методы
export class APIClient {
  // Аутентификация
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }

  static async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
  }

  // Health check
  static async healthCheck(): Promise<string> {
    const response = await axios.get('http://localhost:3000/health');
    return response.data;
  }

  // Дневник питания
  static async getDiary(): Promise<any[]> {
    const response = await apiClient.get('/diary');
    return response.data;
  }

  // Холодильник
  static async getFridge(): Promise<any[]> {
    const response = await apiClient.get('/fridge');
    return response.data;
  }

  // Рецепты
  static async getRecipes(): Promise<any[]> {
    const response = await apiClient.get('/recipes');
    return response.data;
  }

  // Цели
  static async getGoals(): Promise<any[]> {
    const response = await apiClient.get('/goals');
    return response.data;
  }

  // Сообщество
  static async getCommunityPosts(): Promise<any[]> {
    const response = await apiClient.get('/community/posts');
    return response.data;
  }

  // WebSocket соединение
  static async getWebSocketStats(): Promise<any> {
    const response = await apiClient.get('/realtime/stats');
    return response.data;
  }

  // ИИ-помощник
  static async chatWithAi(message: string, context?: string): Promise<AiChatResponse> {
    const response = await apiClient.post('/ai/chat', {
      message,
      context
    });
    return response.data;
  }

  static async generateRecipe(ingredients: string[], options?: {
    dietary_restrictions?: string[],
    cuisine_type?: string,
    cooking_time?: number,
    difficulty?: string
  }): Promise<AiChatResponse> {
    const response = await apiClient.post('/ai/generate-recipe', {
      ingredients,
      ...options
    });
    return response.data;
  }

  static async analyzeNutrition(recipe_text: string, servings?: number): Promise<AiChatResponse> {
    const response = await apiClient.post('/ai/analyze-nutrition', {
      recipe_text,
      servings
    });
    return response.data;
  }
}

// Типы для ИИ API
export interface AiChatResponse {
  response: string;
  suggestions?: string[];
}

export default apiClient;
