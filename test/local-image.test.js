const {expect} = require('chai');
const td = require('testdouble');
const LocalImage = require('../src/local-image');
const randomstring = td.object(require('randomstring'));
const fs = td.object(require('fs'));
const path = td.object(require('path'));
const pngSync = td.object(require('pngjs').PNG.sync);
const LocalDirectory = td.constructor(require('../src/local-directory'));

describe('LocalImage', function() {
  td.when(LocalDirectory.prototype.getFullPath()).thenReturn('images');
  td.when(randomstring.generate()).thenReturn('random');
  td.when(path.join(td.matchers.anything(), td.matchers.anything())).thenReturn('images/random.png');
  const localImage = new LocalImage(LocalDirectory, path, randomstring, pngSync, fs);
  it('creates local directory', function() {
    expect(td.explain(LocalDirectory).calls[0].args[0]).to.equal('images');
    expect(td.explain(LocalDirectory.prototype.create).calls.length).to.equal(1);
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
  describe('#getPng', function() {
    td.when(fs.readFileSync(td.matchers.anything())).thenReturn('buffer');
    td.when(pngSync.read(td.matchers.anything())).thenReturn('png');
    const png = localImage.getPng();
    it('returns a png', function() {
      expect(png).to.equal('png');
    });
    it('reads the data from the local file', function() {
      expect(td.explain(pngSync.read).calls[0].args[0]).to.equal('buffer');
    });
  });
  describe('#write', function() {
    td.when(pngSync.write(td.matchers.anything())).thenReturn('buffer');
    localImage.write('png');
    it('writes the data to a buffer', function() {
      expect(td.explain(pngSync.write).calls[0].args[0]).to.equal('png');
    });
    it('writes the buffer to the local file', function() {
      expect(td.explain(fs.writeFileSync).calls[0].args[0]).to.equal('images/random.png');
      expect(td.explain(fs.writeFileSync).calls[0].args[1]).to.equal('buffer');
    });
  });
  it('#delete', async function() {
    const promise = localImage.delete().then(function() {
      expect(td.explain(fs.unlink).calls[0].args[0]).to.equal('images/random.png');
    });
    td.explain(fs.unlink).calls[0].args[1]();
    return promise;
  });
  it('#delete unsuccessfully', function() {
    try {
      localImage.delete();
      td.explain(fs.unlink).calls[0].args[1]('error');
    } catch (error) {
      expect(error).to.equal('error');
    };
  });
});
