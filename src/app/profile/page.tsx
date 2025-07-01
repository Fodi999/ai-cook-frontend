'use client';

import { motion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import MobileNavigation from '../../components/MobileNavigation';
import BottomNavigation from '../../components/BottomNavigation';
import {
  ProfileHeader,
  QuickActions,
  ProfileCard,
  ProfileTabs,
  PersonalInfoTab,
  NutritionGoalsTab,
  AnalyticsTab,
  FridgeTabResponsive,
  PostsTab,
  SettingsTab,
  PrivacyTab,
  AiAssistantTab
} from '../../components/profile';
import { ProfileErrorBoundary } from '../../components/profile/ProfileErrorBoundary';
import { useProfile } from '../../components/profile/useProfile';

export default function Profile() {
  const {
    // State
    isEditing,
    activeTab,
    userData,
    editData,
    aiMessages,
    newMessage,
    isAiTyping,
    isAnimating,
    animatedParts,
    
    // Actions
    setIsEditing,
    setActiveTab,
    setUserData,
    setEditData,
    setNewMessage,
    handleSave,
    handleCancel,
    handleLogout,
    handleSuggestionClick,
    handleSendMessage
  } = useProfile();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <PersonalInfoTab
            userData={userData}
            editData={editData}
            isEditing={isEditing}
            onEditDataChange={setEditData}
            onStartEdit={() => setIsEditing(true)}
            onSaveEdit={handleSave}
            onCancelEdit={handleCancel}
          />
        );
      case 'goals':
        return (
          <NutritionGoalsTab
            userData={userData}
            editData={editData}
            isEditing={isEditing}
            onEditDataChange={setEditData}
            onStartEdit={() => setIsEditing(true)}
            onSaveEdit={handleSave}
            onCancelEdit={handleCancel}
          />
        );
      case 'analytics':
        return <AnalyticsTab />;
      case 'fridge':
        return <FridgeTabResponsive />;
      case 'posts':
        return <PostsTab />;
      case 'settings':
        return (
          <SettingsTab
            userData={userData}
            onUserDataChange={setUserData}
          />
        );
      case 'privacy':
        return (
          <PrivacyTab
            userData={userData}
            onUserDataChange={setUserData}
            onLogout={handleLogout}
          />
        );
      case 'ai':
        return (
          <AiAssistantTab
            messages={aiMessages}
            newMessage={newMessage}
            isAiTyping={isAiTyping}
            isAnimating={isAnimating}
            animatedParts={animatedParts}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onSuggestionClick={handleSuggestionClick}
          />
        );
      default:
        return (
          <PersonalInfoTab
            userData={userData}
            editData={editData}
            isEditing={isEditing}
            onEditDataChange={setEditData}
            onStartEdit={() => setIsEditing(true)}
            onSaveEdit={handleSave}
            onCancelEdit={handleCancel}
          />
        );
    }
  };

  return (
    <ProfileErrorBoundary>
      {/* Десктопная навигация */}
      <div className="hidden md:block">
        <Navigation />
      </div>
      
      {/* Мобильная навигация */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IC</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">IT Cook</h1>
        </div>
        <MobileNavigation />
      </div>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-0">
        {/* Десктопный заголовок */}
        <div className="hidden md:block">
          <ProfileHeader />
        </div>

        {/* Мобильные быстрые действия */}
        <div className="md:hidden">
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Профиль
              </button>
              <button
                onClick={() => setActiveTab('fridge')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === 'fridge'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Холодильник
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === 'goals'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Цели
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Аналитика
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === 'ai'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                ИИ помощник
              </button>
            </div>
          </div>
        </div>

        {/* Десктопные быстрые действия */}
        <div className="hidden md:block">
          <QuickActions
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Profile Card - скрыт на мобильных */}
            <div className="lg:col-span-1 hidden lg:block">
              <ProfileCard
                userData={userData}
                isEditing={isEditing}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Десктопные табы */}
              <div className="hidden md:block">
                <ProfileTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="min-h-0"
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Мобильная нижняя навигация */}
      <BottomNavigation />
    </ProfileErrorBoundary>
  );
}
