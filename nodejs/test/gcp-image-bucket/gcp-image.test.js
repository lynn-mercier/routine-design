const {expect} = require('chai');
const td = require('testdouble');
const GcpImage = require('../../src/gcp-image-bucket/gcp-image');
const LocalStorage = require('../../src/local-storage');
const LocalImage = require('../../src/local-storage/local-image');
const Storage = td.constructor(require('@google-cloud/storage').Storage);

describe('gcp-image-bucket/GcpImage', function() {
  const storageBucket = td.object({
    upload: () => {},
    file: () => {}
  });
  td.when(Storage.prototype.bucket(td.matchers.anything())).thenReturn(storageBucket);
  describe('#getUrl', function() {
    const gcpImage = new GcpImage('project-id', 'storage-bucket-name', 'foo.png', Storage, td.constructor(LocalStorage));
    it('url includes storage bucket and GCP path', function() {
      expect(gcpImage.getUrl()).to.equal("https://storage.googleapis.com/storage-bucket-name/foo.png");
    });
  });
  it('#upload', async function() {
    const UploadLocalStorage = td.constructor(LocalStorage);
    const UploadLocalImage = td.constructor(LocalImage);
    const uploadLocalImage = new UploadLocalImage();
    td.when(UploadLocalStorage.prototype.createLocalImage()).thenReturn(uploadLocalImage);
    const gcpImage = new GcpImage('project-id', 'storage-bucket-name', 'foo.png', Storage, UploadLocalStorage);
    td.when(UploadLocalImage.prototype.getPath()).thenReturn('local.png');
    const promise = gcpImage.upload('png').then(function() {
      expect(td.explain(Storage.prototype.bucket).calls[0].args[0]).to.equal('storage-bucket-name');
      expect(td.explain(UploadLocalImage.prototype.write).calls[0].args[0]).to.equal('png');
      expect(td.explain(storageBucket.upload).calls[0].args[0]).to.equal('local.png');
      expect(td.explain(storageBucket.upload).calls[0].args[1]).to.deep.equal({destination: 'foo.png'});
      expect(td.explain(UploadLocalImage.prototype.delete).calls.length).to.equal(1);
    });
    return promise
  });
  it('#download', async function() {
    const DownloadLocalStorage = td.constructor(LocalStorage);
    const DownloadLocalImage = td.constructor(LocalImage);
    const downloadLocalImage = new DownloadLocalImage();
    td.when(DownloadLocalStorage.prototype.createLocalImage()).thenReturn(downloadLocalImage);
    const gcpImage = new GcpImage('project-id', 'storage-bucket-name', 'foo.png', Storage, DownloadLocalStorage);
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
    const NoDownloadLocalStorage = td.constructor(LocalStorage);
    const NoDownloadLocalImage = td.constructor(LocalImage);
    const noDownloadLocalImage = new NoDownloadLocalImage();
    td.when(NoDownloadLocalStorage.prototype.createLocalImage()).thenReturn(noDownloadLocalImage);
    const gcpImage = new GcpImage('project-id', 'storage-bucket-name', 'foo.png', Storage, NoDownloadLocalStorage);
    const gcpFile = td.object({
      download: () => {}
    });
    td.when(storageBucket.file(td.matchers.anything())).thenReturn(gcpFile);
    td.when(NoDownloadLocalImage.prototype.getPath()).thenReturn('local.png');
    td.when(gcpFile.download(td.matchers.anything())).thenReject('error');

    let caughtError = false;
    try {
      await gcpImage.download();
    } catch (error) {
      expect(error).to.equal('error');
      caughtError = true;
    }
    expect(caughtError).to.equal(true);
  });
});
