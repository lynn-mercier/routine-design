const {expect} = require('chai');
const td = require('testdouble');
const LocalDirectory = require('../src/local-directory');
const rimraf = td.func(require('rimraf').default);
const fs = td.object(require('fs'));
const path = td.object(require('path'));

describe('LocalDirectory', function() {
  const localDirectory = new LocalDirectory('subpath');
  td.when(path.join(td.matchers.anything(), td.matchers.anything())).thenReturn('routine-design-output/subpath');
  describe('#getFullPath', function() {
    const fullPath = localDirectory.getFullPath();
    it('joins with routine design output directory', function() {
      expect(td.explain(path.join).calls[0].args[0]).to.equal('routine-design-output');
    });
    it('joins with subpath', function() {
      expect(td.explain(path.join).calls[0].args[1]).to.equal('subpath');
    });
    it('returns valid path', function() {
      expect(fullPath).to.equal('routine-design-output/subpath');
    });
  });
  it('#empty', async function() {
    const promise = localDirectory.empty(path, rimraf, fs).then(() => {
      expect(td.explain(rimraf).calls[0].args[0]).to.deep.equal('routine-design-output/subpath');
      expect(td.explain(fs.mkdirSync).calls[0].args[0]).to.deep.equal('routine-design-output/subpath');
    })
    td.explain(rimraf).calls[0].args[1]();
    return promise;
  });
});
