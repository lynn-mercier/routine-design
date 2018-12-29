const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const ComponentFile = require('../../src/component-tree/component-file');
const glob = td.func(require('glob'));
const mockFs = td.object(fs);

describe('component-tree/ComponentFile', function() {
  describe('./tmp/index.js', function() {
    const componentFile = new ComponentFile('./tmp', './tmp/index.js');
    describe('#getPath', function() {
      const path = componentFile.getPath();
      it('has empty path', function() {
        expect(path).to.equal("");
      });
      it('returns basename', function() {
        expect(componentFile.getBasename()).to.equal("index.js");
      });
      it('returns dirname', function() {
        expect(componentFile.getDirname()).to.equal("./tmp");
      });
    });
  });
  describe('./tmp/foo.js', function() {
    const componentFile = new ComponentFile('./tmp', './tmp/foo.js');
    describe('#getPath', function() {
      const path = componentFile.getPath();
      it('appends foo to path', function() {
        expect(path).to.equal("foo");
      });
    });
  });
  describe('./tmp/foo/index.js', function() {
    const componentFile = new ComponentFile('./tmp', './tmp/foo/index.js');
    describe('#getPath', function() {
      const path = componentFile.getPath();
      it('has foo for path', function() {
        expect(path).to.equal("foo");
      });
    });
  });
});
