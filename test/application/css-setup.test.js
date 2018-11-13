const {expect} = require('chai');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssSetup = require('../../src/application/css-setup');

describe('application/CssSetup', function() {
  const cssSetup = new CssSetup('css.css');
  describe('#getWebpackRule', function() {
    const sassRule = cssSetup.getWebpackRule();
    it('should return rule', function() {
      expect(sassRule.use[1]).to.equal('css-loader');
      expect(sassRule.use[2]).to.equal('sass-loader');
    });
    it('cover Sass files', function() {
      expect(sassRule.test+"").to.equal('/\\.scss$/');
    });
    it('have only three loaders', function() {
      expect(sassRule.use.length).to.equal(3);
    });
    it('load Sass first', function() {
      expect(sassRule.use[2]).to.equal('sass-loader');
    });
    it('compile Sass into CSS', function() {
      expect(sassRule.use[1]).to.equal('css-loader');
    });
    it('extract CSS file', function() {
      expect(sassRule.use[0]).to.equal(MiniCssExtractPlugin.loader);
    });
  });
  describe('#getWebpackPlugins', function() {
    const plugins = cssSetup.getWebpackPlugins();
    it('should have only one plugin', function() {
      expect(plugins.length).to.equal(1);
    });
  });
  describe('#getLink', function() {
    it('should return link', function() {
      expect(cssSetup.getLink()).to.equal("<link rel=\"stylesheet\" href=\"css.css\">");
    });
  });
});
