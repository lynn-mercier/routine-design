const path = require('path');

class ComponentFile {
  constructor(renderDirectory, file) {
    this.renderDirectory_ = renderDirectory;
    this.file_ = file;
  }

  getPath() {
    let result = path.relative(this.renderDirectory_, this.getDirname());
    if (path.basename(this.file_)!="index.js") {
      result = path.join(result, path.basename(this.file_, '.js'));
    }
    return result;
  }

  getDirname() {
    return path.dirname(this.file_);
  }

  getBasename() {
    return path.basename(this.file_);
  }
}

module.exports = ComponentFile;
