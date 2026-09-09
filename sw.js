// Scramjet service worker.
// Loads the controller, which intercepts and routes proxied requests.
// This file MUST be served from your site root so its scope covers the whole app.
importScripts("/controller/controller.sw.js");
 
// FIX: without these two listeners, the service worker only starts
// controlling the page AFTER a reload (standard SW lifecycle behavior).
// On the very first visit, requests from the <iframe> would bypass the
// SW entirely and Scramjet would never get a chance to rewrite them.
addEventListener("install", () => {
  self.skipWaiting();
});
 
addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
 
addEventListener("fetch", (e) => {
  if ($scramjetController.shouldRoute(e)) {
    e.respondWith($scramjetController.route(e));
  }
});
