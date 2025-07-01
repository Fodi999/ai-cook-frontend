'use client';

import { useState } from 'react';
import { ChefHat, Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Отправляем запрос на бекенд
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://itcook-backend-go-fodi999-8b0a955d.koyeb.app/api/v1';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка авторизации');
      }

      const data = await response.json();
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      
      toast.success('Добро пожаловать в IT Cook!');
      // Перенаправляем в профиль
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1000);
    } catch (error) {
      toast.error('Ошибка входа. Проверьте данные.');
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

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold mb-2">
                Вход в IT Cook
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Добро пожаловать обратно! Войдите в свой аккаунт.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email адрес</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-12 h-12"
                      placeholder="Ваш пароль"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="remember-me" className="text-sm">
                      Запомнить меня
                    </Label>
                  </div>
                  <a href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600 transition-colors">
                    Забыли пароль?
                  </a>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-lg"
                >
                  {loading ? 'Вход...' : 'Войти'}
                </Button>
              </form>

              {/* Social Login */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Или войдите через</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12">
                    Google
                  </Button>
                  <Button variant="outline" className="h-12">
                    Facebook
                  </Button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Еще нет аккаунта?{' '}
                  <a href="/register" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                    Зарегистрируйтесь
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
