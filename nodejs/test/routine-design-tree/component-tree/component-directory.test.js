const {expect} = require('chai');
const td = require('testdouble');
const ComponentDirectory = require('../../../src/routine-design-tree/component-tree/component-directory');
const glob = td.func(require('glob'));
const ComponentFile = td.constructor(require('../../../src/routine-design-tree/component-tree/component-file'));

describe('routine-design-tree/component-tree/ComponentDirectory', function() {
  td.when(ComponentFile.prototype.getBasename()).thenReturn('index.js');
  describe('root directory', function() {
    const componentDirectory = 
      new ComponentDirectory('./tmp', './tmp', glob, ComponentFile);
    td.when(glob.sync(td.matchers.anything())).thenReturn(['./tmp/index.js']);
    describe('#getFiles', function() {
      const componentFiles = componentDirectory.getFiles();
      it('cover directory', function() {
        expect(td.explain(glob.sync).calls[0].args[0]).to.equal("./tmp/*.js");
      });
      it('has one component file', function() {
        expect(componentFiles.length).to.equal(1);
      });
    });
    describe('#getFiles twice', function() {
      const componentFiles = componentDirectory.getFiles();
      it('does not scrap directory again', function() {
        expect(td.explain(glob.sync).calls.length).to.equal(1);
      });
    });
    describe('#getPath', function() {
      it('relative to root directory', function() {
        expect(componentDirectory.getPath()).to.equal("");
      });
    });
  });
  describe('subdirectory', function() {
    const componentDirectory = 
      new ComponentDirectory('./tmp', './tmp/foo', glob, ComponentFile);
    describe('#getPath', function() {
      it('relative to root directory', function() {
        expect(componentDirectory.getPath()).to.equal("foo");
      });
    });
  });
});
