const WebpackSetup = require('./webpack-setup');
const RoutesSetup = require('./routes-setup');

class RenderServer {

  async run(renderDirectory, webpackDir, port = 8080, 
  	MyWebpackSetup = WebpackSetup, MyRoutesSetup = RoutesSetup) {
    const webpackSetup = new MyWebpackSetup(webpackDir, webpackDir+"/index.js");
    await webpackSetup.emptyDirectory();
    const routesPath = webpackDir+"/routes.js";
    new MyRoutesSetup(renderDirectory, routesPath).writeJavaScript();
    await webpackSetup.write(routesPath);
    await webpackSetup.startServer(port);
  }
}

module.exports = RenderServer;
