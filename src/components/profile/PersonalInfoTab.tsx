'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Check, X, MapPin, RefreshCw } from 'lucide-react';
import { useT } from '../../hooks/useT';
import { safeLocalStorage } from '../../lib/safeLocalStorage';

import { UserData } from './types';

interface PersonalInfoTabProps {
  userData: UserData | null;
  editData: UserData | null;
  isEditing: boolean;
  onEditDataChange: (newData: UserData) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export default function PersonalInfoTab({ 
  userData, 
  editData, 
  isEditing, 
  onEditDataChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit
}: PersonalInfoTabProps) {
  const t = useT();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  // Функция для обновления геолокации
  const updateLocation = async () => {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером');
      return;
    }

    setIsUpdatingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        
        try {
          // Получаем детальную информацию об адресе
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=18&accept-language=ru`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const locationData = {
              lat,
              lon,
              city: data.address.city || data.address.town || data.address.village || data.address.municipality,
              country: data.address.country,
              state: data.address.state || data.address.region,
              street: data.address.road,
              houseNumber: data.address.house_number,
              postcode: data.address.postcode,
              district: data.address.suburb || data.address.district,
              fullAddress: data.display_name
            };

            // Формируем строку местоположения
            const parts = [];
            if (locationData.city) parts.push(locationData.city);
            if (locationData.state && locationData.state !== locationData.city) parts.push(locationData.state);
            if (locationData.country) parts.push(locationData.country);
            
            const locationString = parts.length > 0 ? parts.join(', ') : 'Не удалось определить';

            // Обновляем данные пользователя
            const updatedUserData = {
              ...userData!,
              location: locationString,
              context: {
                ...userData?.context,
                location: locationData
              }
            };

            // Сохраняем в localStorage
            const savedUserData = safeLocalStorage.getJSON('user_data');
            if (savedUserData) {
              savedUserData.context = {
                ...savedUserData.context,
                location: locationData
              };
              safeLocalStorage.setJSON('user_data', savedUserData);
            }

            // Обновляем состояние компонента
            onEditDataChange(updatedUserData);
            
            alert('Местоположение успешно обновлено!');
          } else {
            alert('Не удалось получить детальную информацию о местоположении');
          }
        } catch (error) {
          console.error('Ошибка при получении адреса:', error);
          alert('Ошибка при получении адреса');
        }
        
        setIsUpdatingLocation(false);
      },
      (error) => {
        console.error('Ошибка геолокации:', error);
        let errorMessage = 'Ошибка при определении местоположения';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Доступ к геолокации запрещен';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Местоположение недоступно';
            break;
          case error.TIMEOUT:
            errorMessage = 'Превышено время ожидания';
            break;
        }
        
        alert(errorMessage);
        setIsUpdatingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  // Проверяем, что данные загружены
  if (!userData || !editData) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getActivityLevelText = (level: string) => {
    const levels = {
      sedentary: t('profile.sedentary'),
      lightly_active: t('profile.lightly_active'),
      moderately_active: t('profile.moderately_active'),
      very_active: t('profile.very_active'),
      extremely_active: t('profile.extremely_active')
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getGenderText = (gender: string) => {
    const genders = {
      male: t('profile.male'),
      female: t('profile.female'),
      other: t('profile.other')
    };
    return genders[gender as keyof typeof genders] || gender;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('profile.personal_info')}
        </h3>
        
        <div className="flex items-center space-x-3">
          {/* Кнопка развернуть/свернуть */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Свернуть
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Развернуть
              </>
            )}
          </button>

          {/* Кнопки редактирования */}
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
      
      {/* Краткая информация всегда видна */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Полное имя
          </label>
          <p className="text-gray-900 dark:text-white">
            {userData?.firstName} {userData?.lastName}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('profile.email')}
          </label>
          <p className="text-gray-900 dark:text-white">
            {userData?.email}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('profile.location')}
          </label>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <p className="text-gray-900 dark:text-white">
              {userData?.location || 'Не указано'}
            </p>
          </div>
        </div>
      </div>

      {/* Основные параметры */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Возраст
          </label>
          <p className="text-gray-900 dark:text-white">
            {userData?.age ? `${userData.age} лет` : 'Не указан'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Пол
          </label>
          <p className="text-gray-900 dark:text-white">
            {userData?.gender ? getGenderText(userData.gender) : 'Не указан'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Рост
          </label>
          <p className="text-gray-900 dark:text-white">
            {userData?.height ? `${userData.height} см` : 'Не указан'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Вес
          </label>
          <p className="text-gray-900 dark:text-white">
            {userData?.weight ? `${userData.weight} кг` : 'Не указан'}
          </p>
        </div>
      </div>

      {/* Развернутая информация */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.first_name')}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editData?.firstName || ''}
              onChange={(e) => onEditDataChange({...editData, firstName: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {userData?.firstName || ''}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.last_name')}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editData?.lastName || ''}
              onChange={(e) => onEditDataChange({...editData, lastName: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {userData?.lastName || ''}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.username')}
          </label>
          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
            @{userData.username}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.date_of_birth')}
          </label>
          {isEditing ? (
            <input
              type="date"
              value={editData?.dateOfBirth || ''}
              onChange={(e) => onEditDataChange({...editData, dateOfBirth: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {formatDate(userData.dateOfBirth)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.gender')}
          </label>
          {isEditing ? (
            <select
              value={editData?.gender || 'male'}
              onChange={(e) => onEditDataChange({...editData, gender: e.target.value as 'male' | 'female' | 'other'})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="male">{t('profile.male')}</option>
              <option value="female">{t('profile.female')}</option>
              <option value="other">{t('profile.other')}</option>
            </select>
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {getGenderText(userData.gender)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.height')} ({t('profile.cm')})
          </label>
          {isEditing ? (
            <input
              type="number"
              value={editData?.height || ''}
              onChange={(e) => onEditDataChange({...editData, height: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {userData.height} {t('profile.cm')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.weight')} ({t('profile.kg')})
          </label>
          {isEditing ? (
            <input
              type="number"
              value={editData?.weight || ''}
              onChange={(e) => onEditDataChange({...editData, weight: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {userData.weight} {t('profile.kg')}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('profile.activity_level')}
        </label>
        {isEditing ? (
          <select
            value={editData?.activityLevel || 'sedentary'}
            onChange={(e) => onEditDataChange({...editData, activityLevel: e.target.value as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'})}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="sedentary">{t('profile.sedentary')}</option>
            <option value="lightly_active">{t('profile.lightly_active')}</option>
            <option value="moderately_active">{t('profile.moderately_active')}</option>
            <option value="very_active">{t('profile.very_active')}</option>
            <option value="extremely_active">{t('profile.extremely_active')}</option>
          </select>
        ) : (
          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
            {getActivityLevelText(userData.activityLevel)}
          </p>
        )}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('profile.bio')}
        </label>
        {isEditing ? (
          <textarea
            value={editData?.bio || ''}
            onChange={(e) => onEditDataChange({...editData, bio: e.target.value})}
            rows={4}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        ) : (
          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
            {userData.bio}
          </p>
        )}
      </div>

      {/* Детальная информация о местоположении в развернутом виде */}
      {!isEditing && userData?.context?.location && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📍 Детальное местоположение
          </label>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {userData.context.location.city && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">🏙️ Город:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{userData.context.location.city}</span>
                </div>
              )}
              {userData.context.location.state && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">🏛️ Регион:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{userData.context.location.state}</span>
                </div>
              )}
              {userData.context.location.country && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">🌍 Страна:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{userData.context.location.country}</span>
                </div>
              )}
              {userData.context.location.district && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">🏘️ Район:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{userData.context.location.district}</span>
                </div>
              )}
              {userData.context.location.street && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">🛣️ Улица:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {userData.context.location.street} {userData.context.location.houseNumber || ''}
                  </span>
                </div>
              )}
              {userData.context.location.postcode && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">📮 Индекс:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{userData.context.location.postcode}</span>
                </div>
              )}
            </div>
            {userData.context.location.lat && userData.context.location.lon && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  📍 Координаты: {userData.context.location.lat.toFixed(6)}, {userData.context.location.lon.toFixed(6)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('profile.website')}
        </label>
        {isEditing ? (
          <input
            type="url"
            value={editData?.website || ''}
            onChange={(e) => onEditDataChange({...editData, website: e.target.value})}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        ) : (
          <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
            {userData.website}
          </p>
        )}
      </div>

      {/* Поле местоположения только в режиме редактирования */}
      {isEditing && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.location')}
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={editData?.location || ''}
              onChange={(e) => onEditDataChange({...editData!, location: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Город, Страна"
            />
            <button
              onClick={updateLocation}
              disabled={isUpdatingLocation}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingLocation ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Определяем местоположение...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Определить автоматически
                </>
              )}
            </button>
            {userData?.context?.location && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>🌍 Детали: {userData.context.location.fullAddress}</p>
                {userData.context.location.lat && userData.context.location.lon && (
                  <p>📍 Координаты: {userData.context.location.lat.toFixed(6)}, {userData.context.location.lon.toFixed(6)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
}
