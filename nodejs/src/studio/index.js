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

    const launchOptions = {};
    const isDocker = process.env.ROUTINE_DESIGN_DOCKER;
    if (isDocker === 'true') {
      launchOptions.executablePath = 'google-chrome-unstable';
      launchOptions.args = ['--disable-dev-shm-usage'];
    }

    this.browser_ = await this.myPuppeteer_.launch(launchOptions);
    return this.browser_;
  }

  getComponentCount() {
    return this.componentFiles_.length;
  }

  async getComponent(index, MyComponentStudio = ComponentStudio) {
    const componentImagePromise = this.getComponentImages().then(function(componentImages) {
      return componentImages[index];
    });
    const browserPromise = this.getBrowser();

    let componentImage;
    let browser;
    await Promise.all([componentImagePromise, browserPromise]).then(function(values) {
      componentImage = values[0];
      browser = values[1];
    });
    return new MyComponentStudio(this.componentFiles_[index], componentImage, browser, this.port_, this.tryCount_);
  }

  async save() {
    await this.imageStorage_.save();
  }

  async cleanup() {
    if (this.browser_) {
      await this.browser_.close();
    }
  }
}

module.exports = Studio;
