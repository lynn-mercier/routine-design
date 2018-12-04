const {expect} = require('chai');
const td = require('testdouble');
const LocalImage = require('../src/local-image');
const randomstring = td.object(require('randomstring'));
const fs = require('fs');
const path = td.object(require('path'));
const pngSync = td.object(require('pngjs').PNG.sync);
const LocalDirectory = td.constructor(require('../src/local-directory'));

describe('LocalImage', function() {
  describe('image exists', function() {
    td.when(LocalDirectory.prototype.getFullPath()).thenReturn('images');
    td.when(randomstring.generate()).thenReturn('random');
    const fsExits = td.object(fs);
    td.when(path.join(td.matchers.anything(), td.matchers.anything())).thenReturn('images/random.png');
    const localImage = new LocalImage(LocalDirectory, path, randomstring, pngSync, fsExits);
    it('creates local directory', function() {
      expect(td.explain(LocalDirectory).calls[0].args[0]).to.equal('images');
    });
    it('join local directory with image name', function() {
      expect(td.explain(path.join).calls[0].args[0]).to.equal('images');
      expect(td.explain(path.join).calls[0].args[1]).to.equal('random.png');
    });
    describe('#getPath', function() {
      const path = localImage.getPath();
      it('returns path to local directory', function() {
        expect(path).to.equal('images/random.png');
      });
    });
    it('#getPng', async function() {
      td.when(pngSync.read(td.matchers.anything())).thenReturn('png');
      const pngPromise = localImage.getPng().then(function(png) {
        expect(png).to.equal('png');
        expect(td.explain(fsExits.readFile).calls[0].args[0]).to.equal('images/random.png');
        expect(td.explain(pngSync.read).calls[0].args[0]).to.equal('buffer');
      });
      td.explain(fsExits.readFile).calls[0].args[1](null, 'buffer');
      return pngPromise;
    });
    it('#write', async function() {
      td.when(pngSync.write(td.matchers.anything())).thenReturn('buffer');
      td.when(fsExits.writeFile(td.matchers.anything(), td.matchers.anything())).thenCallback();
      td.when(LocalDirectory.prototype.create).thenResolve();
      return localImage.write('png').then(function() {
        expect(td.explain(LocalDirectory.prototype.create).calls.length).to.equal(1);
        expect(td.explain(pngSync.write).calls[0].args[0]).to.equal('png');
        expect(td.explain(fsExits.writeFile).calls[0].args[0]).to.equal('images/random.png');
        expect(td.explain(fsExits.writeFile).calls[0].args[1]).to.equal('buffer');
      });
    });
    it('#delete', async function() {
      const promise = localImage.delete().then(function() {
        expect(td.explain(fsExits.unlink).calls[0].args[0]).to.equal('images/random.png');
      });
      td.explain(fsExits.unlink).calls[0].args[1]();
      return promise;
    });
  });
  describe('image does not exist', function() {
    td.when(LocalDirectory.prototype.getFullPath()).thenReturn('images');
    td.when(path.join(td.matchers.anything(), td.matchers.anything())).thenReturn('images/random.png');
    const fsDoesNotExist = td.object(fs);
    const localImage = new LocalImage(LocalDirectory, path, randomstring, pngSync, fsDoesNotExist);
    it('#getPng unsuccessfully', async function() {
      td.when(fsDoesNotExist.readFile(td.matchers.anything())).thenCallback('error', 'buffer');

      let caughtError = false;
      try {
        await localImage.getPng();
      } catch(error) {
        caughtError = true;
      }
      expect(caughtError).to.equal(true);
    });
    it('#write unsuccessfully', async function() {
      td.when(fsDoesNotExist.writeFile(td.matchers.anything(), td.matchers.anything())).thenCallback('error');

      let caughtError = false;
      try {
        await localImage.write('png');
      } catch (error) {
        caughtError = true;
      };
      expect(caughtError).to.equal(true);
    });
    it('#delete unsuccessfully', async function() {
      td.when(fsDoesNotExist.unlink(td.matchers.anything())).thenCallback('error');

      let caughtError = false;
      try {
        await localImage.delete();
      } catch (error) {
        caughtError = true;
      };
      expect(caughtError).to.equal(true);
    });
  });
});
