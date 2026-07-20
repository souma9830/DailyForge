// ============================================================
// DailyForge Service Worker
// Handles notification clicks and "I'm Present" action
// ============================================================

const VERSION = 'v2-attendance';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Receive notifications from the main app thread (via Socket.io)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, data } = event.data;
    
    self.registration.showNotification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: tag || 'dailyforge-notification',
      renotify: true,
      requireInteraction: true,
      data: data, // store reminderId, etc.
      actions: [
        {
          action: 'attend',
          title: '✅ I\'m Present',
        }
      ]
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const reminderId = event.notification.data?.reminderId;
  const action = event.action;

  if (action === 'attend' && reminderId) {
    // Call the backend API directly from the service worker
    event.waitUntil(
      fetch(`/api/reminders/${reminderId}/attend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(data => console.log('Marked as present via SW:', data))
        .catch(err => console.error('Error marking present via SW:', err))
    );
  } else {
    // Focus the app window
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        for (const client of clients) {
          if (client.url.includes(self.location.origin)) {
            return client.focus();
          }
        }
        return self.clients.openWindow('/');
      })
    );
  }
});
