const fs = require('fs');
const randomstring = require('randomstring');
const path = require('path');
const pngSync = require('pngjs').PNG.sync;
const LocalDirectory = require('./local-directory');

class LocalImage {
  constructor(MyLocalDirectory = LocalDirectory, myPath = path, 
    myRandomstring = randomstring, myPngSync = pngSync, myFs = fs) {
    this.localDirectory_ = new MyLocalDirectory('images');
    this.myPath_ = myPath;
    this.myRandomstring_ = myRandomstring;
    this.myPngSync_ = myPngSync;
    this.myFs_ = myFs;
  }

  getPath() {
    if (this.path_) {
      return this.path_;
    }
    this.path_ = this.myPath_.join(this.localDirectory_.getFullPath(), this.myRandomstring_.generate()+'.png');
    return this.path_;
  }

  async getPng() {
    const readPromise = new Promise((resolve, reject) => {
      this.myFs_.readFile(this.getPath(), function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    return this.myPngSync_.read(await readPromise);
  }

  async prepareForWriting() {
    await this.localDirectory_.create();
  }

  async write(png) {
    await this.prepareForWriting();
    return new Promise((resolve, reject) => {
      this.myFs_.writeFile(this.getPath(), this.myPngSync_.write(png), function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async delete() {
    return new Promise((resolve, reject) => {
      this.myFs_.unlink(this.getPath(),function(err) {
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
