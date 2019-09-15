
class RoutineDesign {

  createApplication(cssFilename = "bundle.css", javaScriptFilename = "bundle.js") {
    if (!this.Application_) {
      this.Application_ = require('./src/application');
    }
    return new this.Application_(cssFilename, javaScriptFilename);
  }

  createGcpImageBucket(projectId, storageBucketName) {
    if (!this.GcpImageBucket_) {
      this.GcpImageBucket_ = require('./src/gcp-image-bucket');
    }
    return new this.GcpImageBucket_(projectId, storageBucketName);
  }

  createRoutineDesignTree(directory) {
    if (!this.RoutineDesignTree_) {
      this.RoutineDesignTree_ = require('./src/routine-design-tree');
    }
    return new this.RoutineDesignTree_(directory)
  }

  createComponentWorkshop(renderDirectory, gcpProjectId, storageBucketName) {
    if (!this.ComponentWorkshop_) {
      this.ComponentWorkshop_ = require('./src/component-workshop');
    }
    return new this.ComponentWorkshop_(renderDirectory, gcpProjectId, storageBucketName)
  }

  createWebPage(browser, port, path) {
    if (!this.WebPage_) {
      this.WebPage_ = require('./src/web-page');
    }
    return new this.WebPage_(browser, port, path)
  }

  getLocalStorage() {
    if (!this.localStorage_) {
      const LocalStorage = require('./src/local-storage');
      this.localStorage_ = new LocalStorage();
    }
    return this.localStorage_;
  }
}

module.exports = RoutineDesign;
