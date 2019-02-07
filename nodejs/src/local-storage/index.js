
class LocalStorage {
  createLocalImage() {
    if (!this.LocalImage_) {
      this.LocalImage_ = require('./local-image');
    }
    return new this.LocalImage_();
  }

  createRoutesServer(name = 'routes-server') {
    if (this.RoutesServer_) {
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
