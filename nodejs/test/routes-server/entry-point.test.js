const {expect} = require('chai');
const fs = require('fs');
const td = require('testdouble');
const mockFs = td.object(fs);
const EntryPoint = require('../../src/routes-server/entry-point');

describe('routes-server/EntryPoint', function() {
  //TODO make tmp dir
  const entryPoint = new EntryPoint("foo");    
  it('#write(routesPath, webpackDir, javaScriptPath)', async function() {
    const promise = entryPoint.write('./tmp', './tmp/routes.js', './tmp/index.js', mockFs).then(() => {
      expect(td.explain(mockFs.writeFile).calls[0].args[0]).to.equal('tmp/index.scss');
      expect(td.explain(mockFs.writeFile).calls[0].args[1]).to.equal("");
      expect(td.explain(mockFs.writeFile).calls[1].args[0]).to.equal('./tmp/index.js');
      expect(td.explain(mockFs.writeFile).calls[1].args[1]).to.equal(fs.readFileSync('test/routes-server/golden.js', 'utf8'));
    });
    td.explain(mockFs.writeFile).calls[1].args[2]();
    return promise;
  });
  describe('#getDiv', function() {
    it('use javaScriptPath when creating config', function() {
      expect(entryPoint.getDiv()).to.equal("<div id='foo'></div>");
    });
  });
});
