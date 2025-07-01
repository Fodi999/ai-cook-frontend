'use client';

import { Button } from '../ui/button';
import { useT } from '../../hooks/useT';

import { UserData } from './types';

interface PrivacyTabProps {
  userData: UserData;
  onUserDataChange: (newData: UserData) => void;
  onLogout: () => void;
}

export default function PrivacyTab({ userData, onUserDataChange, onLogout }: PrivacyTabProps) {
  const t = useT();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {t('profile.privacy_settings')}
      </h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            {t('profile.profile_visibility')}
          </h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                checked={userData.settings.profileVisibility === 'public'}
                onChange={(e) => onUserDataChange({
                  ...userData,
                  settings: {...userData.settings, profileVisibility: e.target.value as 'public' | 'private'}
                })}
                className="text-blue-600"
              />
              <div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {t('profile.public_profile')}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ваш профиль виден всем пользователям
                </p>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                checked={userData.settings.profileVisibility === 'private'}
                onChange={(e) => onUserDataChange({
                  ...userData,
                  settings: {...userData.settings, profileVisibility: e.target.value as 'public' | 'private'}
                })}
                className="text-blue-600"
              />
              <div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {t('profile.private_profile')}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ваш профиль виден только подписчикам
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Выйти из аккаунта
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Завершить текущую сессию
                </p>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Выйти
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div>
                <h4 className="text-md font-medium text-red-900 dark:text-red-400">
                  {t('profile.delete_account')}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Это действие нельзя отменить
                </p>
              </div>
              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                {t('profile.delete_account')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
