"use strict";
var k = {};
k.a = 9;
importScripts('./browserserverworker.js');
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim()); // Übernimmt Kontrolle über alle Seiten
});
;
//a
//# sourceMappingURL=service-worker.js.map