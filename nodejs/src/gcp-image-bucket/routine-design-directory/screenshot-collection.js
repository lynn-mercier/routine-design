const Studio = require('./studio');

class ScreenshotCollection {
  constructor(projectId, storageBucketName, componentDirectory, port, tryCount, MyStudio = Studio) {
    this.studio_ = new MyStudio(projectId, storageBucketName, componentDirectory, port, tryCount);
  }

  async init() {
    await this.studio_.init();
  }

  getStudio() {
    return this.studio_;
  }

  async capture() {
    const promises = [];
    for (let i=0; i<this.studio_.getComponentCount(); i++) {
      const promise = this.studio_.getComponent(i).then(function(componentStudio) {
        return new Promise(function(resolve) {
          if (!componentStudio.isImageSet()) {
            resolve(componentStudio.saveNewImage());
          } else {
            const similarityPromise = componentStudio.isSame().then(function(same) {
              if (!same) {
                return componentStudio.saveNewImage();
              }
            });
            resolve(similarityPromise);
          }
        });
      });
      promises.push(promise);
    }
    await Promise.all(promises);
    await this.studio_.save();
  }

  async pixelValidate() {
    const promises = [];
    for (let i=0; i<this.studio_.getComponentCount(); i++) {
      const promise = this.studio_.getComponent(i).then(function(componentStudio) {
        return new Promise(function(resolve) {
          if (!componentStudio.isImageSet()) {
            resolve(false);
          } else {
            const diffPromise = componentStudio.diff().then(function(pixelDiffCount) {
              return pixelDiffCount === 0;
            });
            resolve(diffPromise);
          }
        });
      });
      promises.push(promise);
    }
    const allPass = await Promise.all(promises).then(function(values) {
      for (let i=0; i<values.length; i++) {
        if (values[i] === false) {
          return false;
        }
      }
      return true;
    });
    return {allPass, debugId: this.studio_.getDebugId()};
  }

  async cleanup() {
    await this.studio_.cleanup();
  }
}

module.exports = ScreenshotCollection;
