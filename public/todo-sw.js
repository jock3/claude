/* Todo — service worker for web-push reminders.
 * No fetch handling; this exists only to receive due-date pushes and route the
 * click back into the board. Scope is /apps/todo/, set at registration. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data && event.data.text() }; }
  const title = data.title || 'Todo';
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || '',
    tag: data.tag || 'todo-reminder',
    data: { url: data.url || '/apps/todo/' },
    renotify: true,
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/apps/todo/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) { if (c.url.includes('/apps/todo') && 'focus' in c) return c.focus(); }
      return self.clients.openWindow(url);
    })
  );
});
