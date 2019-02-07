const LocalStorage = require('../local-storage');
const ComponentTree = require('./component-tree');

class RoutineDesignTree {
  constructor(directory, MyLocalStorage = LocalStorage, MyComponentTree = ComponentTree) {
    this.directory_ = directory;
    this.localStorage_ = new MyLocalStorage();
    this.componentTree_ = new MyComponentTree(directory);
  }

  getComponentTree() {
    return this.componentTree_;
  }

  async render(port = 8080) {
    const routesServer = this.localStorage_.createRoutesServer();
    await routesServer.emptyDirectory();
    const routesPath = routesServer.getWebpackDir()+"/routes.js";
    await this.componentTree_.writeRoutes(routesPath);
    await routesServer.writeFiles(routesPath);
    await routesServer.start(port);
  }
}

module.exports = RoutineDesignTree;
