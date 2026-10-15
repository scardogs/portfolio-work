// Clean Service Worker for Web Push Notifications & Stale-Cache Recovery
// Replaces next-pwa generated Workbox service worker to prevent 404 precache errors
// and stale Next.js chunk mismatches across Vercel deployments.

const SW_VERSION = "jme-sw-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      } catch (_) {
        // ignore cache cleanup errors
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("push", function (event) {
  if (!event.data) return;
  let data = {};
  try {
    data = event.data.json();
  } catch (_) {
    data = { title: "Notification", body: event.data.text() };
  }
  const options = {
    body: data.body || "",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    data: {
      url: data.url || "/",
    },
    vibrate: [100, 50, 100],
    actions: [{ action: "open", title: "Open Admin" }],
  };
  event.waitUntil(
    self.registration.showNotification(data.title || "Portfolio Alert", options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const urlToOpen = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
