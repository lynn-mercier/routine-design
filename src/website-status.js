
class WebsiteStatus {
  constructor(browser, url) {
    this.browser_ = browser;
    this.url_ = url;
    this.page_;
  }

  async getPage() {
    if (this.page_) {
      return this.page_;
    }

    this.page_ = await this.browser_.newPage();
    return this.page_;
  }

  async resolves() {
    const page = await this.getPage();
    const url = this.url_;
    return new Promise(async function(resolve, reject) {
      try {
        await page.goto(url, {timeout: 1000});
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

module.exports = WebsiteStatus;
