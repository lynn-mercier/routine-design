const LocalImage = require('./local-image');
const {PNG} = require('pngjs');

class GcpImage {
  constructor(storage, screenshotBucketName, gcpPath, MyLocalImage = LocalImage) {
    this.storageBucket_ = storage.bucket(screenshotBucketName);
    this.screenshotBucketName_ = screenshotBucketName;
    this.gcpPath_ = gcpPath;
    this.MyLocalImage_ = MyLocalImage;
  }

  async upload(png) {
    const localImage = new this.MyLocalImage_();
    await localImage.write(png);
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
    const png = await localImage.getPng();
    await localImage.delete();
    return png;
  }

  getUrl() {
    return "https://storage.googleapis.com/" + this.screenshotBucketName_ + "/" + this.gcpPath_;
  }
}

module.exports = GcpImage;
