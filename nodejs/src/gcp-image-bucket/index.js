
class GcpImageBucket {
  constructor(projectId, storageBucketName) {
    this.projectId_ = projectId;
    this.storageBucketName_ = storageBucketName;
  }

  createRoutineDesignDirectory(componentDirectory) {
    if (!this.RoutineDesignDirectory_) {
      this.RoutineDesignDirectory_ = require('./routine-design-directory');
    }
    return new this.RoutineDesignDirectory_(this.projectId_, this.storageBucketName_, componentDirectory);
  }

  createGcpImage(gcpPath) {
    if (!this.GcpImage_) {
      this.GcpImage_ = require('./gcp-image');
    }
    return new this.GcpImage_(this.projectId_, this.storageBucketName_, gcpPath);
  }
}

module.exports = GcpImageBucket;
