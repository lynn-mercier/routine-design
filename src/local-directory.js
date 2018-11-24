const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

class LocalDirectory {
  constructor(subpath, myPath = path, myFs = fs) {
    this.path_ = 'routine-design-output';
    this.subpath_ = subpath;
    this.myPath_ = myPath;
    this.myFs_ = myFs;
    if (!myFs.existsSync(this.path_)) {
      myFs.mkdirSync(this.path_);
    }
  }

  getFullPath() {
    return this.myPath_.join(this.path_, this.subpath_);
  }

  async create() {
    if (!this.myFs_.existsSync(this.getFullPath())) {
      this.myFs_.mkdirSync(this.getFullPath());
    }
  }

  async empty(myRimRaf = rimraf) {
    const fullPath = this.getFullPath();
    const myFs = this.myFs_;
    return new Promise(function(resolve, reject) {
      myRimRaf(fullPath, () => {
        myFs.mkdirSync(fullPath);
        resolve();
      });
    });
  }
}

module.exports = LocalDirectory;
