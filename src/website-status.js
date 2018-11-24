
class WebsiteStatus {
  constructor(page, url) {
    this.page_ = page;
    this.url_ = url;
  }

  async resolves() {
    const page = this.page_;
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
