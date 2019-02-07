
class RoutineDesignDirectory {
  constructor(projectId, storageBucketName, componentDirectory) {
    this.projectId_ = projectId;
    this.storageBucketName_ = storageBucketName;
    this.componentDirectory_ = componentDirectory;
  }

  getImageStorage() {
    if (!this.imageStorage_){
      const ImageStorage = require('./image-storage');
      this.imageStorage_ = new ImageStorage(this.projectId_, this.storageBucketName_, this.componentDirectory_);
    }
    return this.imageStorage_;
  }

  createScreenshotCollection(port = 8080, tryCount = 10) {
    if (!this.ScreenshotCollection_) {
      this.ScreenshotCollection_ = require('./screenshot-collection');
    }
    return new this.ScreenshotCollection_(this.projectId_, this.storageBucketName_, this.componentDirectory_, port, tryCount);
  }
}

module.exports = RoutineDesignDirectory;
