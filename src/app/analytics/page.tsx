'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Droplets,
  Calendar,
  PieChart,
  Activity,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import Navigation from '../../components/Navigation';
import { useT } from '../../hooks/useT';

export default function Analytics() {
  const t = useT();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data for charts
  const weeklyCaloriesData = [
    { day: 'Пн', calories: 2150, goal: 2200 },
    { day: 'Вт', calories: 2340, goal: 2200 },
    { day: 'Ср', calories: 2100, goal: 2200 },
    { day: 'Чт', calories: 2450, goal: 2200 },
    { day: 'Пт', calories: 2180, goal: 2200 },
    { day: 'Сб', calories: 2600, goal: 2200 },
    { day: 'Вс', calories: 2300, goal: 2200 },
  ];

  const nutrientsData = [
    { name: t('analytics.proteins'), value: 85, goal: 120, color: '#8884d8' },
    { name: t('analytics.carbs'), value: 240, goal: 250, color: '#82ca9d' },
    { name: t('analytics.fats'), value: 65, goal: 70, color: '#ffc658' },
    { name: t('analytics.fiber'), value: 28, goal: 35, color: '#ff7300' },
  ];

  const macroDistribution = [
    { name: t('analytics.proteins'), value: 25, fill: '#8884d8' },
    { name: t('analytics.carbs'), value: 50, fill: '#82ca9d' },
    { name: t('analytics.fats'), value: 25, fill: '#ffc658' },
  ];

  const mealDistribution = [
    { name: t('analytics.breakfast'), calories: 450, fill: '#8884d8' },
    { name: t('analytics.lunch'), calories: 680, fill: '#82ca9d' },
    { name: t('analytics.dinner'), calories: 720, fill: '#ffc658' },
    { name: t('analytics.snacks'), calories: 300, fill: '#ff7300' },
  ];

  const vitaminData = [
    { name: t('analytics.vitamin_c'), current: 85, target: 100 },
    { name: t('analytics.vitamin_d'), current: 65, target: 100 },
    { name: t('analytics.calcium'), current: 92, target: 100 },
    { name: t('analytics.iron'), current: 78, target: 100 },
  ];

  const waterIntakeData = [
    { time: '8:00', glasses: 2 },
    { time: '10:00', glasses: 1 },
    { time: '12:00', glasses: 2 },
    { time: '14:00', glasses: 1 },
    { time: '16:00', glasses: 1 },
    { time: '18:00', glasses: 2 },
    { time: '20:00', glasses: 1 },
  ];

  const progressData = [
    { metric: t('analytics.calories'), current: 2150, target: 2200, percentage: 98 },
    { metric: t('analytics.proteins'), current: 85, target: 120, percentage: 71 },
    { metric: t('analytics.carbs'), current: 240, target: 250, percentage: 96 },
    { metric: t('analytics.fats'), current: 65, target: 70, percentage: 93 },
  ];

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90 && percentage <= 110) return 'text-green-600 dark:text-green-400';
    if (percentage < 90) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 90 && percentage <= 110) return t('analytics.goal_achieved');
    if (percentage < 90) return t('analytics.below_goal');
    return t('analytics.above_goal');
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('analytics.title')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('analytics.subtitle')}
                  </p>
                </div>
              </div>
              
              {/* Period Selector */}
              <div className="flex space-x-2">
                {['day', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {period === 'day' ? 'День' : period === 'week' ? 'Неделя' : 'Месяц'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {progressData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.metric}
                  </h3>
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('analytics.consumed')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.current}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('analytics.daily_target')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.percentage >= 90 && item.percentage <= 110
                          ? 'bg-green-500'
                          : item.percentage < 90
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs ${getStatusColor(item.percentage)}`}>
                    {getStatusText(item.percentage)} ({item.percentage}%)
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Calories Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('analytics.weekly_progress')}
                </h3>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyCaloriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Line
                    type="monotone"
                    dataKey="goal"
                    stroke="#EF4444"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Macro Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('analytics.calorie_distribution')}
                </h3>
                <PieChart className="h-5 w-5 text-blue-500" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie 
                    data={macroDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {macroDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {macroDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Meal Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('analytics.meal_analysis')}
                </h3>
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mealDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Bar dataKey="calories" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Water Intake */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('analytics.water_intake')}
                </h3>
                <Droplets className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-500">8</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('analytics.glasses')} / 10 {t('analytics.glasses')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
                  <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{ width: '80%' }}></div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={waterIntakeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Bar dataKey="glasses" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Nutrients Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('analytics.nutrients_breakdown')}
              </h3>
              <Award className="h-5 w-5 text-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vitaminData.map((vitamin, index) => (
                <div key={index} className="text-center">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {vitamin.name}
                  </h4>
                  <div className="relative w-20 h-20 mx-auto">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200 dark:text-gray-700"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="text-blue-500"
                        strokeDasharray={`${vitamin.current}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {vitamin.current}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
