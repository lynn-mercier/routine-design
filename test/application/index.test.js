const {expect} = require('chai');
const fs = require('fs');
const td = require('testdouble');
const Application = require('../../src/application');
const mockFs = td.object(fs);
const CssSetup = td.constructor(require('../../src/application/css-setup'));
const JavaScriptSetup = td.constructor(require('../../src/application/javascript-setup'));

describe('Application', function() {
  //TODO make tmp dir
  td.when(CssSetup.prototype.getWebpackRule()).thenReturn({name: "css-webpack-rule"});
  td.when(CssSetup.prototype.getWebpackPlugins()).thenReturn(["css-webpack-plugin"]);
  td.when(CssSetup.prototype.getLink()).thenReturn("<link id='css-setup'>");
  td.when(JavaScriptSetup.prototype.createConfig(td.matchers.anything())).thenReturn({module: {rules: []}});
  td.when(JavaScriptSetup.prototype.getScript()).thenReturn("<script id='javascript-setup'>");
  const application = new Application('css.css', 'js.js', CssSetup, JavaScriptSetup);    
  it('should pass css.css', function() {
    expect(td.explain(CssSetup).calls[0].args[0]).to.equal('css.css');
  });
  it('should pass js.js', function() {
    expect(td.explain(JavaScriptSetup).calls[0].args[0]).to.equal('js.js');
  });
  it('#writeHtml', async function() {
    td.when(mockFs.writeFile(td.matchers.anything(),td.matchers.anything())).thenCallback();
    await application.writeHtml('./tmp/index.html', '<div id="root"/>', mockFs).then(() => {
      expect(td.explain(mockFs.writeFile).calls[0].args[0]).to.equal("./tmp/index.html");
      expect(td.explain(mockFs.writeFile).calls[0].args[1]).to.equal(fs.readFileSync('test/application/golden.html', 'utf8'));
    });
  });
  it('#writeHtml unsuccessfully', async function() {
    td.when(mockFs.writeFile(td.matchers.anything(),td.matchers.anything())).thenCallback('err');
    let caughtError = false;
    try {
      await application.writeHtml('./tmp/index.html', '<div id="root"/>', mockFs);
    } catch (err) {
      caughtError = true;
    }
    expect(caughtError).to.equal(true);
  });
  describe('#createConfig', function() {
    const config = application.createConfig('./tmp/index.js');
    it('use javaScriptPath when creating config', function() {
      expect(td.explain(JavaScriptSetup.prototype.createConfig).calls[0].args[0]).to.equal('./tmp/index.js');
    });
    const rules = config.module.rules;
    describe('rules', function() {
      it('have 2 rules', function() {
        expect(rules.length).to.equal(2);
      });
      it('first rule is css rule', function() {
        expect(rules[0]).to.deep.equal({name: "css-webpack-rule"});
      });
      const assetRule = config.module.rules[1];
      describe('assetRule', function() {
        it('covers all asset file types', function() {
          expect(assetRule.test+"").to.equal('/\\.(png|svg|jpg|gif)$/');
        });
        it('uses file loader', function() {
          expect(assetRule.use[0]).to.equal('file-loader');
        });
      });
    });
    const plugins = config.plugins;
    describe('plugins', function() {
      it('have 1 plugin', function() {
        expect(config.plugins.length).to.equal(1);
      });
      it('use plugin from css setup', function() {
        expect(config.plugins[0]).to.equal("css-webpack-plugin");
      });
    });
  });
});
