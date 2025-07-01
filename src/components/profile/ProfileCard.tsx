'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Globe, Camera, ChefHat, Users, Heart, Target } from 'lucide-react';
import { useT } from '../../hooks/useT';

import { UserData } from './types';

interface ProfileCardProps {
  userData: UserData | null;
  isEditing: boolean;
}

export default function ProfileCard({ userData, isEditing }: ProfileCardProps) {
  const t = useT();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  // Проверяем, что userData и необходимые поля существуют
  if (!userData || !userData.firstName || !userData.lastName) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto"></div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
    >
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userData.firstName[0]?.toUpperCase()}{userData.lastName[0]?.toUpperCase()}
          </div>
          {isEditing && (
            <button className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          )}
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {userData.firstName} {userData.lastName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">@{userData.username}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('profile.member_since')} {formatDate(userData.memberSince)}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
          <Mail className="h-4 w-4" />
          <span className="text-sm">{userData.email}</span>
        </div>
        {userData.location && (
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{userData.location}</span>
          </div>
        )}
        {userData.website && (
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <Globe className="h-4 w-4" />
            <span className="text-sm">{userData.website}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ChefHat className="h-4 w-4 text-orange-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {userData.stats?.totalRecipes || 0}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('profile.total_recipes')}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {userData.stats?.followers || 0}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('profile.followers')}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {userData.stats?.likesReceived || 0}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('profile.likes_received')}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {userData.stats?.goalsAchieved || 0}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('profile.goals_achieved')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
