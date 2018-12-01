const {expect} = require('chai');
const td = require('testdouble');
const ImageStorage = require('../../src/image-storage');
const fs = require('fs');
const ComponentDirectory = td.constructor(require('../../src/component-tree/component-directory'));
const ComponentFile = td.constructor(require('../../src/component-tree/component-file'));
const ComponentImage = td.constructor(require('../../src/image-storage/component-image'));
const GcpImage = td.constructor(require('../../src/gcp-image'));

describe('ImageStorage', function() {
  describe('can read json file', function() {
    const fsExists = td.object(fs);
    td.when(fsExists.existsSync(td.matchers.anything())).thenReturn(true);
    td.when(fsExists.readFile(td.matchers.anything())).thenCallback(null, '{"index.js":{"id":"random"}}');
    td.when(ComponentImage.prototype.getId()).thenReturn('random');
    const gcpImage = new GcpImage();
    td.when(ComponentImage.prototype.createGcpImage()).thenReturn(gcpImage);
    td.when(gcpImage.getUrl()).thenReturn('https://gcp.com');
    const componentDirectory = new ComponentDirectory();
    const imageStorage = 
      new ImageStorage('storage', 'storage-bucket', componentDirectory, fsExists, ComponentImage);
    const componentFile = new ComponentFile();
    td.when(componentDirectory.getDirectory()).thenReturn("./tmp");
    td.when(componentDirectory.getFiles()).thenReturn([componentFile]);
    td.when(componentFile.getBasename()).thenReturn('index.js');
    it('#getImages', async function() {
      return imageStorage.getImages().then(function(componentImages) {
        expect(td.explain(ComponentImage).calls[0].args[0]).to.equal("storage");
        expect(td.explain(ComponentImage).calls[0].args[1]).to.equal("storage-bucket");
        expect(td.explain(ComponentImage).calls[0].args[2]).to.equal(componentDirectory.getFiles()[0]);
        expect(td.explain(ComponentImage).calls[0].args[3]).to.equal("random");
        expect(td.explain(fsExists.readFile).calls[0].args[0]).to.equal('./tmp/image.json');
        expect(componentImages.length).to.equal(1);
      });
    });
    it('#getImages twice', async function() {
      return imageStorage.getImages().then(function() {
        expect(td.explain(fsExists.readFile).calls.length).to.equal(1);
      });
    });
    it('#save', async function() {
      td.when(fsExists.writeFile(td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenCallback();
      return imageStorage.save().then(function() {
        expect(td.explain(fsExists.writeFile).calls[0].args[0]).to.equal('./tmp/image.json');
        expect(td.explain(fsExists.writeFile).calls[0].args[1]).to.equal('{\n  "index.js": {\n    "id": "random",\n    "url": "https://gcp.com"\n  }\n}');
      });
    });
  });
  describe('cannot read/write json file', function() {
    const fsDoesNotExist = td.object(fs);
    td.when(fsDoesNotExist.existsSync(td.matchers.anything())).thenReturn(true);
    td.when(fsDoesNotExist.readFile(td.matchers.anything())).thenCallback('error');
    const componentDirectory = new ComponentDirectory();
    const imageStorage = 
      new ImageStorage('storage', 'storage-bucket', componentDirectory, fsDoesNotExist, ComponentImage);
    it('#getImages', async function() {
      td.when(fsDoesNotExist.readFile(td.matchers.anything())).thenCallback('error');

      let caughtError = false;
      try {
        await imageStorage.getImages();
      } catch (error) {
        caughtError = true;
      };
      expect(caughtError).to.equal(true);
    });
    it('#save', async function() {
      td.when(fsDoesNotExist.writeFile(td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenCallback('error');

      let caughtError = false;
      try {
        await imageStorage.save();
      } catch (error) {
        caughtError = true;
      };
      expect(caughtError).to.equal(true);
    });
  });
});
