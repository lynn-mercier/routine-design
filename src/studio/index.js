const puppeteer = require('puppeteer');
const ImageStorage = require('../image-storage');
const ComponentStudio = require('./component-studio');

class Studio {
  constructor(projectId, storageBucketName, componentDirectory, port, tryCount, MyImageStorage = ImageStorage, myPuppeteer = puppeteer) {
    this.imageStorage_ = new MyImageStorage(projectId, storageBucketName, componentDirectory);
    this.componentFiles_ = componentDirectory.getFiles();
    this.port_ = port;
    this.tryCount_ = tryCount;
    this.myPuppeteer_ = myPuppeteer;
  }

  async getComponentImages() {
    if (this.componentImages_) {
      return this.componentImages_;
    }

    this.componentImages_ = await this.imageStorage_.getImages();
    return this.componentImages_;
  }

  async getBrowser() {
    if (this.browser_) {
      return this.browser_;
    }

    this.browser_ = await this.myPuppeteer_.launch();
    return this.browser_;
  }

  getComponentCount() {
    return this.componentFiles_.length;
  }

  async getComponent(index, MyComponentStudio = ComponentStudio) {
    return new MyComponentStudio(this.componentFiles_[index], (await this.getComponentImages())[index], (await this.getBrowser()), this.port_, this.tryCount_);
  }

  async save() {
    await this.imageStorage_.save();
  }
}

module.exports = Studio;
