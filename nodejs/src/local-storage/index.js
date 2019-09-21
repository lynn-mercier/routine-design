
class LocalStorage {
  createLocalImage() {
    if (!this.LocalImage_) {
      this.LocalImage_ = require('./local-image');
    }
    return new this.LocalImage_();
  }

  writeMocha(renderDirectory, gcpProjectId, storageBucketName, tryCount = 10, name = "mocha-writer") {
    if (!this.MochaWriter_) {
      this.MochaWriter_ = require('./mocha-writer');
    }
    return new this.MochaWriter_(name).write(renderDirectory, gcpProjectId, storageBucketName, tryCount);
  }

  createRoutesServer(name = 'routes-server') {
    if (!this.RoutesServer_) {
      this.RoutesServer_ = require('./routes-server');
    }
    return new this.RoutesServer_(name);
  }

  createRoutineDesignContainer(containerName = 'routine-design') {
    if (!this.RoutineDesignContainer_){
      this.RoutineDesignContainer_ = require('./routine-design-container');
    }
    return new this.RoutineDesignContainer_(containerName);
  }
}

module.exports = LocalStorage;
