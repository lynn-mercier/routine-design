
class PngFactory {
  createPng(pngOptions) {
    if (!this.PNG_) {
      this.PNG_ = require('pngjs').PNG;
    }

    return new this.PNG_(pngOptions);
  }

  pixelmatch() {
    if (!this.pixelmatch_) {
      this.pixelmatch_ = require('pixelmatch');
    }
    return this.pixelmatch_.apply(null, arguments);
  }
}

module.exports = PngFactory;
