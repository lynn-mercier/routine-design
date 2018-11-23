const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

class LocalDirectory {
	constructor(subpath) {
    this.path_ = 'routine-design-output';
    this.subpath_ = subpath;
  }

  getFullPath(myPath = path) {
    return myPath.join(this.path_, this.subpath_);
  }

  async empty(myPath = path, myRimRaf = rimraf, myFs = fs) {
    const fullPath = this.getFullPath(myPath);
    return new Promise(function(resolve, reject) {
      myRimRaf(fullPath, () => {
        myFs.mkdirSync(fullPath);
        resolve();
      });
    });
  }
}

module.exports = LocalDirectory;
