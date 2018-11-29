const RoutesServer = require('./routes-server');
const ComponentTree = require('./component-tree');

class RenderServer {

  async run(renderDirectory, port = 8080, 
  	MyRoutesServer = RoutesServer, MyComponentTree = ComponentTree) {
    const routesServer = new MyRoutesServer();
    await routesServer.emptyDirectory();
    const routesPath = routesServer.getWebpackDir()+"/routes.js";
    new MyComponentTree(renderDirectory).writeRoutes(routesPath);
    await routesServer.writeFiles(routesPath);
    await routesServer.start(port);
  }
}

module.exports = RenderServer;
