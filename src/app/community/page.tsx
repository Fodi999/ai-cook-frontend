'use client';

import { useState, useEffect } from 'react';
import { ChefHat, Heart, MessageCircle, Share2, ArrowLeft, Plus, TrendingUp, Users, Award, Camera, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navigation from '@/components/Navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function Community() {
  const [selectedTab, setSelectedTab] = useState('feed');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: "Анна Петрова",
        avatar: "👩‍🍳",
        level: "Шеф-кулинар"
      },
      content: "Сегодня приготовила невероятную пасту карбонара! Секрет в том, чтобы снять сковороду с огня перед добавлением яичной смеси. Получилось просто идеально! 🍝",
      image: "🍝",
      likes: 24,
      comments: 8,
      timeAgo: "2 часа назад",
      tags: ["#паста", "#карбонара", "#итальянская_кухня"]
    },
    {
      id: 2,
      author: {
        name: "Михаил Волков",
        avatar: "👨‍🍳",
        level: "Кулинар"
      },
      content: "Кто-нибудь знает хороший рецепт борща без мяса? Хочу попробовать вегетарианский вариант для семьи.",
      image: "🥕",
      likes: 12,
      comments: 15,
      timeAgo: "4 часа назад",
      tags: ["#борщ", "#вегетарианство", "#помощь"]
    },
    {
      id: 3,
      author: {
        name: "Елена Соколова",
        avatar: "👩‍🍳",
        level: "Мастер-кулинар"
      },
      content: "Мой новый шоколадный торт покорил всю семью! Рецепт уже добавила в свою коллекцию. Кто хочет - делюсь! 🎂✨",
      image: "🎂",
      likes: 45,
      comments: 22,
      timeAgo: "6 часов назад",
      tags: ["#торт", "#шоколад", "#десерт", "#рецепт"]
    },
    {
      id: 4,
      author: {
        name: "Дмитрий Кузнецов",
        avatar: "👨‍🍳",
        level: "Начинающий"
      },
      content: "Первый раз готовлю суши дома! Не очень красиво получилось, но очень вкусно 😅 Практика - залог успеха!",
      image: "🍣",
      likes: 18,
      comments: 12,
      timeAgo: "8 часов назад",
      tags: ["#суши", "#первый_раз", "#практика"]
    }
  ]);

  // Состояние для создания поста
  const [newPost, setNewPost] = useState({
    content: '',
    tags: '',
    image: ''
  });

  // Проверка авторизации
  useEffect(() => {
    const loggedIn = localStorage.getItem('user_logged_in');
    const savedUserData = localStorage.getItem('user_data');
    
    if (loggedIn === 'true' && savedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  // Функция создания поста
  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      toast.error('Добавьте текст поста');
      return;
    }

    const post = {
      id: posts.length + 1,
      author: {
        name: userData?.name || 'Пользователь',
        avatar: '👤',
        level: 'Новичок'
      },
      content: newPost.content,
      image: newPost.image || '🍽️',
      likes: 0,
      comments: 0,
      timeAgo: 'Только что',
      tags: newPost.tags.split(' ').filter(tag => tag.startsWith('#'))
    };

    setPosts([post, ...posts]);
    setNewPost({ content: '', tags: '', image: '' });
    setShowCreatePost(false);
    toast.success('Пост опубликован!');
  };

  // Функция лайка поста
  const handleLikePost = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    toast.success('Лайк добавлен!');
  };

  const challenges = [
    {
      id: 1,
      title: "30 дней здорового питания",
      description: "Готовьте здоровые блюда каждый день в течение месяца",
      participants: 1250,
      daysLeft: 12,
      reward: "Значок 'Здоровое питание'"
    },
    {
      id: 2,
      title: "Итальянская неделя",
      description: "Освойте традиционные итальянские блюда",
      participants: 834,
      daysLeft: 5,
      reward: "Специальный рецепт от итальянского шефа"
    },
    {
      id: 3,
      title: "Десертный марафон",
      description: "Приготовьте 10 различных десертов",
      participants: 567,
      daysLeft: 18,
      reward: "Коллекция секретных рецептов"
    }
  ];

  const topChefs = [
    { name: "Виктор Белов", level: "Мастер-кулинар", points: 12500, avatar: "👨‍🍳" },
    { name: "Мария Иванова", level: "Шеф-кулинар", points: 11200, avatar: "👩‍🍳" },
    { name: "Александр Смирнов", level: "Кулинар", points: 9800, avatar: "👨‍🍳" },
    { name: "Ольга Петрова", level: "Шеф-кулинар", points: 9650, avatar: "👩‍🍳" },
    { name: "Игорь Федоров", level: "Мастер-кулинар", points: 9200, avatar: "👨‍🍳" }
  ];

  const tabs = [
    { id: 'feed', label: 'Лента', icon: <MessageCircle className="h-4 w-4" /> },
    { id: 'challenges', label: 'Челленджи', icon: <Award className="h-4 w-4" /> },
    { id: 'leaderboard', label: 'Рейтинг', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  return (
    <>
      <Navigation />
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Сообщество</h1>
              </div>
              
              {isLoggedIn && (
                <Button 
                  onClick={() => setShowCreatePost(true)}
                  className="bg-orange-500 hover:bg-orange-600 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Создать пост</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? "default" : "ghost"}
              onClick={() => setSelectedTab(tab.id)}
              className="flex items-center space-x-2"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Feed Tab */}
        {selectedTab === 'feed' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post Card */}
              {isLoggedIn ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-xl">
                        �
                      </div>
                      <div className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-gray-500"
                          onClick={() => setShowCreatePost(true)}
                        >
                          Поделитесь своим кулинарным опытом...
                        </Button>
                      </div>
                      <Button onClick={() => setShowCreatePost(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Создать пост
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        Войдите, чтобы делиться рецептами и общаться с сообществом
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Button asChild variant="outline">
                          <a href="/login">Войти</a>
                        </Button>
                        <Button asChild>
                          <a href="/register">Регистрация</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Posts */}
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-xl">
                            {post.author.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {post.author.level}
                              </Badge>
                              <span className="text-sm text-gray-500">{post.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                      
                      {/* Post Image */}
                      <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-lg flex items-center justify-center text-6xl mb-4">
                        {post.image}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500 hover:text-red-500"
                            onClick={() => handleLikePost(post.id)}
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Community Stats */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Статистика сообщества</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Активных кулинаров</span>
                    <span className="font-semibold">15,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Рецептов добавлено</span>
                    <span className="font-semibold">8,567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Сегодня онлайн</span>
                    <span className="font-semibold">2,891</span>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Tags */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Популярные теги</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['#здоровое_питание', '#итальянская_кухня', '#десерты', '#быстрые_рецепты', '#веган', '#выпечка'].map((tag, i) => (
                      <Badge key={i} variant="outline" className="cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {selectedTab === 'challenges' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{challenge.daysLeft} дней осталось</Badge>
                      <Award className="h-5 w-5 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold">{challenge.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{challenge.description}</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Участников:</span>
                        <span className="font-semibold">{challenge.participants.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Награда: </span>
                        <span className="font-semibold text-orange-600">{challenge.reward}</span>
                      </div>
                      <Button className="w-full">
                        Принять участие
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {selectedTab === 'leaderboard' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                  Топ кулинаров месяца
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {topChefs.map((chef, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                      </div>
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-lg">
                        {chef.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{chef.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {chef.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">{chef.points.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">очков</div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modal для создания поста */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Создать новый пост
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreatePost(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Что нового в кулинарии?
                  </label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Поделитесь своим рецептом, кулинарным опытом или задайте вопрос сообществу..."
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Эмодзи для поста (необязательно)
                  </label>
                  <Input
                    value={newPost.image}
                    onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                    placeholder="🍝 🥗 🍰 🍲"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Теги (через пробел)
                  </label>
                  <Input
                    value={newPost.tags}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                    placeholder="#рецепт #паста #быстро #вкусно"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreatePost(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    className="bg-orange-500 hover:bg-orange-600 flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Опубликовать</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
