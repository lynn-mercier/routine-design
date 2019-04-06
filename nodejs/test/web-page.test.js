const {expect} = require('chai');
const td = require('testdouble');
const WebPage = require('../src/web-page');
const LocalImage = td.constructor(require('../src/local-storage/local-image'));
const LocalStorage = td.constructor(require('../src/local-storage'));

describe('WebPage', function() {
  const localImage = new LocalImage();
  td.when(LocalStorage.prototype.createLocalImage()).thenReturn(localImage);
  td.when(LocalImage.prototype.getPath()).thenReturn('local-image.png');
  td.when(LocalImage.prototype.getPng()).thenResolve('png');
  describe('resolves successfully', function() {
    const goodBrowser = td.object({
      newPage: () => {}
    });
    const webPage = new WebPage(goodBrowser, 8080, 'url', null, LocalStorage);
    const goodPage = td.object({
      goto: () => {},
      screenshot: () => {}
    });
    td.when(goodBrowser.newPage()).thenReturn(goodPage);
    it('#resolves', async function() {
      return webPage.resolves().then(function(resolves) {
        expect(resolves).to.equal(true);
        expect(td.explain(goodPage.goto).calls[0].args[0]).to.equal('http://localhost:8080/url');
      });
    });
    it('#waitForResolution(tryCount)', async function() {
      return webPage.waitForResolution(1).then(function() { 
        expect(td.explain(goodPage.goto).calls[0].args[0]).to.equal('http://localhost:8080/url');
      });
    });
    it('#screenshot', async function() {
      expect(await webPage.screenshot()).to.equal('png');
      expect(td.explain(LocalImage.prototype.prepareForWriting).calls.length).to.equal(1);
      expect(td.explain(goodPage.screenshot).calls[0].args[0]).to.deep.equal({path: 'local-image.png'});
      expect(td.explain(LocalImage.prototype.delete).calls.length).to.equal(1);
    });
  });
  describe('specify width', function() {
    const goodBrowser = td.object({
      newPage: () => {}
    });
    const webPage = new WebPage(goodBrowser, 8080, 'url', 320, LocalStorage);
    const goodPage = td.object({
      goto: () => {},
      screenshot: () => {},
      setViewport: () => {}
    });
    td.when(goodBrowser.newPage()).thenReturn(goodPage);
    it('#screenshot', async function() {
      await webPage.screenshot();
      expect(td.explain(goodPage.setViewport).calls[0].args[0]).to.deep.equal({width: 320, height: 600});
    });
  });
  describe('times out', function() {
    const timeoutBrowser = td.object({
      newPage: () => {}
    });
    const webPage = new WebPage(timeoutBrowser, 8080, 'url');
    const timeoutPage = td.object({
      goto: () => {}
    });
    td.when(timeoutBrowser.newPage()).thenReturn(timeoutPage);
    const timeoutError = {message:'Navigation Timeout Exceeded'};
    td.when(timeoutPage.goto(td.matchers.anything(), td.matchers.anything())).thenThrow(timeoutError);
    it('#resolves returns false', async function() {
      return webPage.resolves().then(function(resolves) {
        expect(resolves).to.equal(false);
      });
    });
    it('#waitForResolution(tryCount)', async function() {
      return webPage.waitForResolution(1).catch(function(error) { 
        expect(error.message).to.equal("http://localhost:8080/url doesn't resolve");
      });
    });
  });
  describe('cannot connect', function() {
    const cantConnectBrowser = td.object({
      newPage: () => {}
    });
    const webPage = new WebPage(cantConnectBrowser, 8080, 'url');
    const cantConnectPage = td.object({
      goto: () => {}
    });
    td.when(cantConnectBrowser.newPage()).thenReturn(cantConnectPage);
    const connectionError = {message:'net::ERR_CONNECTION_REFUSED'};
    td.when(cantConnectPage.goto(td.matchers.anything(), td.matchers.anything())).thenThrow(connectionError);
    it('#resolves returns false', async function() {
      return webPage.resolves().then(function(resolves) {
        expect(resolves).to.equal(false);
      });
    });
  });
  describe('unknown error', function() {
    const unknownBrowser = td.object({
      newPage: () => {}
    });
    const webPage = new WebPage(unknownBrowser, 8080, 'url');
    const unknownPage = td.object({
      goto: () => {}
    });
    td.when(unknownBrowser.newPage()).thenReturn(unknownPage);
    const unknownError = {message:'unknown'};
    td.when(unknownPage.goto(td.matchers.anything(), td.matchers.anything())).thenThrow(unknownError);
    it('#resolves throws error', async function() {
      let caughtError = false;
      try {
        await webPage.resolves()
      } catch (err) {
        caughtError = true;
      }

      expect(caughtError).to.equal(true);
    });
  });
});
