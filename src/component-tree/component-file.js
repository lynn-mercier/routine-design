const path = require('path');

class ComponentFile {
  constructor(directory, file) {
    this.directory_ = directory;
    this.file_ = file;
  }

  getPath() {
    let result = path.relative(this.directory_, this.getDirname());
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
