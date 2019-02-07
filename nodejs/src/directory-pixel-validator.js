const Studio = require('./studio');

class DirectoryPixelValidator {

  async run(projectId, screenshotBucketName, componentDirectory, port = 8080, tryCount = 10, MyStudio = Studio) {
    const studio = new MyStudio(projectId, screenshotBucketName, componentDirectory, port, tryCount);
    try {
      const promises = [];
      for (let i=0; i<studio.getComponentCount(); i++) {
        const promise = studio.getComponent(i).then(function(componentStudio) {
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
      return {allPass, debugId: studio.getDebugId()};
    } finally {
      await studio.cleanup();
    }
  }
}

module.exports = DirectoryPixelValidator;
