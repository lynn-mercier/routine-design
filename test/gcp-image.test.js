const {expect} = require('chai');
const td = require('testdouble');
const GcpImage = require('../src/gcp-image');
const LocalImage = require('../src/local-image');
const PNG = td.constructor(require('pngjs').PNG);

describe('GcpImage', function() {
  const storageBucket = td.object({
    upload: () => {},
    file: () => {}
  });
  it('#upload', async function() {
    const UploadLocalImage = td.constructor(LocalImage);
    const gcpImage = new GcpImage(storageBucket, 'foo.png', UploadLocalImage);
    td.when(UploadLocalImage.prototype.getPath()).thenReturn('local.png');
    const promise = gcpImage.upload('png').then(function() {
      expect(td.explain(UploadLocalImage.prototype.write).calls[0].args[0]).to.equal('png');
      expect(td.explain(storageBucket.upload).calls[0].args[0]).to.equal('local.png');
      expect(td.explain(storageBucket.upload).calls[0].args[1]).to.deep.equal({destination: 'foo.png'});
      expect(td.explain(UploadLocalImage.prototype.delete).calls.length).to.equal(1);
    });
    return promise
  });
  it('#download', async function() {
    const DownloadLocalImage = td.constructor(LocalImage);
    const gcpImage = new GcpImage(storageBucket, 'foo.png', DownloadLocalImage);
    const gcpFile = td.object({
      download: () => {}
    });
    td.when(storageBucket.file(td.matchers.anything())).thenReturn(gcpFile);
    td.when(DownloadLocalImage.prototype.getPath()).thenReturn('local.png');
    td.when(DownloadLocalImage.prototype.getPng()).thenReturn('png');
    const png = await gcpImage.download();
    expect(td.explain(storageBucket.file).calls[0].args[0]).to.equal('foo.png');
    expect(td.explain(gcpFile.download).calls[0].args[0]).to.deep.equal({destination: 'local.png'});
    expect(td.explain(DownloadLocalImage.prototype.delete).calls.length).to.equal(1);
    expect(png).to.equal('png');
  });
  it('#download fails', async function() {
    const NoDownloadLocalImage = td.constructor(LocalImage);
    const gcpImage = new GcpImage(storageBucket, 'foo.png', NoDownloadLocalImage);
    const gcpFile = td.object({
      download: () => {}
    });
    td.when(storageBucket.file(td.matchers.anything())).thenReturn(gcpFile);
    td.when(NoDownloadLocalImage.prototype.getPath()).thenReturn('local.png');
    td.when(gcpFile.download(td.matchers.anything())).thenReject('error');

    let caughtError = false;
    try {
      await gcpImage.download(PNG);
    } catch (error) {
      expect(error).to.equal('error');
      caughtError = true;
    }
    expect(caughtError).to.equal(true);
  });
});
