const LocalStorage = require('../local-storage');
const RoutineDesignTree = require('../routine-design-tree');
const PixelValidator = require('./pixel-validator');

class ComponentWorkshop {
  constructor(renderDirectory, gcpProjectId, storageBucketName, 
    MyLocalStorage = LocalStorage, MyRoutineDesignTree = RoutineDesignTree, MyPixelValidator = PixelValidator) {
    this.renderDirectory_ = renderDirectory;
    this.gcpProjectId_ = gcpProjectId;
    this.storageBucketName_ = storageBucketName;
    const localStorage = new MyLocalStorage();
    this.routineDesignContainer_ = localStorage.createRoutineDesignContainer();
    this.routineDesignTree_ = new MyRoutineDesignTree(renderDirectory);
    this.MyPixelValidator_ = MyPixelValidator;
  }

  async setup() {
    await this.routineDesignContainer_.start();
    await this.routineDesignContainer_.run('routine-design render '+this.renderDirectory_, true);
  }
  
  async captureAll(tryCount = 10) {
    const promises = [];

    for (let entry of this.routineDesignTree_.getComponentTree().getDirectories()) {
      const componentDirectoryId = entry[0];
      let dockerCommand = 
        'routine-design directory capture '+this.gcpProjectId_+' '+this.storageBucketName_+' '
        +this.renderDirectory_+' --try-count='+tryCount;

      if (componentDirectoryId != '') {
        dockerCommand+=' --component-directory='+componentDirectoryId;
      }

      const promise = this.routineDesignContainer_.run(dockerCommand);
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  getPixelValidators() {
    const pixelValidators = [];

    for (let entry of this.routineDesignTree_.getComponentTree().getDirectories()) {
      const componentDirectoryId = entry[0];
      pixelValidators.push(
        new this.MyPixelValidator_(
          this.renderDirectory_, this.gcpProjectId_, this.storageBucketName_, componentDirectoryId, this.routineDesignContainer_));
    }

    return pixelValidators;
  }

  async cleanup() {
    await this.routineDesignContainer_.cleanup();
  }
}

module.exports = ComponentWorkshop;
