const {expect} = require('chai');
const td = require('testdouble');
const ImageStorage = require('../../src/image-storage');
const fs = td.object(require('fs'));
const ComponentDirectory = td.constructor(require('../../src/component-tree/component-directory'));
const ComponentFile = td.constructor(require('../../src/component-tree/component-file'));
const ComponentImage = td.constructor(require('../../src/image-storage/component-image'));
const GcpImage = td.constructor(require('../../src/gcp-image'));

describe('ImageStorage', function() {
  td.when(fs.existsSync(td.matchers.anything())).thenReturn(true);
  td.when(fs.readFileSync(td.matchers.anything())).thenReturn('{"index.js":{"id":"random"}}');
  td.when(ComponentImage.prototype.getId()).thenReturn('random');
  const gcpImage = new GcpImage();
  td.when(ComponentImage.prototype.createGcpImage()).thenReturn(gcpImage);
  td.when(gcpImage.getUrl()).thenReturn('https://gcp.com');
  const componentDirectory = new ComponentDirectory();
  const imageStorage = 
    new ImageStorage('storage', 'storage-bucket', componentDirectory, fs, ComponentImage);
  const componentFile = new ComponentFile();
  td.when(componentDirectory.getDirectory()).thenReturn("./tmp");
  td.when(componentDirectory.getFiles()).thenReturn([componentFile]);
  td.when(componentFile.getBasename()).thenReturn('index.js');
  describe('#getImages', function() {
    const componentImages = imageStorage.getImages();
    it('uses storage bucket', function() {
      expect(td.explain(ComponentImage).calls[0].args[0]).to.equal("storage");
      expect(td.explain(ComponentImage).calls[0].args[1]).to.equal("storage-bucket");
    });
    it('matches component file at same index', function() {
      expect(td.explain(ComponentImage).calls[0].args[2]).to.equal(componentDirectory.getFiles()[0]);
    });
    it('has GCP ID from JSON file', function() {
      expect(td.explain(ComponentImage).calls[0].args[3]).to.equal("random");
    });
    it('has one component image', function() {
      expect(componentImages.length).to.equal(1);
    });
  });
  describe('#getImages twice', function() {
    const componentImages = imageStorage.getImages();
    it('does not scrap directory again', function() {
      expect(td.explain(fs.readFileSync).calls.length).to.equal(1);
    });
  });
  describe('#save', function() {
    imageStorage.save();
    it('writes to image.json', function() {
      expect(td.explain(fs.writeFileSync).calls[0].args[0]).to.equal('./tmp/image.json');
    });
    it('writes JSON file', function() {
      expect(td.explain(fs.writeFileSync).calls[0].args[1]).to.equal('{\n  "index.js": {\n    "id": "random",\n    "url": "https://gcp.com"\n  }\n}');
    });
  })
});
