const RoutesServer = require('./routes-server');
const RoutesSetup = require('./routes-setup');

class RenderServer {

  async run(renderDirectory, port = 8080, 
  	MyRoutesServer = RoutesServer, MyRoutesSetup = RoutesSetup) {
    const routesServer = new MyRoutesServer();
    await routesServer.emptyDirectory();
    const routesPath = routesServer.getWebpackDir()+"/routes.js";
    new MyRoutesSetup(renderDirectory, routesPath).writeJavaScript();
    await routesServer.writeFiles(routesPath);
    await routesServer.start(port);
  }
}

module.exports = RenderServer;
