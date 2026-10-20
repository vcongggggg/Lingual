/**
 * LinguaFlow Web Push Service Worker
 * Handles incoming push notifications and click-to-open deepLink.
 */

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  let data = {
    title: 'Lingual - Bò LingLing',
    body: 'Bạn có lời nhắc học tập mới!',
    deepLink: '/',
    icon: '/mascot/cow_gen_studying.png',
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch (e) {
      const text = event.data.text();
      if (text) data.body = text;
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: data.icon || '/mascot/cow_gen_studying.png',
    badge: '/mascot/cow_gen_studying.png',
    data: {
      deepLink: data.deepLink || '/',
      dateOfArrival: Date.now(),
    },
    vibrate: [100, 50, 100],
    tag: data.tag || 'lingual-notification',
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const deepLink = event.notification.data?.deepLink || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Nếu có sẵn tab/cửa sổ đang mở, chuyển hướng và focus
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url && 'focus' in client) {
          client.navigate(deepLink);
          return client.focus();
        }
      }
      // Nếu chưa có cửa sổ nào mở, mở cửa sổ mới
      if (clients.openWindow) {
        return clients.openWindow(deepLink);
      }
    })
  );
});
