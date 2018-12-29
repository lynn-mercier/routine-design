const {expect} = require('chai');
const td = require('testdouble');
const DirectoryCapturer = require('../src/directory-capturer');
const RenderServer = td.constructor(require('../src/render-server'));
const ComponentDirectory = td.constructor(require('../src/component-tree/component-directory'));
const Studio = require('../src/studio');
const ComponentStudio = require('../src/studio/component-studio');

describe('DirectoryCapturer', function() {
  const directoryCapturer = new DirectoryCapturer();
  const componentDirectory = new ComponentDirectory();
  describe('image is not set', function() {
    const NotSetStudio = td.constructor(Studio);
    td.when(NotSetStudio.prototype.getComponentCount()).thenReturn(1);
    const NotSetComponentStudio = td.constructor(ComponentStudio);
    const componentStudio = new NotSetComponentStudio();
    td.when(NotSetStudio.prototype.getComponent(td.matchers.anything())).thenResolve(componentStudio);
    td.when(NotSetComponentStudio.prototype.isImageSet()).thenReturn(false);
    it('#capture', async function() {
      return directoryCapturer.run('project-id', 'screenshot-bucket', componentDirectory, 1234, 3, NotSetStudio).then(function() {
        expect(td.explain(NotSetStudio).calls[0].args[0]).to.equal('project-id');
        expect(td.explain(NotSetStudio).calls[0].args[1]).to.equal('screenshot-bucket');
        expect(td.explain(NotSetStudio).calls[0].args[2]).to.equal(componentDirectory);
        expect(td.explain(NotSetStudio).calls[0].args[3]).to.equal(1234);
        expect(td.explain(NotSetStudio).calls[0].args[4]).to.equal(3);
        expect(td.explain(NotSetStudio.prototype.getComponent).calls[0].args[0]).to.equal(0);
        expect(td.explain(NotSetComponentStudio.prototype.saveNewImage).calls.length).to.equal(1);
        expect(td.explain(NotSetComponentStudio.prototype.cleanup).calls.length).to.equal(1);
        expect(td.explain(NotSetStudio.prototype.save).calls.length).to.equal(1);
        expect(td.explain(NotSetStudio.prototype.cleanup).calls.length).to.equal(1);
      })
    });
  });
  describe('image is not the same', function() {
    const SetStudio = td.constructor(Studio);
    td.when(SetStudio.prototype.getComponentCount()).thenReturn(1);
    const SetComponentStudio = td.constructor(ComponentStudio);
    const componentStudio = new SetComponentStudio();
    td.when(SetStudio.prototype.getComponent(td.matchers.anything())).thenResolve(componentStudio);
    td.when(SetComponentStudio.prototype.isImageSet()).thenReturn(true);
    td.when(SetComponentStudio.prototype.isSame()).thenResolve(false);
    it('#capture', async function() {
      return directoryCapturer.run('project-id', 'screenshot-bucket', componentDirectory, 1234, 3, SetStudio).then(function() {
        expect(td.explain(SetComponentStudio.prototype.saveNewImage).calls.length).to.equal(1);
      })
    });
  });
  describe('image is the same', function() {
    const SameStudio = td.constructor(Studio);
    td.when(SameStudio.prototype.getComponentCount()).thenReturn(1);
    const SameComponentStudio = td.constructor(ComponentStudio);
    const componentStudio = new SameComponentStudio();
    td.when(SameStudio.prototype.getComponent(td.matchers.anything())).thenResolve(componentStudio);
    td.when(SameComponentStudio.prototype.isImageSet()).thenReturn(true);
    td.when(SameComponentStudio.prototype.isSame()).thenResolve(true);
    it('#capture', async function() {
      return directoryCapturer.run('project-id', 'screenshot-bucket', componentDirectory, 1234, 3, SameStudio).then(function() {
        expect(td.explain(SameComponentStudio.prototype.saveNewImage).calls.length).to.equal(0);
      })
    });
  });
});
