const LocalImage = require('./local-image');

class WebPage {
  constructor(browser, port, path) {
    this.browser_ = browser;
    this.url_ = 'http://localhost:'+port+'/#/'+path;
  }

  async getPage() {
    if (this.page_) {
      return this.page_;
    }

    this.page_ = await this.browser_.newPage();
    return this.page_;
  }

  async screenshot(MyLocalImage = LocalImage) {
    const localImage = new MyLocalImage();
    await localImage.prepareForWriting();
    await (await this.getPage()).screenshot({path: localImage.getPath()});
    const localImagePng = localImage.getPng();
    await localImage.delete();
    return localImagePng;
  }

  async resolves() {
    const page = await this.getPage();
    return new Promise(async (resolve, reject) => {
      try {
        await page.goto(this.url_, {timeout: 1000});
        return resolve(true);
      } catch (error) {
        if (!error.message.includes('net::ERR_CONNECTION_REFUSED') && 
          !error.message.includes('Navigation Timeout Exceeded')) {
          return reject(error);
        }
        return resolve(false);
      }
    });
  }

  async waitForResolution(tryCount) {
    const resolves = await this.resolves();

    if (!resolves) {
      if (tryCount === 0) {
        return Promise.reject("Doesn't resolve");
      }
      await new Promise(res => setTimeout(res, 1000));
      await this.waitForResolution(tryCount - 1);
    }
  }
}

module.exports = WebPage;
