"use strict";
async function httpsample() {
    var code = {
        "./js/index.js": {
            content: `
  const http = require('http');
  const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  // Antwort senden
  res.end("Hallo2");
  });
  const PORT = 3000;
  server.listen(PORT, () => {
  console.log("Server läuft auf http://localhost:"+PORT);
  });
  `
        }
    };
    await new BrowserServer().updateApp({
        name: "httpsample",
        initialfiles: code,
        main: "./index.js"
    });
    window.location.replace('./apps/httpsample');
}
async function expresssample() {
    var code = {
        "./js/app.js": {
            content: `
const express = require('express');
const app = express();
const port = 3000;

// Route für GET-Anfrage an "/"
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// Server starten
app.listen(port, () => {
  console.log("Server läuft auf http://localhost:"+port);
});
  `
        },
        "./package.json": {
            content: `
    {
      "name": "expresssample",
      "version": "1.0.0",
      "main": "app.js",
      "dependencies": {
        "express": "^4.18.2"
      }
    }`
        }
    };
    await new BrowserServer().updateApp({
        name: "expresssample",
        initialfiles: code,
        main: "./app.js"
    });
    window.location.replace('./apps/expresssample');
}
//httpsample();
//expresssample();
async function jassijsold() {
    console.log("jassijsold");
    await new BrowserServer().updateApp({
        name: "jassijs",
        initialfiles: "http://localhost:4000/getcodechanges?2025-07-28T18:26:17.567Z",
        main: "./main.js",
        serviceworkerfile: "./client/service-worker.js",
        redirectUrl: "./index.html"
    });
    await new BrowserServer().startApp("jassijsold");
    //window.location.replace('./apps/jassijs/index.html');
}
async function jassijs() {
    console.log("jassijs");
    await new BrowserServer().updateApp({
        name: "jassijs",
        // initialfiles: "http://localhost:4000/getcodechanges?2025-07-28T18:26:17.567Z",
        giturl: "https://github.com/uwei/jassijs.git",
        main: "./main.js",
        serviceworkerfile: "./client/service-worker.js",
        redirectUrl: "./index.html"
    });
    await new BrowserServer().startApp("jassijs");
    //window.location.replace('./apps/jassijs/index.html');
}
async function swsample() {
    var code = {
        "./index.js": {
            content: `
      navigator.serviceWorker.register('./service-worker.js');
`
        },
        "./sw.js": {
            content: `
  console.log("Start sw3");
  self.addEventListener('install', event => {
   
    self.skipWaiting(); // optional: sofort aktivieren
  });
  
  self.addEventListener('activate', event => {

  });
  async function handleEvent(event) {
    let networkResponse = await fetch(event.request);
   return networkResponse;
  }
  self.addEventListener('fetch', event => {
    var pr = handleEvent(event);
    event.respondWith(pr);
    
  });
  self.addEventListener('fetch', event => {
    console.log("fetch sw3");

    //  event.waitUntil(pr);
  });//self.addEventListener('fetch'
  
  
`
        },
        "./index.html": {
            content: `
      Hallo
      <script src="./index.js"></script>
      <button onclick="fetch('https://example.com/')">Go to Example</button>
`
        },
        "./js/app.js": {
            content: `
        const express = require('express');
        const path = require('path');
        const app = express();
        const PORT = 3000;
        
        // 🔹 Middleware to serve static files from 'public' directory
        app.use(express.static("./"));
        
        // Optional: fallback route
        app.get('*', (req, res) => {
          res.send('Fallback route – file not found');
        });
        
        app.listen(PORT, () => {
          console.log("Server läuft auf http://localhost:"+PORT);
        });
  `
        },
        "./package.json": {
            content: `
    {
      "name": "swsample",
      "version": "1.0.0",
      "main": "app.js",
      "dependencies": {
        "express": "^4.18.2"
      }
    }`
        }
    };
    var h = 1;
    await new BrowserServer().updateApp({
        name: "swsample",
        initialfiles: code,
        main: "./app.js",
        serviceworkerfile: "./sw.js",
        redirectUrl: "./index.html"
    });
    //await new BrowserServer().startApp("swsample");
    //window.location.replace('./apps/swsample/index.html');
}
window.addEventListener('load', async () => {
    navigator.serviceWorker.register('service-worker.js');
    //swsample(); 
    await jassijs();
    /* let apps=await new BrowserServer().getApps();
     let tab=document.getElementById("table");
     for(let x=0;x<apps.length;x++){
       let app=apps[x];
       
     }*/
});
//expresssample();
//# sourceMappingURL=index.js.map