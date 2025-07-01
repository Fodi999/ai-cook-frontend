export interface AiCard {
  title: string;
  content: string;
  emoji?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: 'nutrition' | 'health' | 'recipe' | 'motivation' | 'general';
}

export interface AiMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  suggestions?: string[];
  cards?: AiCard[]; // Новое поле для карточек
  isProactive?: boolean; // Активное сообщение от ИИ
}

export interface NutritionGoals {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface UserStats {
  totalRecipes: number;
  followers: number;
  following: number;
  likesReceived: number;
  recipesShared: number;
  goalsAchieved: number;
  daysActive: number;
}

export interface UserSettings {
  profileVisibility: 'public' | 'private';
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface LocationContext {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  state?: string;
  street?: string;
  houseNumber?: string;
  postcode?: string;
  district?: string;
  fullAddress?: string;
}

export interface UserContext {
  timezone?: string;
  location?: LocationContext;
  onboarding_date?: string;
  onboarding_time?: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  bio: string;
  location: string;
  website: string;
  avatarUrl: string;
  memberSince: string;
  stats: UserStats;
  nutritionGoals: NutritionGoals;
  settings: UserSettings;
  context?: UserContext;
}
