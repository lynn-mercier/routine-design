const PngFactory = require('./png-factory')
const {PNG} = require('pngjs');
const WebPage = require('../../web-page');

class ComponentStudio {
  constructor(componentFile, componentImage, browser, port, tryCount, MyWebPage = WebPage, MyPngFactory = PngFactory) {
    this.file_ = componentFile;
    this.image_ = componentImage;
    this.browser_ = browser;
    this.port_ = port;
    this.tryCount_ = tryCount;
    this.MyWebPage_ = MyWebPage;
    this.pngFactory = new MyPngFactory();
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

  async getOldImage() {
    if (this.oldImage_) {
      return this.oldImage_;
    } else if (!this.isImageSet()) {
      throw new Error("there is no old image");
    }
    this.oldImage_ = await this.image_.createGcpImage().download();
    return this.oldImage_;
  }

  async isSame() {
    let oldPng;
    let newPng;
    await Promise.all([this.getOldImage(), this.getNewImage()]).then(function(values) {
      oldPng = values[0];
      newPng = values[1];
    });

    if (Buffer.compare(oldPng.data, newPng.data) === 0) {
      return true;
    }

    return false;
  }

  async diff() {
    let oldImage;
    let newImage;
    await Promise.all([this.getOldImage(), this.getNewImage()]).then(function(values) {
      oldImage = values[0];
      newImage = values[1];
    });
    const diffImage = this.pngFactory.createPng({width: newImage.width, height: newImage.height});
    const pixelDiffCount = this.pngFactory.pixelmatch(newImage.data, oldImage.data, diffImage.data, newImage.width, newImage.height, {threshold: 0.1});
    if (pixelDiffCount > 0) {
      const diffUploadPromise = this.image_.createGcpDebugImage("diff.png").upload(diffImage);
      const newUploadPromise = this.image_.createGcpDebugImage("new.png").upload(newImage);
      await Promise.all([diffUploadPromise, newUploadPromise])
    }
    return pixelDiffCount;
  }

  async saveNewImage() {
    await this.image_.saveImage(await this.getNewImage());
  }
}

module.exports = ComponentStudio;
