const {expect} = require('chai');
const td = require('testdouble');
const RoutesServer = require('../../../src/local-storage/routes-server');
const Webpack = td.func(require('webpack').default);
const WebpackDevServer = require('webpack-dev-server');
const LocalDirectory = td.constructor(require('../../../src/local-storage/local-directory'));
const Application = td.constructor(require('../../../src/application'));
const EntryPoint = td.constructor(require('../../../src/local-storage/routes-server/entry-point'));

describe('local-storage/RoutesServer', function() {
  td.when(LocalDirectory.prototype.getFullPath()).thenReturn('webpack');
  const routesServer = new RoutesServer('foo', LocalDirectory, Application);
  it('creates local directory', function() {
    expect(td.explain(LocalDirectory).calls[0].args[0]).to.equal('foo');
  });
  it('creates application', function() {
    expect(td.explain(Application).calls[0].args[0]).to.equal('bundle.css');
    expect(td.explain(Application).calls[0].args[1]).to.equal('bundle.js');
  });
  describe('#getWebpackDir', function() {
    const webpackDir = routesServer.getWebpackDir();
    it('returns local directory', function() {
      expect(webpackDir).to.equal('webpack');
    });
  });
  describe('#emptyDirectory', function() {
    routesServer.emptyDirectory();
    it('empties local directory', function() {
      expect(td.explain(LocalDirectory.prototype.empty).calls.length).to.equal(1);
    });
  });
  it('#writeFiles', async function() {
    td.when(EntryPoint.prototype.getDiv()).thenReturn('<div id="entry"/>');
    return routesServer.writeFiles('./routes.js', EntryPoint).then(() => {
      expect(td.explain(EntryPoint.prototype.write).calls[0].args[0]).to.equal('webpack');
      expect(td.explain(Application.prototype.writeHtml).calls[0].args[0]).to.equal('webpack/index.html');
      expect(td.explain(EntryPoint.prototype.write).calls[0].args[1]).to.equal('./routes.js');
      expect(td.explain(EntryPoint.prototype.write).calls[0].args[2]).to.equal('./webpack/index.js');
      expect(td.explain(Application.prototype.writeHtml).calls[0].args[1]).to.equal('<div id="entry"/>');
    });
  });
  describe('#start', function() {
    td.when(Application.prototype.createConfig(td.matchers.anything())).thenReturn({config:"foo-config"});
    const compiler = td.object();
    td.when(Webpack(td.matchers.anything())).thenReturn(compiler);
    it('WebpackDevServer listens successfully', async function() {
      const MyWebpackDevServer = td.constructor(WebpackDevServer);
      td.when(MyWebpackDevServer.prototype.listen(td.matchers.anything(), td.matchers.anything())).thenCallback();
      return routesServer.start(1234, Webpack, MyWebpackDevServer).then(() => {
        expect(td.explain(Application.prototype.createConfig).calls[0].args[0]).to.equal("./webpack/index.js");
        expect(td.explain(Webpack).calls[0].args[0]).to.deep.equal({config:"foo-config"});
        expect(td.explain(MyWebpackDevServer).calls[0].args[0]).to.equal(compiler);
        expect(td.explain(MyWebpackDevServer).calls[0].args[1].contentBase).to.equal('webpack');
        expect(td.explain(MyWebpackDevServer.prototype.listen).calls[0].args[0]).to.equal(1234);
        expect(td.explain(MyWebpackDevServer.prototype.listen).calls[0].args[1]).to.equal('127.0.0.1');
      });
    });
    it('WebpackDevServer does not listen successfully', async function() {
      const MyWebpackDevServer = td.constructor(WebpackDevServer);
      td.when(MyWebpackDevServer.prototype.listen(td.matchers.anything(), td.matchers.anything())).thenCallback('error');
      let caughtError = false;
      try {
        await routesServer.start(1234, Webpack, MyWebpackDevServer);
      } catch(error) {
        caughtError = true;
      }
      expect(caughtError).to.equal(true);
    });
  });
});
