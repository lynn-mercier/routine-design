const LocalImage = require('./local-image');
const {PNG} = require('pngjs');

class GcpImage {
  constructor(storageBucket, gcpPath, MyLocalImage = LocalImage) {
    this.storageBucket_ = storageBucket;
    this.gcpPath_ = gcpPath;
    this.MyLocalImage_ = MyLocalImage;
  }

  async upload(png) {
    const localImage = new this.MyLocalImage_();
    localImage.write(png);
    await this.storageBucket_.upload(localImage.getPath(), {destination: this.gcpPath_});
    await localImage.delete();
  }

  async download(MyPng = PNG) {
    const localImage = new this.MyLocalImage_();
    try {
      await this.storageBucket_.file(this.gcpPath_).download({destination: localImage.getPath()});
    } catch (error) {
      throw error;
    }
    const png = localImage.getPng();
    await localImage.delete();
    return png;
  }
}

module.exports = GcpImage;
