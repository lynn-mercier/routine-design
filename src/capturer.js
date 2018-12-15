const Studio = require('./studio');
const RenderServer = require('./render-server');

class Capturer {
  constructor(port = 8080) {
    this.port_ = port;
  }

  async render(renderDirectory, MyRenderServer = RenderServer) {
    return new MyRenderServer().run(renderDirectory, this.port_);
  }

  async capture(projectId, screenshotBucketName, componentDirectory, tryCount = 10, MyStudio = Studio) {
    const studio = new MyStudio(projectId, screenshotBucketName, componentDirectory, this.port_, tryCount);
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
