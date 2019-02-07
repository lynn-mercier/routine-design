const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const ComponentTree = require('../../../src/routine-design-tree/component-tree');
const glob = require('glob');
const mockFs = td.object(fs);
const ComponentDirectory = td.constructor(require('../../../src/routine-design-tree/component-tree/component-directory'));
const ComponentFile = td.constructor(require('../../../src/routine-design-tree/component-tree/component-file'));
const ComponentRoute = td.constructor(require('../../../src/routine-design-tree/component-tree/component-route'));

describe('routine-design-tree/ComponentTree', function() {
  const componentFile = new ComponentFile();
  td.when(ComponentDirectory.prototype.getFiles()).thenReturn([componentFile]);
  td.when(ComponentRoute.prototype.getRoute()).thenReturn("<Route/>");
  describe('one file per directory', function() {
    const singleGlob = td.func(glob);
    const componentTree = new ComponentTree('./tmp', singleGlob, ComponentDirectory);
    td.when(singleGlob.sync(td.matchers.anything())).thenReturn(['./tmp/index.js']);
    describe('#getDirectories', function() {
      const componentDirectories = componentTree.getDirectories();
      it('cover directory', function() {
        expect(td.explain(singleGlob.sync).calls[0].args[0]).to.equal("./tmp/**/*.js");
      });
      it('has ./tmp root directory', function() {
        expect(td.explain(ComponentDirectory).calls[0].args[0]).to.equal('./tmp');
      });
      it('has ./tmp component directory', function() {
        expect(td.explain(ComponentDirectory).calls[0].args[1]).to.equal('./tmp');
      });
      it('one component directory', function() {
        expect(componentDirectories.size).to.equal(1);
      });
      it('can get root directory', function() {
        expect(componentDirectories.get('')).to.not.be.undefined;
      });
    });
    it('#writeRoutes', async function() {
      td.when(mockFs.writeFile(td.matchers.anything(),td.matchers.anything())).thenCallback();
      await componentTree.writeRoutes( './tmp/routes.js', mockFs, ComponentRoute).then(() => {
        expect(td.explain(mockFs.writeFile).calls[0].args[0]).to.equal('./tmp/routes.js');
        expect(td.explain(mockFs.writeFile).calls[0].args[1]).to.equal(fs.readFileSync('test/routine-design-tree/component-tree/golden.js', 'utf8'));
        expect(td.explain(ComponentRoute).calls[0].args[0]).to.equal('./tmp/routes.js');
        expect(td.explain(ComponentRoute).calls[0].args[1]).to.equal(componentFile);
      });
    });
    it('#writeRoutes unsuccessfully', async function() {
      td.when(mockFs.writeFile(td.matchers.anything(),td.matchers.anything())).thenCallback('err');

      let caughtError = false;
      try {
        await componentTree.writeRoutes( './tmp/routes.js', mockFs, ComponentRoute);
      } catch (err) {
        caughtError = true;
      }

      expect(caughtError).to.equal(true);
    });
  });
  describe('more than one file per directory', function() {
    const multiGlob = td.func(glob);
    const componentTree = new ComponentTree('./tmp', multiGlob, ComponentDirectory);
    td.when(multiGlob.sync(td.matchers.anything())).thenReturn(['./tmp/index.js', './tmp/foo.js']);
    describe('#getDirectories', function() {
      const componentDirectories = componentTree.getDirectories();
      it('one component directory', function() {
        expect(componentDirectories.size).to.equal(1);
      });
    });
  });
  describe('sub-directory', function() {
    const multiGlob = td.func(glob);
    const componentTree = new ComponentTree('./tmp', multiGlob, ComponentDirectory);
    td.when(multiGlob.sync(td.matchers.anything())).thenReturn(['./tmp/foo/index.js']);
    describe('#getDirectories', function() {
      const componentDirectories = componentTree.getDirectories();
      it('can get sub-directory', function() {
        expect(componentDirectories.get('foo')).to.not.be.undefined;
      });
    });
  });
});
