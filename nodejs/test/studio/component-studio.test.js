const {expect} = require('chai');
const td = require('testdouble');
const {PNG} = require('pngjs');
const fs = require('fs');
const ComponentStudio = require('../../src/studio/component-studio');
const ComponentFile = td.constructor(require('../../src/routine-design-tree/component-tree/component-file'));
const ComponentImage = require('../../src/image-storage/component-image');
const WebPage = require('../../src/web-page');
const GcpImage = require('../../src/gcp-image');
const PngFactory = require('../../src/studio/png-factory');

describe('studio/ComponentStudio', function() {
  td.when(ComponentFile.prototype.getPath()).thenReturn('path');
  describe('Images are the same', function() {
    const SameWebPage = td.constructor(WebPage);
    const newPng = PNG.sync.read(fs.readFileSync('test/studio/image.png'));
    td.when(SameWebPage.prototype.screenshot()).thenResolve(newPng);
    const oldPng = PNG.sync.read(fs.readFileSync('test/studio/image.png'));
    const SameGcpImage = td.constructor(GcpImage);
    td.when(SameGcpImage.prototype.download()).thenResolve(oldPng);
    describe('ComponentImage has ID', function() {
      const IdComponentImage = td.constructor(ComponentImage);
      td.when(IdComponentImage.prototype.getId()).thenReturn('id');
      const gcpImage = new SameGcpImage();
      td.when(IdComponentImage.prototype.createGcpImage()).thenReturn(gcpImage);
      const MyPngFactory = td.constructor(PngFactory);
      td.when(MyPngFactory.prototype.pixelmatch(td.matchers.anything(),td.matchers.anything(),td.matchers.anything(),td.matchers.anything(),td.matchers.anything(),td.matchers.anything()))
        .thenReturn(0); 
      td.when(MyPngFactory.prototype.createPng(td.matchers.anything())).thenReturn(new PNG());
      const componentStudio = new ComponentStudio(new ComponentFile(), new IdComponentImage(), 'browser', 1234, 3, SameWebPage, MyPngFactory);
      describe('#isImageSet', function() {
        it('image is set', function() {
          expect(componentStudio.isImageSet()).to.equal(true);
        });
      });
      it('#getNewImage', async function() {
        return componentStudio.getNewImage().then((newImage) => {
          expect(td.explain(SameWebPage).calls[0].args[0]).to.equal('browser');
          expect(td.explain(SameWebPage).calls[0].args[1]).to.equal(1234);
          expect(td.explain(SameWebPage).calls[0].args[2]).to.equal('path');
          expect(td.explain(SameWebPage.prototype.waitForResolution).calls[0].args[0]).to.equal(3);
          expect(newImage).to.equal(newPng);
        });
      });
      it('#getNewImage twice', async function() {
        await componentStudio.getNewImage();
        return componentStudio.getNewImage().then((newImage) => {
          expect(td.explain(SameWebPage.prototype.screenshot).calls.length).to.equal(1);
          expect(newImage).to.equal(newPng);
        });
      });
      it('#getOldImage', async function() {
        return componentStudio.getOldImage().then((oldImage) => {
          expect(td.explain(SameGcpImage.prototype.download).calls.length).to.equal(1);
          expect(oldImage).to.equal(oldPng);
        });
      });
      it('#isSame', async function() {
        return componentStudio.isSame().then((isSame) => {
          expect(isSame).to.equal(true);
        });
      });
      it('#diff', async function() {
        return componentStudio.diff().then((pixelDiffCount) => {
          expect(pixelDiffCount).to.equal(0);
          expect(td.explain(MyPngFactory.prototype.createPng).calls[0].args[0].width).to.equal(420);
          expect(td.explain(MyPngFactory.prototype.createPng).calls[0].args[0].height).to.equal(420);
          expect(td.explain(MyPngFactory.prototype.pixelmatch).calls[0].args[0]).to.equal(newPng.data);
          expect(td.explain(MyPngFactory.prototype.pixelmatch).calls[0].args[1]).to.equal(oldPng.data);
          expect(td.explain(MyPngFactory.prototype.pixelmatch).calls[0].args[3]).to.equal(420);
          expect(td.explain(MyPngFactory.prototype.pixelmatch).calls[0].args[4]).to.equal(420);
        });
      });
      it('#saveNewImage', async function() {
        return componentStudio.saveNewImage().then(() => {
          expect(td.explain(IdComponentImage.prototype.saveImage).calls[0].args[0]).to.equal(newPng);
        });
      });
    });
    describe('ComponentImage has no ID', function() {
      const NoIdComponentImage = td.constructor(ComponentImage);
      td.when(NoIdComponentImage.prototype.getId()).thenReturn(undefined);
      const componentStudio = new ComponentStudio(new ComponentFile(), new NoIdComponentImage(), 'browser', 1234, 3);
      describe('#isImageSet', function() {
        it('image is not set', function() {
          expect(componentStudio.isImageSet()).to.equal(false);
        });
      });
      describe('#getOldImage', function() {
        it('throw an error', async function() {
          let caughtError = false;
          try {
            await componentStudio.getOldImage();
          } catch (err) {
            caughtError = true;
          }
          expect(caughtError).to.equal(true);
        });
      });
    });
  });
  describe('Images are not the same', function() {
    const DifferentWebPage = td.constructor(WebPage);
    const newPng = PNG.sync.read(fs.readFileSync('test/studio/image.png'));
    td.when(DifferentWebPage.prototype.screenshot()).thenResolve(newPng);
    const oldPng = PNG.sync.read(fs.readFileSync('test/studio/image2.png'));
    const DifferentGcpImage = td.constructor(GcpImage);
    td.when(DifferentGcpImage.prototype.download()).thenResolve(oldPng);
    describe('ComponentImage has ID', function() {
      const IdComponentImage = td.constructor(ComponentImage);
      td.when(IdComponentImage.prototype.getId()).thenReturn('id');
      const gcpImage = new DifferentGcpImage();
      td.when(IdComponentImage.prototype.createGcpImage()).thenReturn(gcpImage);
      td.when(IdComponentImage.prototype.createGcpDebugImage(td.matchers.anything())).thenReturn(gcpImage);
      const MyPngFactory = td.constructor(PngFactory);
      td.when(MyPngFactory.prototype.pixelmatch(td.matchers.anything(),td.matchers.anything(),td.matchers.anything(),td.matchers.anything(),td.matchers.anything(),td.matchers.anything()))
        .thenReturn(100);
      const diffPng = new PNG();
      td.when(MyPngFactory.prototype.createPng(td.matchers.anything())).thenReturn(diffPng);
      const componentStudio = new ComponentStudio(new ComponentFile(), new IdComponentImage(), 'browser', 1234, 3, DifferentWebPage, MyPngFactory);
      it('#isSame', async function() {
        return componentStudio.isSame().then((isSame) => {
          expect(isSame).to.equal(false);
        });
      });
      it('#diff', async function() {
        return componentStudio.diff().then((pixelDiffCount) => {
          expect(pixelDiffCount).to.equal(100);
          expect(td.explain(IdComponentImage.prototype.createGcpDebugImage).calls[0].args[0]).to.equal("diff.png");
          expect(td.explain(IdComponentImage.prototype.createGcpDebugImage).calls[1].args[0]).to.equal("new.png");
          expect(td.explain(DifferentGcpImage.prototype.upload).calls[0].args[0]).to.equal(diffPng);
          expect(td.explain(DifferentGcpImage.prototype.upload).calls[1].args[0]).to.equal(newPng);
        });
      });
    });
  });
});
