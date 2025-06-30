'use client';

import { useState } from 'react';
import { ChefHat, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const passwordRequirements = [
    { label: 'Минимум 8 символов', check: formData.password.length >= 8 },
    { label: 'Содержит цифру', check: /\d/.test(formData.password) },
    { label: 'Содержит заглавную букву', check: /[A-Z]/.test(formData.password) },
    { label: 'Содержит специальный символ', check: /[!@#$%^&*]/.test(formData.password) }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (!acceptTerms) {
      toast.error('Необходимо принять условия использования');
      return;
    }

    const allRequirementsMet = passwordRequirements.every(req => req.check);
    if (!allRequirementsMet) {
      toast.error('Пароль не соответствует требованиям');
      return;
    }

    setLoading(true);

    try {
      // Здесь будет интеграция с API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Имитация запроса
      
      // Сохраняем информацию о новом пользователе
      localStorage.setItem('user_logged_in', 'true');
      localStorage.setItem('user_data', JSON.stringify({
        email: formData.email,
        name: formData.username,
        id: 'user_' + Date.now()
      }));
      
      toast.success('Аккаунт успешно создан! Добро пожаловать в IT Cook!');
      // Перенаправляем на онбординг для новых пользователей
      setTimeout(() => {
        window.location.href = '/onboarding';
      }, 1000);
    } catch (error) {
      toast.error('Ошибка регистрации. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      <div className="max-w-md w-full">
        {/* Back Button */}
        <div className="mb-8">
          <a href="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>На главную</span>
          </a>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Присоединяйтесь к IT Cook
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Создайте аккаунт и начните кулинарное путешествие
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Имя пользователя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all"
                  placeholder="chef_name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email адрес
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all"
                  placeholder="Создайте надежный пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.check ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        {req.check && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${
                        req.check ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all"
                  placeholder="Повторите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">Пароли не совпадают</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                id="accept-terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 mt-1 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Я принимаю{' '}
                <a href="/terms" className="text-orange-500 hover:text-orange-600">условия использования</a>
                {' '}и{' '}
                <a href="/privacy" className="text-orange-500 hover:text-orange-600">политику конфиденциальности</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Уже есть аккаунт?{' '}
              <a href="/login" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                Войти
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
