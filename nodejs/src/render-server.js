const LocalStorage = require('./local-storage');
const ComponentTree = require('./component-tree');

class RenderServer {

  async run(renderDirectory, port = 8080, 
  	MyLocalStorage = LocalStorage, MyComponentTree = ComponentTree) {
  	const localStorage = new MyLocalStorage();
    const routesServer = localStorage.createRoutesServer();
    await routesServer.emptyDirectory();
    const routesPath = routesServer.getWebpackDir()+"/routes.js";
    await new MyComponentTree(renderDirectory).writeRoutes(routesPath);
    await routesServer.writeFiles(routesPath);
    await routesServer.start(port);
  }
}

module.exports = RenderServer;
