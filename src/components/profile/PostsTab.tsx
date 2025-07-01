'use client';

import { Button } from '../ui/button';

export default function PostsTab() {
  const posts = [
    { title: 'Мой первый торт Napoleon', likes: 12, comments: 3, time: '2 дня назад' },
    { title: 'Секрет идеального борща', likes: 28, comments: 7, time: '1 неделю назад' },
    { title: 'Домашняя паста с грибами', likes: 15, comments: 2, time: '2 недели назад' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Мои посты
        </h3>
        <Button asChild>
          <a href="/community">Создать пост</a>
        </Button>
      </div>
      
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">{post.title}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>❤️ {post.likes}</span>
              <span>💬 {post.comments}</span>
              <span>{post.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <a href="/community">Все мои посты</a>
        </Button>
      </div>
    </div>
  );
}
