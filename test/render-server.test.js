const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const RenderServer = require('../src/render-server');
const WebpackSetup = td.constructor(require('../src/webpack-setup'));
const RoutesSetup = td.constructor(require('../src/routes-setup'));

describe('RenderServer', function() {
  const renderServer = new RenderServer();
  it('#run', async function() {
    return renderServer.run('./render', './tmp', 1234, WebpackSetup, RoutesSetup).then(() => {
      expect(td.explain(WebpackSetup).calls[0].args[0]).to.equal('./tmp');
      expect(td.explain(WebpackSetup).calls[0].args[1]).to.equal('./tmp/index.js');
      expect(td.explain(WebpackSetup.prototype.emptyDirectory).calls.length).to.equal(1);
      expect(td.explain(RoutesSetup).calls[0].args[0]).to.equal('./render');
      expect(td.explain(RoutesSetup).calls[0].args[1]).to.equal('./tmp/routes.js');
      expect(td.explain(RoutesSetup.prototype.writeJavaScript).calls.length).to.equal(1);
      expect(td.explain(WebpackSetup.prototype.write).calls[0].args[0]).to.equal('./tmp/routes.js');
      expect(td.explain(WebpackSetup.prototype.startServer).calls[0].args[0]).to.equal(1234);
    });
  });
});
