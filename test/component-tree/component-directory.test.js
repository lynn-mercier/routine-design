const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const ComponentDirectory = require('../../src/component-tree/component-directory');
const glob = td.func(require('glob'));
const mockFs = td.object(fs);
const ComponentFile = td.constructor(require('../../src/component-tree/component-file'));

describe('component-tree/ComponentDirectory', function() {
  const componentDirectory = new ComponentDirectory('./tmp', './tmp', glob, ComponentFile);
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
});
