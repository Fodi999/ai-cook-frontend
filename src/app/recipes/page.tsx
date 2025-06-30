'use client';

import { useState } from 'react';
import { ChefHat, Search, Star, Clock, Users, Heart, Filter, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { useT } from '@/hooks/useT';

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const t = useT();

  const categories = [
    { value: 'all', label: t('recipes.all_categories') },
    { value: 'breakfast', label: t('recipes.category_breakfast') },
    { value: 'lunch', label: t('recipes.category_lunch') },
    { value: 'dinner', label: t('recipes.category_dinner') },
    { value: 'desserts', label: t('recipes.category_dessert') },
    { value: 'snacks', label: t('recipes.category_snacks') },
    { value: 'drinks', label: 'Напитки' }
  ];

  const difficulties = [
    { value: 'all', label: 'Любая сложность' },
    { value: 'easy', label: t('recipes.difficulty_easy') },
    { value: 'medium', label: t('recipes.difficulty_medium') },
    { value: 'hard', label: 'Сложно' }
  ];

  const recipes = [
    {
      id: 1,
      title: "Паста Карбонара",
      description: "Классическое итальянское блюдо с беконом, яйцами и сыром пармезан",
      time: "30 мин",
      difficulty: "medium",
      category: "dinner",
      rating: 4.8,
      likes: 245,
      author: "Мария К.",
      image: "🍝",
      ingredients: ["спагетти", "бекон", "яйца", "пармезан", "черный перец"]
    },
    {
      id: 2,
      title: "Авокадо тост",
      description: "Полезный и быстрый завтрак с авокадо и яйцом пашот",
      time: "15 мин",
      difficulty: "easy",
      category: "breakfast",
      rating: 4.6,
      likes: 189,
      author: "Алексей М.",
      image: "🥑",
      ingredients: ["хлеб", "авокадо", "яйцо", "лимон", "соль"]
    },
    {
      id: 3,
      title: "Шоколадный фондан",
      description: "Изысканный десерт с жидким шоколадным центром",
      time: "45 мин",
      difficulty: "hard",
      category: "desserts",
      rating: 4.9,
      likes: 312,
      author: "Елена В.",
      image: "🍫",
      ingredients: ["темный шоколад", "масло", "яйца", "мука", "сахар"]
    },
    {
      id: 4,
      title: "Борщ украинский",
      description: "Традиционный украинский борщ с говядиной и сметаной",
      time: "2 ч",
      difficulty: "medium",
      category: "lunch",
      rating: 4.7,
      likes: 156,
      author: "Ольга С.",
      image: "🍲",
      ingredients: ["говядина", "свекла", "капуста", "морковь", "лук"]
    },
    {
      id: 5,
      title: "Греческий салат",
      description: "Свежий салат с фетой, оливками и овощами",
      time: "10 мин",
      difficulty: "easy",
      category: "snacks",
      rating: 4.5,
      likes: 98,
      author: "Дмитрий П.",
      image: "🥗",
      ingredients: ["помидоры", "огурцы", "фета", "оливки", "оливковое масло"]
    },
    {
      id: 6,
      title: "Смузи с ягодами",
      description: "Полезный смузи с клубникой, бананом и йогуртом",
      time: "5 мин",
      difficulty: "easy",
      category: "drinks",
      rating: 4.4,
      likes: 87,
      author: "Анна Л.",
      image: "🥤",
      ingredients: ["клубника", "банан", "йогурт", "мед", "молоко"]
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('recipes.title')}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Откройте для себя мир вкусных рецептов
            </p>
            <div className="flex items-center justify-center space-x-2">
              <span className="px-3 py-1 text-sm bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
                {filteredRecipes.length} рецептов
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={t('recipes.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                {/* Recipe Image */}
                <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-800 dark:to-red-800 rounded-t-lg flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {recipe.image}
                </div>

                {/* Recipe Content */}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-xl group-hover:text-orange-500 transition-colors">
                      {recipe.title}
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Recipe Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.time}</span>
                      </div>
                      <Badge variant={
                        recipe.difficulty === 'easy' ? 'default' :
                        recipe.difficulty === 'medium' ? 'secondary' : 'destructive'
                      }>
                        {recipe.difficulty === 'easy' ? 'Легко' : 
                         recipe.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                      </Badge>
                    </div>
                  </div>

                  {/* Ingredients Preview */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Ингредиенты:</div>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{recipe.ingredients.length - 3} еще
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recipe Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{recipe.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{recipe.likes}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      от {recipe.author}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Рецепты не найдены
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Попробуйте изменить параметры поиска или фильтры
            </p>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
