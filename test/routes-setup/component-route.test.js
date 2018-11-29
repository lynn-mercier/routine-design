const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const ComponentRoute = require('../../src/routes-setup/component-route');
const glob = td.func(require('glob'));
const mockFs = td.object(fs);
const ComponentFile = td.constructor(require('../../src/routes-setup/component-file'));

describe('routes-setup/ComponentRoute', function() {
  describe('routes path in render directory', function() {
    describe('./tmp/index.js', function() {
      const componentFile = new ComponentFile();
      td.when(ComponentFile.prototype.getDirname()).thenReturn('./tmp');
      td.when(ComponentFile.prototype.getBasename()).thenReturn('index.js');
      td.when(ComponentFile.prototype.getPath()).thenReturn('');
      const componentRoute = new ComponentRoute('./tmp/routes.js', componentFile);
      describe('#getImportPath', function() {
        const importPath = componentRoute.getImportPath();
        it('is relative to render directory', function() {
          expect(importPath).to.equal("./index.js");
        });
      });
      describe('#getRoute', function() {
        const route = componentRoute.getRoute();
        it('valid Route tag with path and import path', function() {
          expect(route).to.equal("<Route exact path='/' component={require('./index.js').default}/>");
        });
      });
    });
    describe('./tmp/foo/index.js', function() {
      const componentFile = new ComponentFile();
      td.when(ComponentFile.prototype.getDirname()).thenReturn('./tmp/foo');
      td.when(ComponentFile.prototype.getBasename()).thenReturn('index.js');
      const componentRoute = new ComponentRoute('./tmp/routes.js', componentFile);
      describe('#getImportPath', function() {
        const importPath = componentRoute.getImportPath();
        it('is relative to render directory', function() {
          expect(importPath).to.equal("./foo/index.js");
        });
      });
    });
  });
  describe('routes path not in render directory', function() {
    describe('./render/index.js', function() {
      const componentFile = new ComponentFile();
      td.when(ComponentFile.prototype.getDirname()).thenReturn('./render');
      td.when(ComponentFile.prototype.getBasename()).thenReturn('index.js');
      const componentRoute = new ComponentRoute('./tmp/routes.js', componentFile);
      describe('#getImportPath', function() {
        const importPath = componentRoute.getImportPath();
        it('is relative to render directory', function() {
          expect(importPath).to.equal("../render/index.js");
        });
      });
    });
    describe('./render/foo/index.js', function() {
      const componentFile = new ComponentFile();
      td.when(ComponentFile.prototype.getDirname()).thenReturn('./render/foo');
      td.when(ComponentFile.prototype.getBasename()).thenReturn('index.js');
      const componentRoute = new ComponentRoute('./tmp/routes.js', componentFile);
      describe('#getImportPath', function() {
        const importPath = componentRoute.getImportPath();
        it('is relative to render directory', function() {
          expect(importPath).to.equal("../render/foo/index.js");
        });
      });
    });
  });
});
