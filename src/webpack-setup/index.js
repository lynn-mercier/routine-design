const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const LocalDirectory = require('../local-directory');
const Application = require('../application');
const EntryPoint = require('./entry-point');

class WebpackSetup {
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

  async write(routesPath, MyEntryPoint = EntryPoint) {
    const entryPoint = new MyEntryPoint();
    const entryPointPromise = entryPoint.write(this.getWebpackDir(), routesPath, this.javaScriptPath_);
    const htmlPromise = this.application_.writeHtml(this.getWebpackDir()+"/index.html", entryPoint.getDiv());
    return Promise.all([entryPointPromise, htmlPromise]);
  }

  async startServer(port = 8080, MyWebpack = Webpack, MyWebpackDevServer = WebpackDevServer) {
    const compiler = MyWebpack(this.application_.createConfig(this.javaScriptPath_));
    const server = new MyWebpackDevServer(compiler, {
      contentBase: this.getWebpackDir()
    });
    return new Promise(function(resolve, reject) {
      server.listen(port, '127.0.0.1', () => {
        resolve();
      });
    });
  }
}

module.exports = WebpackSetup;
