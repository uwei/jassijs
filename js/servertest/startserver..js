const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Webpack-Konfiguration
const config = {
    mode: 'development',
    entry: './servertest/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: './dist',
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack HMR Demo'
        }),
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
const compiler = webpack(config);
const server = new WebpackDevServer(devServerOptions, compiler);
// Server starten
(async () => {
    await server.start();
    console.log('Webpack Dev Server läuft auf http://localhost:3000');
})();
//# sourceMappingURL=startserver..js.map