const Studio = require('./studio');
const RenderServer = require('./render-server');

class Capturer {

  async run(projectId, screenshotBucketName, componentDirectory, port = 8080, tryCount = 10, MyStudio = Studio) {
    const studio = new MyStudio(projectId, screenshotBucketName, componentDirectory, port, tryCount);
    for (let i=0; i<studio.getComponentCount(); i++) {
      const componentStudio = await studio.getComponent(i);
      if (!(componentStudio.isImageSet() && await componentStudio.isSame())) {
        await componentStudio.saveNewImage();
      }

      await componentStudio.cleanup();
    }
    await studio.save();
  }
}

module.exports = Capturer;
