const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const ComponentTree = require('../../src/component-tree');
const glob = td.func(require('glob'));
const mockFs = td.object(fs);
const ComponentFile = td.constructor(require('../../src/component-tree/component-file'));
const ComponentRoute = td.constructor(require('../../src/component-tree/component-route'));

describe('ComponentTree', function() {
  const routesSetup = new ComponentTree('./tmp', glob, ComponentFile);
  td.when(glob.sync(td.matchers.anything())).thenReturn(['./tmp/index.js']);
  describe('#getFiles', function() {
    const componentFiles = routesSetup.getFiles();
    it('cover directory', function() {
      expect(td.explain(glob.sync).calls[0].args[0]).to.equal("./tmp/**/*.js");
    });
    it('has one component file', function() {
      expect(componentFiles.length).to.equal(1);
    });
  });
  it('#writeRoutes', async function() {
    td.when(ComponentRoute.prototype.getRoute()).thenReturn("<Route/>");
    const promise = routesSetup.writeRoutes( './tmp/routes.js', mockFs, ComponentRoute).then(() => {
      expect(td.explain(mockFs.writeFile).calls[0].args[0]).to.equal('./tmp/routes.js');
      expect(td.explain(mockFs.writeFile).calls[0].args[1]).to.equal(fs.readFileSync('test/component-tree/golden.js', 'utf8'));
    });
    td.explain(mockFs.writeFile).calls[0].args[2]();
    return promise;
  });
});
