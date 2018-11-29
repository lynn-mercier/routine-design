const path = require('path');

class ComponentFile {
  constructor(renderDirectory, routesPath, file) {
    this.renderDirectory_ = renderDirectory;
    this.routesPath_ = routesPath;
    this.file_ = file;
  }

  getPath() {
    let result = path.relative(this.renderDirectory_, path.dirname(this.file_));
    if (path.basename(this.file_)!="index.js") {
      result = path.join(result, path.basename(this.file_, '.js'));
    }
    return result;
  }

  getImportPath() {
    let result = path.join(path.relative(path.dirname(this.routesPath_), path.dirname(this.file_)), path.basename(this.file_));
    if (result[0]!=".") {
      result = "./"+result;
    }
    return result;
  }

  getRoute() {
    return "<Route exact path='/"+this.getPath()+"' component={require('"+this.getImportPath()+"').default}/>"
  }
}

module.exports = ComponentFile;
