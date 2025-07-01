'use client';

import { Edit2, Check, X } from 'lucide-react';
import { useT } from '../../hooks/useT';

import { UserData } from './types';

interface NutritionGoalsTabProps {
  userData: UserData | null;
  editData: UserData | null;
  isEditing: boolean;
  onEditDataChange: (newData: UserData) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export default function NutritionGoalsTab({ 
  userData, 
  editData, 
  isEditing, 
  onEditDataChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit
}: NutritionGoalsTabProps) {
  const t = useT();

  // Проверяем, что данные загружены
  if (!userData || !editData || !userData.nutritionGoals || !editData.nutritionGoals) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-20 bg-gray-300 rounded"></div>
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('profile.nutrition_goals')}
        </h3>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={onSaveEdit}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Check className="h-4 w-4 mr-1" />
                Сохранить
              </button>
              <button
                onClick={onCancelEdit}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Отмена
              </button>
            </>
          ) : (
            <button
              onClick={onStartEdit}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Редактировать
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.daily_calorie_goal')} ({t('profile.kcal')})
          </label>
          {isEditing ? (
            <input
              type="number"
              value={editData?.nutritionGoals?.dailyCalories || ''}
              onChange={(e) => onEditDataChange({
                ...editData, 
                nutritionGoals: {...editData.nutritionGoals, dailyCalories: parseInt(e.target.value)}
              })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {userData.nutritionGoals.dailyCalories} {t('profile.kcal')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.protein_goal')} ({t('profile.g')})
          </label>
          {isEditing ? (
            <input
              type="number"
              value={editData?.nutritionGoals?.protein || ''}
              onChange={(e) => onEditDataChange({
                ...editData, 
                nutritionGoals: {...editData.nutritionGoals, protein: parseInt(e.target.value)}
              })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {userData.nutritionGoals.protein} {t('profile.g')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.carbs_goal')} ({t('profile.g')})
          </label>
          {isEditing ? (
            <input
              type="number"
              value={editData?.nutritionGoals?.carbs || ''}
              onChange={(e) => onEditDataChange({
                ...editData, 
                nutritionGoals: {...editData.nutritionGoals, carbs: parseInt(e.target.value)}
              })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {userData.nutritionGoals.carbs} {t('profile.g')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.fat_goal')} ({t('profile.g')})
          </label>
          {isEditing ? (
            <input
              type="number"
              value={editData?.nutritionGoals?.fat || ''}
              onChange={(e) => onEditDataChange({
                ...editData, 
                nutritionGoals: {...editData.nutritionGoals, fat: parseInt(e.target.value)}
              })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {userData.nutritionGoals.fat} {t('profile.g')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.water_goal')} ({t('analytics.glasses')})
          </label>
          {isEditing ? (
            <input
              type="number"
              value={editData?.nutritionGoals?.water || ''}
              onChange={(e) => onEditDataChange({
                ...editData, 
                nutritionGoals: {...editData.nutritionGoals, water: parseInt(e.target.value)}
              })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {userData.nutritionGoals.water} {t('analytics.glasses')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
