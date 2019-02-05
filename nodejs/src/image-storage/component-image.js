const randomstring = require('randomstring');
const GcpImage = require('../gcp-image');

class ComponentImage {
  constructor(projectId, screenshotBucketName, gcpDebugPath, componentFile, id, MyGcpImage = GcpImage) {
    this.projectId_ = projectId;
    this.screenshotBucketName_ = screenshotBucketName;
    this.gcpDebugPath_ = gcpDebugPath;
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
    return new this.MyGcpImage_(this.projectId_, this.screenshotBucketName_, this.getGcpPath());
  }

  createGcpDebugImage(filename) {
    return new this.MyGcpImage_(this.projectId_, this.screenshotBucketName_, this.gcpDebugPath_ + "/" + this.componentFile_.getBasename() + "/" + filename);
  }

  async saveImage(png, myRandomstring = randomstring) {
    this.id_ = myRandomstring.generate();
    await this.createGcpImage().upload(png);
  }
}

module.exports = ComponentImage;
