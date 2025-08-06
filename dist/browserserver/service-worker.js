"use strict";
var k = {};
k.a = 9;
importScripts('./browserserverworker.js');
eval(`self.addEventListener('activate', event => {
    console.log("test activated");
    event.waitUntil(self.clients.claim()); // Übernimmt Kontrolle über alle Seiten
  });
`);
//a
//# sourceMappingURL=service-worker.js.map