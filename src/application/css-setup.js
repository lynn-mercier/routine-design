const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class CssSetup {
  constructor(cssFilename) {
    this.cssFilename_ = cssFilename;
  }

  getWebpackRule() {
    return {
      test: /\.scss$/,
      use: [MiniCssExtractPlugin.loader,'css-loader','sass-loader',]
    };
  }

  getWebpackPlugins() {
    return [new MiniCssExtractPlugin({filename: this.cssFilename_})];
  }

  getLink() {
    return "<link rel=\"stylesheet\" href=\""+this.cssFilename_+"\">";
  }
}

module.exports = CssSetup;
