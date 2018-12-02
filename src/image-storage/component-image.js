const randomstring = require('randomstring');
const GcpImage = require('../gcp-image');

class ComponentImage {
  constructor(storage, screenshotBucketName, componentFile, id, MyGcpImage = GcpImage) {
    this.storage_ = storage;
    this.screenshotBucketName_ = screenshotBucketName;
    this.componentFile_ = componentFile;
    this.id_ = id;
    this.MyGcpImage_ = MyGcpImage;
  }

  getId() {
    return this.id_;
  }

  getGcpPath() {
    if (!this.id_) {
      throw new Error('no GCP ID defined');
    }
    
    return this.componentFile_.getPath() + "/" + this.id_ + ".png";
  }

  createGcpImage() {
    return new this.MyGcpImage_(this.storage_, this.screenshotBucketName_, this.getGcpPath());
  }

  async saveImage(localImage, myRandomstring = randomstring) {
    this.id_ = myRandomstring.generate();
    await this.createGcpImage().upload(await localImage.getPng());
  }
}

module.exports = ComponentImage;
