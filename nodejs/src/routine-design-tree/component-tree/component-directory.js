const glob = require('glob');
const path = require('path');
const ComponentFile = require('./component-file');

class ComponentDirectory {
  constructor(rootDirectory, directory, myGlob = glob, MyComponentFile = ComponentFile) {
    this.rootDirectory_ = rootDirectory;
    this.directory_ = directory;
    this.myGlob_ = myGlob;
    this.MyComponentFile_ = MyComponentFile;
  }

  getFiles() {
    if (this.files_) {
      return this.files_;
    }

    this.files_ = [];
    this.myGlob_.sync(this.directory_ + '/*.js').forEach((file) => {
      const componentFile = new this.MyComponentFile_(this.rootDirectory_, file);
      this.files_.push(componentFile);
    });
    return this.files_;
  }

  getDirectory() {
    return this.directory_;
  }

  getPath() {
    return path.relative(this.rootDirectory_, this.directory_);
  }
}

module.exports = ComponentDirectory;
