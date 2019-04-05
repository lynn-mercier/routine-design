const {expect} = require('chai');
const td = require('testdouble');
const ScreenshotCollection = require('../../../src/gcp-image-bucket/routine-design-directory/screenshot-collection');
const ComponentDirectory = td.constructor(require('../../../src/routine-design-tree/component-tree/component-directory'));
const Studio = require('../../../src/gcp-image-bucket/routine-design-directory/studio');
const ComponentStudio = require('../../../src/gcp-image-bucket/routine-design-directory/studio/component-studio');

describe('gcp-image-bucket/routine-design-directory/ScreenshotCollection', function() {
  const componentDirectory = new ComponentDirectory();
  describe('image is not set', function() {
    const NotSetStudio = td.constructor(Studio);
    td.when(NotSetStudio.prototype.getComponentCount()).thenReturn(1);
    td.when(NotSetStudio.prototype.getDebugId()).thenReturn('studio-debug-id');
    const NotSetComponentStudio = td.constructor(ComponentStudio);
    const componentStudio = new NotSetComponentStudio();
    td.when(NotSetStudio.prototype.getComponent(td.matchers.anything())).thenReturn(componentStudio);
    td.when(NotSetComponentStudio.prototype.isImageSet()).thenReturn(false);
    const screenshotCollection =
      new ScreenshotCollection('project-id', 'screenshot-bucket', componentDirectory, 1234, 3, NotSetStudio);
    it('#init', async function() {
      return screenshotCollection.init().then(function() {
        expect(td.explain(NotSetStudio.prototype.init).calls.length).to.equal(1);
      })
    });
    it('#capture', async function() {
      return screenshotCollection.capture().then(function() {
        expect(td.explain(NotSetStudio).calls[0].args[0]).to.equal('project-id');
        expect(td.explain(NotSetStudio).calls[0].args[1]).to.equal('screenshot-bucket');
        expect(td.explain(NotSetStudio).calls[0].args[2]).to.equal(componentDirectory);
        expect(td.explain(NotSetStudio).calls[0].args[3]).to.equal(1234);
        expect(td.explain(NotSetStudio).calls[0].args[4]).to.equal(3);
        expect(td.explain(NotSetStudio.prototype.getComponent).calls[0].args[0]).to.equal(0);
        expect(td.explain(NotSetComponentStudio.prototype.saveNewImage).calls.length).to.equal(1);
        expect(td.explain(NotSetStudio.prototype.save).calls.length).to.equal(1);
      })
    });
    it('#pixelValidate', async function() {
      return screenshotCollection.pixelValidate().then(function(result) {
        expect(result.allPass).to.equal(false);
        expect(result.debugId).to.equal('studio-debug-id');
        expect(td.explain(NotSetStudio).calls[0].args[0]).to.equal('project-id');
        expect(td.explain(NotSetStudio).calls[0].args[1]).to.equal('screenshot-bucket');
        expect(td.explain(NotSetStudio).calls[0].args[2]).to.equal(componentDirectory);
        expect(td.explain(NotSetStudio).calls[0].args[3]).to.equal(1234);
        expect(td.explain(NotSetStudio).calls[0].args[4]).to.equal(3);
        expect(td.explain(NotSetStudio.prototype.getComponent).calls[0].args[0]).to.equal(0);
      })
    });
    it('#cleanup', async function() {
      return screenshotCollection.cleanup().then(function() {
        expect(td.explain(NotSetStudio.prototype.cleanup).calls.length).to.equal(1);
      })
    });
  });
  describe('image is not the same', function() {
    const SetStudio = td.constructor(Studio);
    td.when(SetStudio.prototype.getComponentCount()).thenReturn(1);
    const SetComponentStudio = td.constructor(ComponentStudio);
    const componentStudio = new SetComponentStudio();
    td.when(SetStudio.prototype.getComponent(td.matchers.anything())).thenReturn(componentStudio);
    td.when(SetComponentStudio.prototype.isImageSet()).thenReturn(true);
    td.when(SetComponentStudio.prototype.isSame()).thenResolve(false);
    td.when(SetComponentStudio.prototype.diff()).thenResolve(100);
    const screenshotCollection = 
      new ScreenshotCollection('project-id', 'screenshot-bucket', componentDirectory, 1234, 3, SetStudio);
    it('#capture', async function() {
      return screenshotCollection.capture().then(function() {
        expect(td.explain(SetComponentStudio.prototype.saveNewImage).calls.length).to.equal(1);
      })
    });
    it('#pixelValidate', async function() {
      return screenshotCollection.pixelValidate().then(function(result) {
        expect(result.allPass).to.equal(false);
      })
    });
  });
  describe('image is the same', function() {
    const SameStudio = td.constructor(Studio);
    td.when(SameStudio.prototype.getComponentCount()).thenReturn(1);
    const SameComponentStudio = td.constructor(ComponentStudio);
    const componentStudio = new SameComponentStudio();
    td.when(SameStudio.prototype.getComponent(td.matchers.anything())).thenReturn(componentStudio);
    td.when(SameComponentStudio.prototype.isImageSet()).thenReturn(true);
    td.when(SameComponentStudio.prototype.isSame()).thenResolve(true);
    td.when(SameComponentStudio.prototype.diff()).thenResolve(0);
    const screenshotCollection = 
      new ScreenshotCollection('project-id', 'screenshot-bucket', componentDirectory, 1234, 3, SameStudio);
    it('#capture', async function() {
      return screenshotCollection.capture().then(function() {
        expect(td.explain(SameComponentStudio.prototype.saveNewImage).calls.length).to.equal(0);
      })
    });
    it('#pixelValidate', async function() {
      return screenshotCollection.pixelValidate().then(function(result) {
        expect(result.allPass).to.equal(true);
      })
    });
  });
});
