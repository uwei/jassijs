const path = require('path');
const webpack = require('webpack');
const http = require('http');
const webpackConfig = {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:4000/__webpack_hmr&reload=true',
    //'webpack-hot-middleware/client?path=http://localhost:4000/__webpack_hmr&reload=true',
    //"webpack-hot-middleware/client?reload=true",
    './servertest/index.js'],
  output: {
    filename: 'bundle.js',
    publicPath: "http://localhost:4000/",// "/"
    path: path.resolve(__dirname, "./../../client"),
    //clean: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  stats: 'errors-only', // oder 'minimal', 'none'
  infrastructureLogging: {
    level: 'error' // oder 'none'
  }
};
// Webpack-Konfiguration
const configExpress = {
  mode: 'development',
  entry: [
    "webpack-hot-middleware/client?reload=true",
    './servertest/index.js'],
  output: {
    filename: 'bundle.js',
    publicPath: "/",
    path: path.resolve(__dirname, "./client"),
    clean: true,
  },
  devServer: {
    static: './dist',
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

// Dev-Server-Konfiguration
const devServerOptions = {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  hot: true,
  port: 3000,
  open: true,
};
export function registerWebpack(app) {
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const compiler = webpack(configExpress);
  //const server = new WebpackDevServer(devServerOptions, compiler);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: configExpress.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));

  // Statische HTML-Datei ausliefern
  app.get("./hrm", (req, res) => {
    res.sendFile(__dirname + "../../public/index.html");
  });
}

export async function startWebpack() {
  const http = require('http');
  const fs = require('fs');
  const path = require('path');
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');


  const compiler = webpack(webpackConfig);

  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    writeToDisk: true,
  });

  const hotMiddleware = webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr', // 👈 explizit setzen
  });

  const server = http.createServer((req, res) => {
    console.log("deliver req.url");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Cache-Control');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const runMiddleware = (middleware, req, res) =>
      new Promise(resolve => middleware(req, res, () => resolve()));

    // ⛔ Wichtig: zuerst HMR behandeln
    runMiddleware(hotMiddleware, req, res)
      .then(() => runMiddleware(devMiddleware, req, res))
      .then(() => {
        // Statische Datei ausliefern
        if (req.url === '/' || req.url === '/index.html') {
          const filePath = path.join(__dirname, 'public', 'index.html');
          fs.readFile(filePath, (err, data) => {
            if (err) {
              res.statusCode = 500;
              res.end('Fehler beim Laden der Seite');
            } else {
              res.setHeader('Content-Type', 'text/html');
              res.end(data);
            }
          });
        } else {
          // Fallback für andere statische Dateien
          const filePath = "./client/"+ req.url;
          fs.readFile(filePath, (err, data) => {
            if (err) {
              res.statusCode = 404;
              res.end('Nicht gefunden');
            } else {
              res.setHeader('Content-Type', 'application/javascript');
              res.end(data);
            }
          });
        }
      });
  });

  server.listen(4000, () => {
    console.log('🚀 Server läuft auf http://localhost:4000');
  });
}

export async function startWebpack2() {
  const webpack = require('webpack');
  const compiler = webpack(webpackConfig);

  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    writeToDisk: true,
  });

  const hotMiddleware = require('webpack-hot-middleware')(compiler);

  const server = http.createServer((req, res) => {
    const fakeReq = { url: req.url, method: req.method, headers: req.headers };
    const fakeRes = {
      write: chunk => res.write(chunk),
      end: chunk => res.end(chunk),
      setHeader: (name, value) => res.setHeader(name, value),
      getHeader: name => res.getHeader(name),
      statusCode: 200,
    };

    devMiddleware(fakeReq, fakeRes, () => {
      hotMiddleware(fakeReq, fakeRes, () => {
        // Fallback: lade index.html aus dist
        if (req.url === '/' || req.url === '/index.html') {
          const htmlPath = path.join(__dirname, 'dist', 'index.html');
          fs.readFile(htmlPath, (err, data) => {
            if (err) {
              res.statusCode = 500;
              res.end('Fehler beim Laden der Seite.');
            } else {
              res.setHeader('Content-Type', 'text/html');
              res.end(data);
            }
          });
        } else {
          res.statusCode = 404;
          res.end('Nicht gefunden');
        }
      });
    });
  });

  server.listen(3000, () => {
    console.log('🟢 Server läuft ohne Express: http://localhost:3000');
  });

}
