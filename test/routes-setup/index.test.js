const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const RoutesSetup = require('../../src/routes-setup');
const glob = td.func(require('glob'));
const mockFs = td.object(fs);
const ComponentFile = td.constructor(require('../../src/routes-setup/component-file'));
const ComponentRoute = td.constructor(require('../../src/routes-setup/component-route'));

describe('RoutesSetup', function() {
  const routesSetup = new RoutesSetup('./tmp', glob, ComponentFile);
  td.when(glob.sync(td.matchers.anything())).thenReturn(['./tmp/index.js']);
  describe('#getComponentFiles', function() {
    const componentFiles = routesSetup.getComponentFiles();
    it('cover render directory', function() {
      expect(td.explain(glob.sync).calls[0].args[0]).to.equal("./tmp/**/*.js");
    });
    it('has one component file', function() {
      expect(componentFiles.length).to.equal(1);
    });
  });
  it('#writeJavaScript', async function() {
    td.when(ComponentRoute.prototype.getRoute()).thenReturn("<Route/>");
    const promise = routesSetup.writeJavaScript( './tmp/routes.js', mockFs, ComponentRoute).then(() => {
      expect(td.explain(mockFs.writeFile).calls[0].args[0]).to.equal('./tmp/routes.js');
      expect(td.explain(mockFs.writeFile).calls[0].args[1]).to.equal(fs.readFileSync('test/routes-setup/golden.js', 'utf8'));
    });
    td.explain(mockFs.writeFile).calls[0].args[2]();
    return promise;
  });
});
