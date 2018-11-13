const {expect} = require('chai');
const path = require('path');
const JavaScriptSetup = require('../../src/application/javascript-setup');

describe('application/JavaScriptSetup', function() {
  const javaScriptSetup = new JavaScriptSetup('js.js');
  describe('#createConfig(javaScriptPath)', function() {
    const config = javaScriptSetup.createConfig('./tmp/index.js');
    it('contain javaScriptPath', function() {
      expect(config.entry[0]).to.equal('./tmp/index.js');
    });
    it('contain javaScriptFilename', function() {
      expect(config.output.filename).to.equal('js.js');
    });
    it('configured for the local directory', function() {
      expect(config.output.path).to.equal(path.dirname(path.resolve(__dirname, '../../src/application/javascript-setup')));
    });
    it('have only one plugin', function() {
      expect(config.module.rules.length).to.equal(1);
    });
    describe('plugin', function() {
      const javaScriptRule = config.module.rules[0];
      it('parse JavaScript files', function() {
        expect(javaScriptRule.test+"").to.equal('/\\.js$/');
      });
      it('exclude node modules', function() {
        expect(javaScriptRule.exclude+"").to.equal('/(node_modules)/');
      });
      it('load using babel', function() {
        expect(javaScriptRule.use.loader).to.equal('babel-loader');
      });
      it('transform jsx', function() {
        expect(javaScriptRule.use.options.plugins[0]).to.equal('@babel/plugin-transform-react-jsx');
      });
    });
  });
  describe('#getScript', function() {
    it('should return script', function() {
      expect(javaScriptSetup.getScript()).to.equal("<script src='js.js'></script>");
    });
  });
});
