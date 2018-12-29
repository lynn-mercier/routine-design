const {expect} = require('chai');
const td = require('testdouble');
const Studio = require('../../src/studio');
const ComponentDirectory = td.constructor(require('../../src/component-tree/component-directory'));
const ComponentFile = td.constructor(require('../../src/component-tree/component-file'));
const ImageStorage = td.constructor(require('../../src/image-storage'));
const ComponentImage = td.constructor(require('../../src/image-storage/component-image'));
const puppeteer = td.object(require('puppeteer'));
const ComponentStudio = td.constructor(require('../../src/studio/component-studio'));

describe('Studio', function() {
  const componentFile = new ComponentFile();
  td.when(ComponentDirectory.prototype.getFiles()).thenReturn([componentFile]);
  const componentImage = new ComponentImage();
  td.when(ImageStorage.prototype.getImages()).thenReturn([componentImage]);
  const mockBrowser = td.object();
  td.when(puppeteer.launch()).thenResolve(mockBrowser);
  const componentDirectory = new ComponentDirectory();
  const studio = new Studio('project-id', 'storage-bucket', componentDirectory, 1234, 3, ImageStorage, puppeteer);
  it('stores images in the GCP project', function() {
    expect(td.explain(ImageStorage).calls[0].args[0]).to.equal('project-id');
  });
  it('stores images in the GCP storage bucket', function() {
    expect(td.explain(ImageStorage).calls[0].args[1]).to.equal('storage-bucket');
  });
  it('connected to images.json', function() {
    expect(td.explain(ImageStorage).calls[0].args[2]).to.equal(componentDirectory);
  });
  it('#getComponentImages', async function() {
    return studio.getComponentImages().then(function(componentImages) {
      expect(componentImages.length).to.equal(1);
      expect(componentImages[0]).to.equal(componentImage);
    });
  });
  it('#getBrowser', async function() {
    return studio.getBrowser().then(function(actualBrowser) {
      expect(actualBrowser).to.equal(mockBrowser);
    });
  });
  describe('#getComponentCount', function() {
    expect(studio.getComponentCount()).to.equal(1);
  });
  it('#getComponent', async function() {
    return studio.getComponent(0, ComponentStudio).then(function() {
      expect(td.explain(ComponentStudio).calls[0].args[0]).to.equal(componentFile);
      expect(td.explain(ComponentStudio).calls[0].args[1]).to.equal(componentImage);
      expect(td.explain(ComponentStudio).calls[0].args[2]).to.equal(mockBrowser);
      expect(td.explain(ComponentStudio).calls[0].args[3]).to.equal(1234);
      expect(td.explain(ComponentStudio).calls[0].args[4]).to.equal(3);
    });
  });
  it('#save', async function() {
    return studio.save().then(function() {
      expect(td.explain(ImageStorage.prototype.save).calls.length).to.equal(1);
    });
  });
  it('#cleanup', async function() {
    return studio.cleanup().then(function() {
      expect(td.explain(mockBrowser.close).calls.length).to.equal(1);
    });
  });
});
