const LocalStorage = require('../local-storage');

class PixelValidator {
  constructor(renderDirectory, gcpProjectId, storageBucketName, componentDirectoryId, routineDesignContainer) {
    this.renderDirectory_ = renderDirectory;
    this.gcpProjectId_ = gcpProjectId;
    this.storageBucketName_ = storageBucketName;
    this.componentDirectoryId_ = componentDirectoryId;
    this.routineDesignContainer_ = routineDesignContainer;
  }

  getComponentDirectoryId() {
    return this.componentDirectoryId_;
  }

  async validate(tryCount = 10) {
    let dockerCommand = 'routine-design directory pixel-validate '+this.gcpProjectId_+' '
    +this.storageBucketName_+' '+this.renderDirectory_+' --try-count='+tryCount;

    if (this.componentDirectoryId_ != '') {
      dockerCommand+= ' --component-directory='+this.componentDirectoryId_;
    }

    const jsonStr = await this.routineDesignContainer_.run(dockerCommand);
    const json = JSON.parse(jsonStr);
    let gcpUrl = "https://console.cloud.google.com/storage/browser/"+this.storageBucketName_+"/";
    
    if (this.componentDirectoryId_ != '') {
      gcpUrl += this.componentDirectoryId_+"/";
    }
    
    gcpUrl += json.debugId+"/?project="+this.gcpProjectId_;

    return {
      allPass: json.allPass,
      gcpUrl: gcpUrl
    }
  }
}

module.exports = PixelValidator;
