'use client';

import { motion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import {
  ProfileHeader,
  QuickActions,
  ProfileCard,
  ProfileTabs,
  PersonalInfoTab,
  NutritionGoalsTab,
  AnalyticsTab,
  FridgeTab,
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
        return <FridgeTab />;
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
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ProfileHeader />

        <QuickActions
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <ProfileCard
                userData={userData}
                isEditing={isEditing}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProfileErrorBoundary>
  );
}
