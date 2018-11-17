const WebpackSetup = require('./webpack-setup');
const RoutesSetup = require('./routes-setup');

class RenderServer {

  async run(renderDirectory, port = 8080, 
  	MyWebpackSetup = WebpackSetup, MyRoutesSetup = RoutesSetup) {
    const webpackSetup = new MyWebpackSetup();
    await webpackSetup.emptyDirectory();
    const routesPath = webpackSetup.getWebpackDir()+"/routes.js";
    new MyRoutesSetup(renderDirectory, routesPath).writeJavaScript();
    await webpackSetup.write(routesPath);
    await webpackSetup.startServer(port);
  }
}

module.exports = RenderServer;
