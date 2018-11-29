const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const ComponentTree = require('../../src/component-tree');
const glob = td.func(require('glob'));
const mockFs = td.object(fs);
const ComponentDirectory = td.constructor(require('../../src/component-tree/component-directory'));
const ComponentFile = td.constructor(require('../../src/component-tree/component-file'));
const ComponentRoute = td.constructor(require('../../src/component-tree/component-route'));

describe('ComponentTree', function() {
  const componentTree = new ComponentTree('./tmp', glob, ComponentDirectory);
  td.when(glob.sync(td.matchers.anything())).thenReturn(['./tmp/index.js']);
  describe('#getDirectories', function() {
    const componentDirectories = componentTree.getDirectories();
    it('cover directory', function() {
      expect(td.explain(glob.sync).calls[0].args[0]).to.equal("./tmp/**/*.js");
    });
    it('has ./tmp root directory', function() {
      expect(td.explain(ComponentDirectory).calls[0].args[0]).to.equal('./tmp');
    });
    it('has ./tmp component directory', function() {
      expect(td.explain(ComponentDirectory).calls[0].args[1]).to.equal('./tmp');
    });
  });
  it('#writeRoutes', async function() {
    const componentFile = new ComponentFile();
    td.when(ComponentDirectory.prototype.getFiles()).thenReturn([componentFile]);
    td.when(ComponentRoute.prototype.getRoute()).thenReturn("<Route/>");
    const promise = componentTree.writeRoutes( './tmp/routes.js', mockFs, ComponentRoute).then(() => {
      expect(td.explain(mockFs.writeFile).calls[0].args[0]).to.equal('./tmp/routes.js');
      expect(td.explain(mockFs.writeFile).calls[0].args[1]).to.equal(fs.readFileSync('test/component-tree/golden.js', 'utf8'));
      expect(td.explain(ComponentRoute).calls[0].args[0]).to.equal('./tmp/routes.js');
      expect(td.explain(ComponentRoute).calls[0].args[1]).to.equal(componentFile);
    });
    td.explain(mockFs.writeFile).calls[0].args[2]();
    return promise;
  });
});
