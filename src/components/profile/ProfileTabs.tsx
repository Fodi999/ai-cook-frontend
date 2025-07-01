'use client';

import { User, Target, Settings, Shield } from 'lucide-react';
import { useT } from '../../hooks/useT';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const t = useT();

  const tabs = [
    { id: 'profile', label: t('profile.personal_info'), icon: User },
    { id: 'goals', label: t('profile.nutrition_goals'), icon: Target },
    { id: 'settings', label: t('profile.account_settings'), icon: Settings },
    { id: 'privacy', label: t('profile.privacy_settings'), icon: Shield },
  ];

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
