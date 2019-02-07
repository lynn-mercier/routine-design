const CssSetup = require('./css-setup');
const JavaScriptSetup = require('./javascript-setup');
const fs = require('fs');

class Application {
  constructor(cssFilename, javaScriptFilename, MyCssSetup = CssSetup, MyJavaScriptSetup = JavaScriptSetup) {
    this.cssSetup_ = new MyCssSetup(cssFilename);
    this.javaScriptSetup_ = new MyJavaScriptSetup(javaScriptFilename);
  }

  async writeHtml(htmlPath, div, myFs = fs) {
    const html = "<!DOCTYPE html><html><head>" +
      "<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"+
      this.cssSetup_.getLink()+"</head>"+
      "<body>"+div+"</body>"+
      this.javaScriptSetup_.getScript()+
      "</html>";
    return new Promise(function(resolve, reject) {
      myFs.writeFile(htmlPath, html, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  createConfig(javaScriptPath) {
    const config = this.javaScriptSetup_.createConfig(javaScriptPath);
    config.module.rules.push(this.cssSetup_.getWebpackRule());
    config.plugins = this.cssSetup_.getWebpackPlugins();
    config.module.rules.push({
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
    });
    return config;
  }
}

module.exports = Application;
