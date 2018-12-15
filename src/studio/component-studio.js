const WebPage = require('../web-page');

class ComponentStudio {
  constructor(componentFile, componentImage, browser, port, tryCount, MyWebPage = WebPage) {
    this.file_ = componentFile;
    this.image_ = componentImage;
    this.browser_ = browser;
    this.port_ = port;
    this.tryCount_ = tryCount;
    this.MyWebPage_ = MyWebPage;
  }

  isImageSet() {
    const imageId = this.image_.getId();
    if (!imageId) {
      return false; 
    }

    return true;
  }

  async getNewImage() {
    if (this.newImage_) {
      return this.newImage_;
    }

    const webPage = new this.MyWebPage_(this.browser_, this.port_, this.file_.getPath());
    await webPage.waitForResolution(this.tryCount_);
    this.newImage_ = await webPage.screenshot();
    return this.newImage_;
  }

  async isSame() {
    const oldPng = await this.image_.createGcpImage().download();
    const newPng = await (await this.getNewImage()).getPng();
    if (Buffer.compare(oldPng.data, newPng.data) === 0) {
      return true;
    }

    return false;
  }

  async saveNewImage() {
    await this.image_.saveImage(await this.getNewImage());
  }

  async cleanup() {
    if (this.newImage_) {
      await this.newImage_.delete();
    }
  }
}

module.exports = ComponentStudio;
