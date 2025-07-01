import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://itcook-backend-go-fodi999-8b0a955d.koyeb.app/api/v1';

console.log('🔧 [API] API Base URL:', API_BASE_URL);

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
    console.log('📤 [API] Исходящий запрос:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers
    });
    
    const token = localStorage.getItem('token');
    console.log('🔑 [API] Токен для запроса:', token ? `Есть (${token.substring(0, 20)}...)` : 'Отсутствует');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [API] Токен добавлен в заголовки');
    } else {
      console.log('⚠️ [API] Токен отсутствует, запрос без авторизации');
    }
    return config;
  },
  (error) => {
    console.error('❌ [API] Ошибка в запросе:', error);
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 [API] Успешный ответ:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ [API] Ошибка в ответе:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('🔐 [API] Получена ошибка 401, очищаем токен и перенаправляем');
      localStorage.removeItem('token');
      window.location.href = '/login';
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
    console.log('👤 [API] Запрос данных текущего пользователя...');
    try {
      const response = await apiClient.get('/auth/me');
      console.log('✅ [API] Данные пользователя получены:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [API] Ошибка получения данных пользователя:', error);
      throw error;
    }
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

  // Персональный помощник по здоровью
  static async personalHealthChat(message: string, includeHealthContext: boolean = true): Promise<PersonalizedResponse> {
    const response = await apiClient.post('/health/chat', {
      message,
      include_health_context: includeHealthContext
    });
    return response.data;
  }

  static async submitWellbeingCheck(data: WellbeingCheckRequest): Promise<HealthDashboard> {
    const response = await apiClient.post('/health/wellbeing', data);
    return response.data;
  }

  static async getHealthDashboard(): Promise<HealthDashboard> {
    const response = await apiClient.get('/health/dashboard');
    return response.data;
  }

  static async getPersonalizedRecommendations(): Promise<PersonalizedRecommendation[]> {
    const response = await apiClient.get('/health/recommendations');
    return response.data;
  }

  static async analyzeMood(message: string): Promise<MoodAnalysis> {
    const response = await apiClient.post('/health/mood-analysis', {
      message
    });
    return response.data;
  }

  // Активное сообщение от ИИ
  static async getProactiveMessage(context?: {
    user_context?: string,
    last_activity?: string,
    current_time?: string
  }): Promise<AiProactiveMessage> {
    const response = await apiClient.post('/ai/proactive-message', context || {});
    return response.data;
  }
}

// Типы для ИИ API
export interface AiChatResponse {
  response: string;
  suggestions?: string[];
  cards?: Array<{
    title: string;
    content: string;
    emoji?: string;
    priority?: 'low' | 'medium' | 'high';
    category?: 'nutrition' | 'health' | 'recipe' | 'motivation' | 'general';
  }>;
}

export interface AiProactiveMessage {
  message: string;
  trigger_type: 'breakfast' | 'sleep' | 'mood' | 'activity' | 'nutrition' | 'motivation';
  urgency: 'low' | 'medium' | 'high';
  cards?: Array<{
    title: string;
    content: string;
    emoji?: string;
    priority?: 'low' | 'medium' | 'high';
    category?: 'nutrition' | 'health' | 'recipe' | 'motivation' | 'general';
  }>;
  suggestions?: string[];
}

// Типы для персонального помощника по здоровью
export interface PersonalizedResponse {
  response: string;
  mood_detected?: MoodType;
  suggestions?: string[];
  recommendations?: PersonalizedRecommendation[];
  follow_up_questions?: string[];
}

export interface WellbeingCheckRequest {
  mood_score?: number;
  energy_level?: number;
  stress_level?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  water_intake_ml?: number;
  exercise_minutes?: number;
  notes?: string;
  symptoms?: string[];
}

export interface HealthDashboard {
  current_wellbeing?: DailyWellbeing;
  insights: HealthInsight[];
  recommendations: PersonalizedRecommendation[];
  weekly_trends: WeeklyTrends;
  motivational_message: string;
}

export interface DailyWellbeing {
  id: string;
  user_id: string;
  date: string;
  mood_score?: number;
  energy_level?: number;
  stress_level?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  water_intake_ml?: number;
  exercise_minutes?: number;
  notes?: string;
  symptoms: string[];
  created_at: string;
}

export interface HealthInsight {
  id: string;
  user_id: string;
  insight_type: InsightType;
  title: string;
  description: string;
  severity: SeverityLevel;
  data_points: Record<string, any>;
  recommendations: string[];
  created_at: string;
}

export interface PersonalizedRecommendation {
  id: string;
  user_id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  priority: Priority;
  action_steps: string[];
  estimated_impact: string;
  frequency?: string;
  duration_days?: number;
  personalization_factors: string[];
  is_active: boolean;
  created_at: string;
}

export interface WeeklyTrends {
  avg_mood: number;
  avg_energy: number;
  avg_stress: number;
  avg_sleep: number;
  total_water_ml: number;
  total_exercise_minutes: number;
}

export interface MoodAnalysis {
  detected_mood: MoodType;
  confidence: number;
  emotional_indicators: string[];
  suggestions: string[];
  follow_up_questions: string[];
}

// Enums
export type MoodType = 'happy' | 'sad' | 'excited' | 'anxious' | 'calm' | 'frustrated' | 'motivated' | 'tired' | 'neutral';
export type InsightType = 'pattern' | 'correlation' | 'trend' | 'anomaly' | 'achievement' | 'concern';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type RecommendationCategory = 'nutrition' | 'exercise' | 'sleep' | 'stress_management' | 'hydration' | 'mental_health' | 'general';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export default apiClient;
