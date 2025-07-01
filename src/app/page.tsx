'use client';

import { ChefHat, Search, Star, Clock, Users, Heart, ArrowRight, Utensils, TrendingUp, Award, User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { useT } from '@/hooks/useT';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const t = useT();

  // Проверка авторизации
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsLoggedIn(true);
      const savedUserData = localStorage.getItem('user_data');
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    }
  }, []);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isLoggedIn ? (
                /* Персонализированное приветствие для авторизованных пользователей */
                <>
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    Добро пожаловать обратно,
                    <span className="block text-orange-500">{userData?.name}!</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                    Готов продолжить кулинарное приключение? У нас есть новые рецепты специально для вас!
                  </p>
                </>
              ) : (
                /* Стандартное приветствие для новых пользователей */
                <>
                  <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('home.hero_title')}
                    <span className="block text-orange-500">IT Cook</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                    {t('home.hero_subtitle')}
                  </p>
                </>
              )}
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={t('home.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-16 py-4 text-lg h-14 rounded-2xl border-2"
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl">
                    {t('home.search_button')}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isLoggedIn ? (
                  /* Кнопки для авторизованных пользователей */
                  <>
                    <Button size="lg" asChild className="text-lg px-8 py-4 rounded-xl">
                      <a href="/profile">
                        <User className="h-5 w-5 mr-2" />
                        Мой профиль
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 rounded-xl border-2">
                      <a href="/recipes">
                        <Utensils className="h-5 w-5 mr-2" />
                        Найти рецепты
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 rounded-xl border-2">
                      <a href="/community">
                        <Users className="h-5 w-5 mr-2" />
                        Сообщество
                      </a>
                    </Button>
                  </>
                ) : (
                  /* Кнопки для неавторизованных пользователей */
                  <>
                    <Button size="lg" asChild className="text-lg px-8 py-4 rounded-xl">
                      <a href="/recipes">
                        <Utensils className="h-5 w-5 mr-2" />
                        {t('navigation.recipes')}
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 rounded-xl border-2">
                      <a href="/register">
                        <Heart className="h-5 w-5 mr-2" />
                        {t('home.cta_button')}
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-red-200 dark:bg-red-800 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.features_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Всё необходимое для вашего кулинарного путешествия
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Utensils className="h-8 w-8" />,
                title: t('home.feature_recipes_title'),
                description: t('home.feature_recipes_desc')
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: t('home.feature_community_title'),
                description: t('home.feature_community_desc')
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Умное планирование",
                description: "Планируйте меню, отслеживайте время готовки и управляйте продуктами"
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Цели питания",
                description: "Ставьте цели, отслеживайте прогресс и достигайте результатов"
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: t('home.feature_smart_title'),
                description: t('home.feature_smart_desc')
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Отслеживание прогресса",
                description: "Ведите дневник питания и следите за достижением целей"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-orange-500 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Популярные рецепты
            </h2>
            <p className="text-xl text-orange-100">
              Самые любимые блюда нашего сообщества
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Паста Карбонара",
                time: "30 мин",
                difficulty: "Средне",
                rating: 4.8,
                image: "🍝"
              },
              {
                title: "Куриные крылышки BBQ",
                time: "45 мин", 
                difficulty: "Легко",
                rating: 4.9,
                image: "🍗"
              },
              {
                title: "Шоколадный торт",
                time: "2 ч",
                difficulty: "Сложно",
                rating: 4.7,
                image: "🎂"
              }
            ].map((recipe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-800 dark:to-red-800 flex items-center justify-center text-6xl">
                    {recipe.image}
                  </div>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl mb-2">
                      {recipe.title}
                    </CardTitle>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.time}</span>
                      </div>
                      <Badge variant="secondary">
                        {recipe.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{recipe.rating}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                        Смотреть рецепт →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5000+", label: "Рецептов" },
              { number: "10k+", label: "Пользователей" },
              { number: "Real-time", label: "Уведомления" },
              { number: "24/7", label: "Поддержка" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6"
              >
                <div className="text-4xl font-bold text-orange-500 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Готовы начать кулинарное путешествие?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам кулинаров, которые уже открыли для себя 
            мир вкусной и здоровой еды с IT Cook
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="px-8 py-4 text-lg">
              <a href="/register">Начать готовить</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-gray-900">
              <a href="/recipes">Смотреть рецепты</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">IT Cook</span>
              </div>
              <p className="text-gray-400">
                Кулинарная платформа нового поколения для тех, кто любит готовить и делиться опытом.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Рецепты</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/recipes" className="hover:text-white transition-colors">Все рецепты</a></li>
                <li><a href="/recipes?category=breakfast" className="hover:text-white transition-colors">Завтраки</a></li>
                <li><a href="/recipes?category=dinner" className="hover:text-white transition-colors">Ужины</a></li>
                <li><a href="/recipes?category=desserts" className="hover:text-white transition-colors">Десерты</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Сообщество</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/community" className="hover:text-white transition-colors">Лента</a></li>
                <li><a href="/community/challenges" className="hover:text-white transition-colors">Челленджи</a></li>
                <li><a href="/community/tips" className="hover:text-white transition-colors">Советы</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-white transition-colors">Помощь</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 IT Cook. Создано с ❤️ для любителей готовить.</p>
          </div>
        </div>
      </footer>

      {/* Персонализированная секция для авторизованных пользователей */}
      {isLoggedIn && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ваша кулинарная панель
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Быстрый доступ к вашим любимым функциям
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <a href="/profile">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Мой профиль
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Центр управления аккаунтом
                      </p>
                    </CardContent>
                  </a>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <a href="/profile" onClick={() => localStorage.setItem('profile_tab', 'ai')}>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Bot className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        ИИ-Помощник
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Персональный кулинарный гид
                      </p>
                    </CardContent>
                  </a>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <a href="/recipes">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <ChefHat className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Рецепты
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Найти новые идеи для готовки
                      </p>
                    </CardContent>
                  </a>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <a href="/community">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Сообщество
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Делитесь рецептами с другими
                      </p>
                    </CardContent>
                  </a>
                </Card>
              </motion.div>
            </div>

            {/* Быстрая статистика */}
            <div className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                  <div className="text-gray-600 dark:text-gray-300">Любимых рецептов</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                  <div className="text-gray-600 dark:text-gray-300">Дней активности</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                  <div className="text-gray-600 dark:text-gray-300">Целей достигнуто</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      </div>
    </>
  );
}
