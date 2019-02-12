const {expect} = require('chai');
const td = require('testdouble');
const ImageStorage = require('../../../../src/gcp-image-bucket/routine-design-directory/image-storage');
const fs = require('fs');
const randomstring = td.object(require('randomstring'));
const ComponentDirectory = require('../../../../src/routine-design-tree/component-tree/component-directory');
const ComponentFile = td.constructor(require('../../../../src/routine-design-tree/component-tree/component-file'));
const ComponentImage = td.constructor(require('../../../../src/gcp-image-bucket/routine-design-directory/image-storage/component-image'));
const GcpImage = td.constructor(require('../../../../src/gcp-image-bucket/gcp-image'));

describe('gcp-image-bucket/routine-design-directory/ImageStorage', function() {
  td.when(randomstring.generate()).thenReturn('random');
  describe('#getDebugId', function() {
    const MyComponentDirectory = td.constructor(ComponentDirectory);
    const componentDirectory = new MyComponentDirectory();
    const myFs = td.object(fs);
    const imageStorage = 
      new ImageStorage('project-id', 'storage-bucket', componentDirectory, myFs, ComponentImage, randomstring);
    it('returns generated debug ID', function() {
      expect(imageStorage.getDebugId()).to.equal('random');
    });
  });
  describe('can read json file', function() {
    const fsExists = td.object(fs);
    td.when(fsExists.existsSync(td.matchers.anything())).thenReturn(true);
    td.when(fsExists.readFile(td.matchers.anything())).thenCallback(null, '{"index.js":{"id":"random"}}');
    const MyComponentImage = td.constructor(ComponentImage);
    td.when(MyComponentImage.prototype.getId()).thenReturn('random');
    const gcpImage = new GcpImage();
    td.when(MyComponentImage.prototype.createGcpImage()).thenReturn(gcpImage);
    td.when(gcpImage.getUrl()).thenReturn('https://gcp.com');
    const MyComponentDirectory = td.constructor(ComponentDirectory);
    const componentDirectory = new MyComponentDirectory();
    td.when(MyComponentDirectory.prototype.getDirectory()).thenReturn("./tmp");
    td.when(MyComponentDirectory.prototype.getPath()).thenReturn("/");
    const imageStorage = 
      new ImageStorage('project-id', 'storage-bucket', componentDirectory, fsExists, MyComponentImage, randomstring);
    const componentFile = new ComponentFile();
    td.when(MyComponentDirectory.prototype.getFiles()).thenReturn([componentFile]);
    td.when(componentFile.getBasename()).thenReturn('index.js');
    it('#getImages', async function() {
      return imageStorage.getImages().then(function(componentImages) {
        expect(td.explain(MyComponentImage).calls[0].args[0]).to.equal("project-id");
        expect(td.explain(MyComponentImage).calls[0].args[1]).to.equal("storage-bucket");
        expect(td.explain(MyComponentImage).calls[0].args[2]).to.equal("/random");
        expect(td.explain(MyComponentImage).calls[0].args[3]).to.equal(componentDirectory.getFiles()[0]);
        expect(td.explain(MyComponentImage).calls[0].args[4]).to.equal("random");
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
  describe('subdirectory of root directory', function() {
    const fsExists = td.object(fs);
    td.when(fsExists.existsSync(td.matchers.anything())).thenReturn(true);
    td.when(fsExists.readFile(td.matchers.anything())).thenCallback(null, '{"index.js":{"id":"random"}}');
    const MyComponentImage = td.constructor(ComponentImage);
    td.when(MyComponentImage.prototype.getId()).thenReturn('random');
    const gcpImage = new GcpImage();
    td.when(MyComponentImage.prototype.createGcpImage()).thenReturn(gcpImage);
    td.when(gcpImage.getUrl()).thenReturn('https://gcp.com');
    const MyComponentDirectory = td.constructor(ComponentDirectory);
    const componentDirectory = new MyComponentDirectory();
    td.when(MyComponentDirectory.prototype.getDirectory()).thenReturn("./tmp");
    td.when(MyComponentDirectory.prototype.getPath()).thenReturn("/foo");
    const imageStorage = 
      new ImageStorage('project-id', 'storage-bucket', componentDirectory, fsExists, MyComponentImage, randomstring);
    const componentFile = new ComponentFile();
    td.when(MyComponentDirectory.prototype.getFiles()).thenReturn([componentFile]);
    td.when(componentFile.getBasename()).thenReturn('index.js');
    it('#getImages', async function() {
      return imageStorage.getImages().then(function(componentImages) {
        expect(td.explain(MyComponentImage).calls[0].args[2]).to.equal("/foo/random");
      });
    });
  });
  describe('cannot read/write json file', function() {
    const fsDoesNotExist = td.object(fs);
    td.when(fsDoesNotExist.existsSync(td.matchers.anything())).thenReturn(true);
    td.when(fsDoesNotExist.readFile(td.matchers.anything())).thenCallback('error');
    const MyComponentDirectory = td.constructor(ComponentDirectory);
    const componentDirectory = new MyComponentDirectory();
    const MyComponentImage = td.constructor(ComponentImage);
    const imageStorage = 
      new ImageStorage('project-id', 'storage-bucket', componentDirectory, fsDoesNotExist, MyComponentImage, randomstring);
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
