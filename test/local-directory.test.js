const {expect} = require('chai');
const td = require('testdouble');
const LocalDirectory = require('../src/local-directory');
const rimraf = td.func(require('rimraf').default);
const fs = require('fs');
const path = td.object(require('path'));

describe('LocalDirectory', function() {
  describe('directory exists', function() {
    const fsExists = td.object(fs);
    td.when(fsExists.existsSync(td.matchers.anything())).thenReturn(true);
    const localDirectory = new LocalDirectory('subpath', path, fsExists);
    it('does not creates directory', function() {
      expect(td.explain(fsExists.existsSync).calls[0].args[0]).to.equal('routine-design-output');
      expect(td.explain(fsExists.mkdirSync).calls.length).to.equal(0);
    });
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
      const promise = localDirectory.empty(rimraf).then(() => {
        expect(td.explain(rimraf).calls[0].args[0]).to.deep.equal('routine-design-output/subpath');
        expect(td.explain(fsExists.mkdirSync).calls[0].args[0]).to.deep.equal('routine-design-output/subpath');
      })
      td.explain(rimraf).calls[0].args[1]();
      return promise;
    });
  });
  describe('directory does not exist', function() {
    const fsDoestNotExist = td.object(fs);
    td.when(fsDoestNotExist.existsSync(td.matchers.anything())).thenReturn(false);
    const localDirectory = new LocalDirectory('subpath', path, fsDoestNotExist);
    it('creates directory', function() {
      expect(td.explain(fsDoestNotExist.mkdirSync).calls[0].args[0]).to.equal('routine-design-output');
    });
  });
});
