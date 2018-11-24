const fs = require('fs');
const randomstring = require('randomstring');
const path = require('path');
const pngSync = require('pngjs').PNG.sync;
const LocalDirectory = require('./local-directory');

class LocalImage {
  constructor(MyLocalDirectory = LocalDirectory, myPath = path, 
    myRandomstring = randomstring, myPngSync = pngSync, myFs = fs) {
    this.localDirectory_ = new MyLocalDirectory('images');
    this.localDirectory_.create();
    this.myPath_ = myPath;
    this.myRandomstring_ = myRandomstring;
    this.myPngSync_ = myPngSync;
    this.myFs_ = myFs;
  }

  getPath() {
    return this.myPath_.join(this.localDirectory_.getFullPath(), this.myRandomstring_.generate()+'.png');
  }

  getPng() {
    return this.myPngSync_.read(this.myFs_.readFileSync(this.getPath()));
  }

  write(png) {
    this.myFs_.writeFileSync(this.getPath(), this.myPngSync_.write(png));
  }

  async delete() {
    const myPath = this.getPath();
    const myFs = this.myFs_;
    return new Promise(function(resolve, reject) {
      myFs.unlink(myPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = LocalImage;
