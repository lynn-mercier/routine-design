const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const rimraf = require('rimraf');
const fs = require('fs');
const Application = require('../application');
const EntryPoint = require('./entry-point');

class WebpackSetup {
  constructor(MyApplication = Application) {
    this.webpackDir_ = './routine-design-output';
    this.application_ = new MyApplication();
    this.javaScriptPath_ = this.webpackDir_+'/index.js';
  }

  getWebpackDir() {
    return this.webpackDir_;
  }

  async emptyDirectory(myRimRaf = rimraf, myFs = fs) {
    const webpackDir = this.webpackDir_;
    return new Promise(function(resolve, reject) {
      myRimRaf(webpackDir, () => {
        myFs.mkdirSync(webpackDir);
        resolve();
      });
    });
  }

  async write(routesPath, MyEntryPoint = EntryPoint) {
    const entryPoint = new MyEntryPoint();
    const entryPointPromise = entryPoint.write(this.webpackDir_, routesPath, this.javaScriptPath_);
    const htmlPromise = this.application_.writeHtml(this.webpackDir_+"/index.html", entryPoint.getDiv());
    return Promise.all([entryPointPromise, htmlPromise]);
  }

  async startServer(port = 8080, MyWebpack = Webpack, MyWebpackDevServer = WebpackDevServer) {
    const compiler = MyWebpack(this.application_.createConfig(this.javaScriptPath_));
    const server = new MyWebpackDevServer(compiler, {
      contentBase: this.webpackDir_
    });
    return new Promise(function(resolve, reject) {
      server.listen(port, '127.0.0.1', () => {
        resolve();
      });
    });
  }
}

module.exports = WebpackSetup;
