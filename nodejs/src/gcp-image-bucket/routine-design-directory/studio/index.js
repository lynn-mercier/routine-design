const puppeteer = require('puppeteer');
const fs = require('fs');
const ImageStorage = require('../image-storage');
const ComponentStudio = require('./component-studio');

class Studio {
  constructor(projectId, storageBucketName, componentDirectory, port, tryCount, MyImageStorage = ImageStorage, myPuppeteer = puppeteer) {
    this.imageStorage_ = new MyImageStorage(projectId, storageBucketName, componentDirectory);
    this.componentFiles_ = componentDirectory.getFiles();
    this.componentDirectory_ = componentDirectory;
    this.port_ = port;
    this.tryCount_ = tryCount;
    this.myPuppeteer_ = myPuppeteer;
  }

  async init(myFs = fs) {
    if (!this.browser_) {
      const launchOptions = {};
      const isDocker = process.env.ROUTINE_DESIGN_DOCKER;
      if (isDocker === 'true') {
        launchOptions.executablePath = 'google-chrome-unstable';
        launchOptions.args = ['--disable-dev-shm-usage'];
      }

      this.browser_ = await this.myPuppeteer_.launch(launchOptions);
    }

    if (!this.viewportSet_) {
      let viewportJson = {};

      if (myFs.existsSync(this.componentDirectory_.getDirectory()+"/viewport.json")) {
        const viewportJsonPromise = new Promise((resolve, reject) => {
          myFs.readFile(this.componentDirectory_.getDirectory()+"/viewport.json", function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });

        viewportJson = JSON.parse(await viewportJsonPromise);
      }

      this.viewport_ = viewportJson;
      this.viewportSet_ = true;
    }
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
    const compontentFile = this.componentFiles_[index];
    return this.getComponentImages().then((componentImages) => {
      let viewportWidth;

      if (this.viewport_[compontentFile.getBasename()]) {
        viewportWidth = this.viewport_[compontentFile.getBasename()].width;
      }

      return new MyComponentStudio(
        compontentFile, 
        componentImages[index], 
        this.browser_, 
        this.port_, 
        this.tryCount_,
        viewportWidth);
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
