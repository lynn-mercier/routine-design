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
    this.exists_ = this.myFs_.existsSync(this.getFullPath());
  }

  getFullPath() {
    return this.myPath_.join(this.path_, this.subpath_);
  }

  async create() {
    if (!this.exists_) {
      return new Promise((resolve, reject) => {
        this.myFs_.mkdir(this.getFullPath(), (err) => {
          if (err) {
            reject(err);
          } else {
            this.exists_ = true;
            resolve();
          }
        });
      });
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
