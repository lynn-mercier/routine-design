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

  async init() {
    if (this.browser_) {
      return;
    }
    
    const launchOptions = {};
    const isDocker = process.env.ROUTINE_DESIGN_DOCKER;
    if (isDocker === 'true') {
      launchOptions.executablePath = 'google-chrome-unstable';
      launchOptions.args = ['--disable-dev-shm-usage'];
    }

    this.browser_ = await this.myPuppeteer_.launch(launchOptions);
  }

  async getComponentImages() {
    if (this.componentImages_) {
      return this.componentImages_;
    }

    this.componentImages_ = await this.imageStorage_.getImages();
    return this.componentImages_;
  }

  getComponentCount() {
    return this.componentFiles_.length;
  }

  async getComponent(index, MyComponentStudio = ComponentStudio) {
    return this.getComponentImages().then((componentImages) => {
      return new MyComponentStudio(this.componentFiles_[index], componentImages[index], this.browser_, this.port_, this.tryCount_);
    });
  }

  async save() {
    await this.imageStorage_.save();
  }

  getDebugId() {
    return this.imageStorage_.getDebugId();
  }

  async cleanup() {
    await this.browser_.close();
  }
}

module.exports = Studio;
