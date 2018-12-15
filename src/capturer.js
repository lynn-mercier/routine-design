const Studio = require('./studio');
const RenderServer = require('./render-server');

class Capturer {

  async run(projectId, screenshotBucketName, componentDirectory, port = 8080, tryCount = 10, MyStudio = Studio) {
    const studio = new MyStudio(projectId, screenshotBucketName, componentDirectory, port, tryCount);
    const promises = [];  
    for (let i=0; i<studio.getComponentCount(); i++) {
      const promise = studio.getComponent(i).then(function(componentStudio) {
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
        }).then(function() {
          return componentStudio.cleanup();
        });
      });
      promises.push(promise);
    }
    await Promise.all(promises);
    await studio.save();
  }
}

module.exports = Capturer;
