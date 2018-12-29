const {Storage} = require('@google-cloud/storage');
const LocalImage = require('./local-image');

class GcpImage {
  constructor(projectId, storageBucketName, gcpPath, MyStorage = Storage, MyLocalImage = LocalImage) {
    this.storageBucket_ = new MyStorage({projectId: projectId}).bucket(storageBucketName);
    this.storageBucketName_ = storageBucketName;
    this.gcpPath_ = gcpPath;
    this.MyLocalImage_ = MyLocalImage;
  }

  async upload(png) {
    const localImage = new this.MyLocalImage_();
    await localImage.write(png);
    await this.storageBucket_.upload(localImage.getPath(), {destination: this.gcpPath_});
    await localImage.delete();
  }

  async download() {
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
    return "https://storage.googleapis.com/" + this.storageBucketName_ + "/" + this.gcpPath_;
  }
}

module.exports = GcpImage;
