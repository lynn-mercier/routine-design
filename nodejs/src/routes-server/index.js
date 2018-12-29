const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const LocalDirectory = require('../local-directory');
const Application = require('../application');
const EntryPoint = require('./entry-point');

class RoutesServer {
  constructor(MyLocalDirectory = LocalDirectory, MyApplication = Application) {
    this.localDirectory_ = new MyLocalDirectory('webpack');
    this.application_ = new MyApplication();
    this.javaScriptPath_ = './'+this.getWebpackDir()+'/index.js';
  }

  getWebpackDir() {
    return this.localDirectory_.getFullPath();
  }

  async emptyDirectory() {
    await this.localDirectory_.empty();
  }

  async writeFiles(routesPath, MyEntryPoint = EntryPoint) {
    const entryPoint = new MyEntryPoint();
    const entryPointPromise = entryPoint.write(this.getWebpackDir(), routesPath, this.javaScriptPath_);
    const htmlPromise = this.application_.writeHtml(this.getWebpackDir()+"/index.html", entryPoint.getDiv());
    return Promise.all([entryPointPromise, htmlPromise]);
  }

  async start(port = 8080, MyWebpack = Webpack, MyWebpackDevServer = WebpackDevServer) {
    const compiler = MyWebpack(this.application_.createConfig(this.javaScriptPath_));
    const server = new MyWebpackDevServer(compiler, {
      contentBase: this.getWebpackDir(),
      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        warnings: false,
        publicPath: false
      }
    });
    return new Promise(function(resolve, reject) {
      server.listen(port, '127.0.0.1', () => {
        resolve();
      });
    });
  }
}

module.exports = RoutesServer;
