const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const RoutesSetup = require('../src/routes-setup');
const glob = td.func(require('glob'));
const mockFs = td.object(fs);

describe('RoutesSetup', function() {
  describe('routes path in render directory', function() {
    const routesSetup = new RoutesSetup('./tmp', './tmp/routes.js', glob);
    describe('./tmp/index.test.js', function() {
      td.when(glob.sync(td.matchers.anything())).thenReturn(['./tmp/index.js']);
      describe('#getRoutes', function() {
        const routes = routesSetup.getRoutes();
        it('cover render directory', function() {
          expect(td.explain(glob.sync).calls[0].args[0]).to.equal("./tmp/**/*.js");
        });
        it('has one route', function() {
          expect(routes.length).to.equal(1);
        });
        it('has correct import path', function() {
          expect(routes[0].importPath).to.equal("./index.js");
        });
      });
    });
    describe('./tmp/foo/index.js', function() {
      td.when(glob.sync(td.matchers.anything())).thenReturn(['./tmp/foo/index.js']);
      describe('#getRoutes', function() {
        const routes = routesSetup.getRoutes();
        it('has correct import path', function() {
          expect(routes[0].importPath).to.equal("./foo/index.js");
        });
      });
    });
  });
  describe('routes path not in render directory', function() {
    const routesSetup = new RoutesSetup('./render', './tmp/routes.js', glob);
    describe('./render/index.test.js', function() {
      td.when(glob.sync(td.matchers.anything())).thenReturn(['./render/index.js']);
      describe('#getRoutes', function() {
        const routes = routesSetup.getRoutes();
        it('has correct import path', function() {
          expect(routes[0].importPath).to.equal("../render/index.js");
        });
      });
    });
    describe('./render/foo/index.js', function() {
      td.when(glob.sync(td.matchers.anything())).thenReturn(['./render/foo/index.js']);
      describe('#getRoutes', function() {
        const routes = routesSetup.getRoutes();
        it('has correct import path', function() {
          expect(routes[0].importPath).to.equal("../render/foo/index.js");
        });
      });
    });
  });  
  it('#writeJavaScript', async function() {
    const routesSetup = new RoutesSetup('./tmp', './tmp/routes.js', glob);
    td.when(glob.sync(td.matchers.anything())).thenReturn(['./tmp/index.js']);
    const promise = routesSetup.writeJavaScript(mockFs).then(() => {
      expect(td.explain(mockFs.writeFile).calls[0].args[0]).to.equal('./tmp/routes.js');
      expect(td.explain(mockFs.writeFile).calls[0].args[1]).to.equal(fs.readFileSync('test/golden.js', 'utf8'));
    });
    td.explain(mockFs.writeFile).calls[0].args[2]();
    return promise;
  });
});
