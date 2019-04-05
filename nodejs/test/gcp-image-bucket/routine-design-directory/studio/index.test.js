const {expect} = require('chai');
const td = require('testdouble');
const Studio = require('../../../../src/gcp-image-bucket/routine-design-directory/studio');
const fs = require('fs');
const ComponentDirectory = td.constructor(require('../../../../src/routine-design-tree/component-tree/component-directory'));
const ComponentFile = td.constructor(require('../../../../src/routine-design-tree/component-tree/component-file'));
const ImageStorage = td.constructor(require('../../../../src/gcp-image-bucket/routine-design-directory/image-storage'));
const ComponentImage = td.constructor(require('../../../../src/gcp-image-bucket/routine-design-directory/image-storage/component-image'));
const puppeteer = require('puppeteer');
const ComponentStudio = require('../../../../src/gcp-image-bucket/routine-design-directory/studio/component-studio');

describe('gcp-image-bucket/routine-design-directory/Studio', function() {
  td.when(ComponentFile.prototype.getBasename()).thenReturn("index.js");
  const componentFile = new ComponentFile();
  td.when(ComponentDirectory.prototype.getFiles()).thenReturn([componentFile]);
  td.when(ComponentDirectory.prototype.getDirectory()).thenReturn('foo');
  const componentImage = new ComponentImage();
  td.when(ImageStorage.prototype.getImages()).thenReturn([componentImage]);
  td.when(ImageStorage.prototype.getDebugId()).thenReturn('image-storage-debug-id');
  const componentDirectory = new ComponentDirectory();
  describe('not on Docker', function() {
    const mockBrowser = td.object();
    const notOnDockerPuppeteer = td.object(puppeteer);
    td.when(notOnDockerPuppeteer.launch(td.matchers.anything())).thenResolve(mockBrowser);
    const studio = new Studio('project-id', 'storage-bucket', componentDirectory, 1234, 3, ImageStorage, notOnDockerPuppeteer);
    it('#init', async function() {
      const myFs = td.object(fs);
      td.when(myFs.existsSync(td.matchers.anything())).thenReturn(false);
      return studio.init().then(function(myFs) {
        expect(td.explain(ImageStorage.prototype.init).calls.length).to.equal(1);
        expect(td.explain(notOnDockerPuppeteer.launch).calls[0].args[0]).to.deep.equal({});
      });
    });
    it('returns debug id', function() {
      expect(studio.getDebugId()).to.equal('image-storage-debug-id');
    });
    it('stores images in the GCP project', function() {
      expect(td.explain(ImageStorage).calls[0].args[0]).to.equal('project-id');
    });
    it('stores images in the GCP storage bucket', function() {
      expect(td.explain(ImageStorage).calls[0].args[1]).to.equal('storage-bucket');
    });
    it('connected to images.json', function() {
      expect(td.explain(ImageStorage).calls[0].args[2]).to.equal(componentDirectory);
    });
    it('#getComponentCount', function() {
      expect(studio.getComponentCount()).to.equal(1);
    });
    it('#getComponent', async function() {
      const MyComponentStudio = td.constructor(ComponentStudio);
      const myFs = td.object(fs);
      td.when(myFs.existsSync(td.matchers.anything())).thenReturn(false);
      return studio.init(myFs).then(function() {
        studio.getComponent(0, MyComponentStudio);
        expect(td.explain(MyComponentStudio).calls[0].args[0]).to.equal(componentFile);
        expect(td.explain(MyComponentStudio).calls[0].args[1]).to.equal(componentImage);
        expect(td.explain(MyComponentStudio).calls[0].args[2]).to.equal(mockBrowser);
        expect(td.explain(MyComponentStudio).calls[0].args[3]).to.equal(1234);
        expect(td.explain(MyComponentStudio).calls[0].args[4]).to.equal(3);
        expect(td.explain(MyComponentStudio).calls[0].args[5]).to.equal(undefined);
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

  describe('with viewport.json', function() {
    const mockBrowser = td.object();
    const notOnDockerPuppeteer = td.object(puppeteer);
    td.when(notOnDockerPuppeteer.launch(td.matchers.anything())).thenResolve(mockBrowser);
    describe('successfully read JSON file', function() {
      const studio = new Studio('project-id', 'storage-bucket', componentDirectory, 1234, 3, ImageStorage, notOnDockerPuppeteer);
      const MyComponentStudio = td.constructor(ComponentStudio);
      const myFs = td.object(fs);
      td.when(myFs.existsSync(td.matchers.anything())).thenReturn(true);
      td.when(myFs.readFile(td.matchers.anything())).thenCallback(null, '{"index.js":{"width":320}}');
      it('#getComponent', async function() {
        return studio.init(myFs).then(function() {;
          studio.getComponent(0, MyComponentStudio);
          expect(td.explain(MyComponentStudio).calls[0].args[0]).to.equal(componentFile);
          expect(td.explain(MyComponentStudio).calls[0].args[1]).to.equal(componentImage);
          expect(td.explain(MyComponentStudio).calls[0].args[2]).to.equal(mockBrowser);
          expect(td.explain(MyComponentStudio).calls[0].args[3]).to.equal(1234);
          expect(td.explain(MyComponentStudio).calls[0].args[4]).to.equal(3);
          expect(td.explain(MyComponentStudio).calls[0].args[5]).to.equal(320);
        });
      });
    });
    describe('fail to read JSON file', function() {
      const studio = new Studio('project-id', 'storage-bucket', componentDirectory, 1234, 3, ImageStorage, notOnDockerPuppeteer);
      const MyComponentStudio = td.constructor(ComponentStudio);
      const myFs = td.object(fs);
      td.when(myFs.existsSync(td.matchers.anything())).thenReturn(true);
      td.when(myFs.readFile(td.matchers.anything())).thenCallback('error');
      it('#init', async function() {

        let caughtError = false;
        try {
          await studio.init(myFs);
        } catch {
          caughtError = true;
        }

        expect(caughtError).to.equal(true);
      });
    });
  });

  describe('on Docker', function() {
    const mockBrowser = td.object();
    const onDockerPuppeteer = td.object(puppeteer);
    td.when(onDockerPuppeteer.launch(td.matchers.anything())).thenResolve(mockBrowser);
    const studio = new Studio('project-id', 'storage-bucket', componentDirectory, 1234, 3, ImageStorage, onDockerPuppeteer);
    it('#init', async function() {
      process.env.ROUTINE_DESIGN_DOCKER = 'true';
      const myFs = td.object(fs);
      td.when(myFs.existsSync(td.matchers.anything())).thenReturn(false);
      return studio.init().then(function(myFs) {
        expect(td.explain(onDockerPuppeteer.launch).calls[0].args[0]).to.deep.equal({
          args: ["--disable-dev-shm-usage"],
          executablePath: "google-chrome-unstable"
        });
      });
    });
  });
  afterEach(() => {
      delete process.env.ROUTINE_DESIGN_DOCKER;
  });
});
