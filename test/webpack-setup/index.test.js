const {expect} = require('chai');
const td = require('testdouble');
const WebpackSetup = require('../../src/webpack-setup');
const Webpack = td.func(require('webpack').default);
const WebpackDevServer = td.constructor(require('webpack-dev-server'));
const LocalDirectory = td.constructor(require('../../src/local-directory'));
const Application = td.constructor(require('../../src/application'));
const EntryPoint = td.constructor(require('../../src/webpack-setup/entry-point'));

describe('WebpackSetup', function() {
  td.when(LocalDirectory.prototype.getFullPath()).thenReturn('./webpack');
  const webpackSetup = new WebpackSetup(LocalDirectory, Application);
  it('creates local directory', function() {
    expect(td.explain(LocalDirectory).calls[0].args[0]).to.equal('webpack');
  });
  describe('#getWebpackDir', function() {
    const webpackDir = webpackSetup.getWebpackDir();
    it('returns local directory', function() {
      expect(webpackDir).to.equal('./webpack');
    });
  });
  describe('#emptyDirectory', function() {
    webpackSetup.emptyDirectory();
    it('empties local directory', function() {
      expect(td.explain(LocalDirectory.prototype.empty).calls.length).to.equal(1);
    });
  });
  it('#write', async function() {
    td.when(EntryPoint.prototype.getDiv()).thenReturn('<div id="entry"/>');
    return webpackSetup.write('./routes.js', EntryPoint).then(() => {
      expect(td.explain(EntryPoint.prototype.write).calls[0].args[0]).to.equal('./webpack');
      expect(td.explain(Application.prototype.writeHtml).calls[0].args[0]).to.equal('./webpack/index.html');
      expect(td.explain(EntryPoint.prototype.write).calls[0].args[1]).to.equal('./routes.js');
      expect(td.explain(EntryPoint.prototype.write).calls[0].args[2]).to.equal('./webpack/index.js');
      expect(td.explain(Application.prototype.writeHtml).calls[0].args[1]).to.equal('<div id="entry"/>');
    });
  });
  it('#startServer', async function() {
    td.when(Application.prototype.createConfig(td.matchers.anything())).thenReturn({config:"foo-config"});
    const compiler = td.object();
    td.when(Webpack(td.matchers.anything())).thenReturn(compiler);
    const promise = webpackSetup.startServer(1234, Webpack, WebpackDevServer).then(() => {
      expect(td.explain(Application.prototype.createConfig).calls[0].args[0]).to.equal("./webpack/index.js");
      expect(td.explain(Webpack).calls[0].args[0]).to.deep.equal({config:"foo-config"});
      expect(td.explain(WebpackDevServer).calls[0].args[0]).to.equal(compiler);
      expect(td.explain(WebpackDevServer).calls[0].args[1].contentBase).to.equal('./webpack');
      expect(td.explain(WebpackDevServer.prototype.listen).calls[0].args[0]).to.equal(1234);
      expect(td.explain(WebpackDevServer.prototype.listen).calls[0].args[1]).to.equal('127.0.0.1');
    });
    td.explain(WebpackDevServer.prototype.listen).calls[0].args[2]();
    return promise;
  });
});
