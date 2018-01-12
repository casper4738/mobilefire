'use strict';

var cacheName = "mobile_fire_1";

var cacheFiles = [
	'/',
	'/index.html'
]

console.log('Service Worker Started', self);

/*self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Service Worker Installed', event);
});*/

self.addEventListener('install', function(e) {
 console.log('[ServiceWorker] Install');
  e.waitUntil(
        Promise.all([caches.open(cacheName) ,self.skipWaiting()]).then(function(storage){
            var static_cache = storage[0];
            return Promise.all([static_cache.addAll(cacheFiles)]);
        })
    );
});

/*self.addEventListener('activate', function(event) {
  console.log('Service Worker Activated', event);
});*/

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  //console.log('[ServiceWorker] Fetch reuqest url', e.request.url);
  //console.log('[ServiceWorker] Fetch reuqest', e.request);
  e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
});

self.addEventListener('push', function(event) {
  console.log('Service Worker recived a push message', event.data.text());

  var title = 'Click to open push message';
  event.waitUntil(
    self.registration.showNotification(title, {
      'body': event.data.text(),
      'icon': 'assets/icon.png'
    }));
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  event.notification.close();
  if(!event.notification.body.includes('verification code'))
  {
    var url = 'http://www.google.com';
    event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      console.log('WindowClients', windowClients);
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        console.log('WindowClient', client);
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
     	 }
    	})
 	 );
  }
  else
  {
    sendUpdateNotification(event.notification.body.substring(event.notification.body.lastIndexOf(" ")+1));
  }
});

function sendUpdateNotification(verif_cd) {
    clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
            client.postMessage({
                type: 'VERIF_CD',
                verif: verif_cd
            });
        });
    });
}
