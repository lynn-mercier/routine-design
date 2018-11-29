const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const RenderServer = require('../src/render-server');
const RoutesServer = td.constructor(require('../src/routes-server'));
const RoutesSetup = td.constructor(require('../src/routes-setup'));

describe('RenderServer', function() {
  const renderServer = new RenderServer();
  it('#run', async function() {
    td.when(RoutesServer.prototype.getWebpackDir()).thenReturn('./routine-design-output');
    return renderServer.run('./render', 1234, RoutesServer, RoutesSetup).then(() => {
      expect(td.explain(RoutesServer.prototype.emptyDirectory).calls.length).to.equal(1);
      expect(td.explain(RoutesSetup).calls[0].args[0]).to.equal('./render');
      expect(td.explain(RoutesSetup).calls[0].args[1]).to.equal('./routine-design-output/routes.js');
      expect(td.explain(RoutesSetup.prototype.writeJavaScript).calls.length).to.equal(1);
      expect(td.explain(RoutesServer.prototype.writeFiles).calls[0].args[0]).to.equal('./routine-design-output/routes.js');
      expect(td.explain(RoutesServer.prototype.start).calls[0].args[0]).to.equal(1234);
    });
  });
});
