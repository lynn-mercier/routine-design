const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const ComponentFile = require('../../src/routes-setup/component-file');
const glob = td.func(require('glob'));
const mockFs = td.object(fs);

describe('ComponentFile', function() {
  describe('routes path in render directory', function() {
    describe('./tmp/index.js', function() {
      const componentFile = new ComponentFile('./tmp', './tmp/routes.js', './tmp/index.js');
      describe('#getImportPath', function() {
        const importPath = componentFile.getImportPath();
        it('is relative to render directory', function() {
          expect(importPath).to.equal("./index.js");
        });
      });
      describe('#getPath', function() {
        const path = componentFile.getPath();
        it('has empty path', function() {
          expect(path).to.equal("");
        });
      }); 
      describe('#getRoute', function() {
        const route = componentFile.getRoute();
        it('has foo for path', function() {
          expect(route).to.equal("<Route exact path='/' component={require('./index.js').default}/>");
        });
      });
    });
    describe('./tmp/foo.js', function() {
      const componentFile = new ComponentFile('./tmp', './tmp/routes.js', './tmp/foo.js');
      describe('#getPath', function() {
        const path = componentFile.getPath();
        it('appends foo to path', function() {
          expect(path).to.equal("foo");
        });
      });
    });
    describe('./tmp/foo/index.js', function() {
      const componentFile = new ComponentFile('./tmp', './tmp/routes.js', './tmp/foo/index.js');
      describe('#getImportPath', function() {
        const importPath = componentFile.getImportPath();
        it('is relative to render directory', function() {
          expect(importPath).to.equal("./foo/index.js");
        });
      });
      describe('#getPath', function() {
        const path = componentFile.getPath();
        it('has foo for path', function() {
          expect(path).to.equal("foo");
        });
      });
    });
  });
  describe('routes path not in render directory', function() {
    describe('./render/index.js', function() {
      const componentFile = new ComponentFile('./render', './tmp/routes.js', './render/index.js');
      describe('#getImportPath', function() {
        const importPath = componentFile.getImportPath();
        it('is relative to render directory', function() {
          expect(importPath).to.equal("../render/index.js");
        });
      });
      describe('#getPath', function() {
        const path = componentFile.getPath();
        it('has empty path', function() {
          expect(path).to.equal("");
        });
      });
    });
    describe('./tmp/foo.js', function() {
      const componentFile = new ComponentFile('./render', './tmp/routes.js', './render/foo.js');
      describe('#getPath', function() {
        const path = componentFile.getPath();
        it('has foo for path', function() {
          expect(path).to.equal("foo");
        });
      });
    });
    describe('./render/foo/index.js', function() {
      const componentFile = new ComponentFile('./render', './tmp/routes.js', './render/foo/index.js');
      describe('#getImportPath', function() {
        const importPath = componentFile.getImportPath();
        it('is relative to render directory', function() {
          expect(importPath).to.equal("../render/foo/index.js");
        });
      });
      describe('#getPath', function() {
        const path = componentFile.getPath();
        it('has foo for path', function() {
          expect(path).to.equal("foo");
        });
      });
    });
  });
});
