const CACHE_NAME = 'it-cook-v2';
const urlsToCache = [
  '/',
  '/profile',
  '/recipes',
  '/community',
  '/health-demo',
  '/manifest.json',
  '/favicon.svg',
  '/icon-144x144.svg',
  '/icon-192x192.svg',
  '/icon-512x512.svg'
];

// Установка service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        // Кэшируем файлы по одному для лучшей обработки ошибок
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}:`, error);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('Service worker installed successfully');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('Service worker installation failed:', error);
      })
  );
});

// Активация service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service worker activated successfully');
      return self.clients.claim();
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем кэшированную версию или загружаем из сети
        return response || fetch(event.request);
      }
    )
  );
});

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление от IT Cook',
    icon: '/icon-192x192.svg',
    badge: '/icon-144x144.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Открыть приложение',
        icon: '/icon-144x144.svg'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/icon-144x144.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('IT Cook', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Открыть приложение
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Просто закрыть уведомление
    event.notification.close();
  } else {
    // Клик по самому уведомлению
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Обработка фоновой синхронизации
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Здесь можно синхронизировать данные с сервером
  return Promise.resolve();
}
