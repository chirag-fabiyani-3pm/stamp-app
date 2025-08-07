// Generate cache version using app version and build timestamp
const APP_VERSION = '0.1.0'; // Should match package.json version
const BUILD_TIMESTAMP = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
const CACHE_VERSION = `${APP_VERSION}-${BUILD_TIMESTAMP}`;
const STATIC_CACHE = `stamp-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `stamp-dynamic-${CACHE_VERSION}`;
const API_CACHE = `stamp-api-${CACHE_VERSION}`;

// Only cache essential static assets that rarely change
const staticAssets = [
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html', // Make sure you have an offline page
];

// Assets that should always use network-first strategy (main app files)
const networkFirstPaths = [
  '/',
  '/index.html',
  '/login',
  '/catalog',
  '/stamps',
  '/profile',
];

// API patterns that should have short-term caching
const apiPatterns = [
  '/api/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(staticAssets).catch(err => {
          console.warn('[SW] Failed to cache some static assets:', err);
        });
      }),
      // Skip waiting to activate new service worker immediately
      self.skipWaiting()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  const pathname = url.pathname;
  
  // Skip non-HTTP(S) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Handle API requests with short-term caching
  if (apiPatterns.some(pattern => pathname.includes(pattern))) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (staticAssets.some(asset => pathname === asset || pathname.endsWith(asset))) {
    event.respondWith(cacheFirstStrategy(event.request, STATIC_CACHE));
    return;
  }

  // Handle main app routes with network-first strategy
  if (networkFirstPaths.some(path => pathname === path || pathname.startsWith(path))) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // Handle JavaScript, CSS, and other static resources
  if (pathname.includes('/_next/') || pathname.endsWith('.js') || pathname.endsWith('.css') || pathname.endsWith('.woff2')) {
    event.respondWith(staleWhileRevalidateStrategy(event.request));
    return;
  }

  // Default: network-first for everything else
  event.respondWith(networkFirstStrategy(event.request));
});

// Network-first strategy: Always try network, fallback to cache
async function networkFirstStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      // Cache successful responses for offline use
      cache.put(request, networkResponse.clone()).catch(err => {
        console.warn('[SW] Failed to cache response:', err);
      });
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, try to serve offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    return new Response('Offline content not available', { 
      status: 404,
      statusText: 'Offline content not available'
    });
  }
}

// Cache-first strategy: Check cache first, then network
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Content not available', { 
      status: 404,
      statusText: 'Content not available'
    });
  }
}

// Stale-while-revalidate: Serve from cache, update in background
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background
  const fetchPromise = fetch(request).then(response => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(err => {
    console.warn('[SW] Background fetch failed:', err);
  });

  // Return cached version immediately, or wait for network
  return cachedResponse || fetchPromise;
}

// Handle API requests with short-term caching
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      // Clone and cache with short TTL
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      
      // Clean up API cache after 5 minutes
      setTimeout(() => {
        cache.delete(request).catch(err => {
          console.warn('[SW] Failed to clean API cache:', err);
        });
      }, 300000);
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache only for GET requests
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('API not available offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

self.addEventListener('activate', (event) => {
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete caches that don't match current version
            if (cacheName.startsWith('stamp-') && !cacheName.includes(CACHE_VERSION)) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ])
  );
  
  // Notify all clients that a new version is available
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATED',
        version: CACHE_VERSION,
        message: `App updated to version ${CACHE_VERSION}! Refresh to get the latest features.`
      });
    });
  });
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION_INFO',
      version: CACHE_VERSION
    });
  }
});

// Background sync for failed requests (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      // Handle background sync here
    }
  });
} 