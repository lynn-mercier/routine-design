const path = require('path');

class ComponentRoute {
  constructor(routesPath, componentFile) {
    this.routesPath_ = routesPath;
    this.componentFile_ = componentFile;
  }

  getImportPath() {
    let result = path.join(path.relative(path.dirname(this.routesPath_), this.componentFile_.getDirname()), this.componentFile_.getBasename());
    if (result[0]!=".") {
      result = "./"+result;
    }
    return result;
  }

  getRoute() {
    return "<Route exact path='/"+this.componentFile_.getPath()+"' component={require('"+this.getImportPath()+"').default}/>"
  }
}

module.exports = ComponentRoute;
