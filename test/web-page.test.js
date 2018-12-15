const {expect} = require('chai');
const td = require('testdouble');
const WebPage = require('../src/web-page');
const LocalImage = td.constructor(require('../src/local-image'));

describe('WebPage', function() {
  td.when(LocalImage.prototype.getPath()).thenReturn('local-image.png');
  describe('resolves successfully', function() {
    const goodBrowser = td.object({
      newPage: () => {}
    });
    const webPage = new WebPage(goodBrowser, 8080, 'url');
    const goodPage = td.object({
      goto: () => {},
      screenshot: () => {}
    });
    td.when(goodBrowser.newPage()).thenReturn(goodPage);
    it('#resolves', async function() {
      return webPage.resolves().then(function(resolves) {
        expect(resolves).to.equal(true);
        expect(td.explain(goodPage.goto).calls[0].args[0]).to.equal('http://localhost:8080/#/url');
      });
    });
    it('#waitForResolution(tryCount)', async function() {
      return webPage.waitForResolution(1).then(function() { 
        expect(td.explain(goodPage.goto).calls[0].args[0]).to.equal('http://localhost:8080/#/url');
      });
    });
    it('#screenshot', async function() {
      await webPage.screenshot(LocalImage);
      expect(td.explain(LocalImage.prototype.prepareForWriting).calls.length).to.equal(1);
      expect(td.explain(goodPage.screenshot).calls[0].args[0]).to.deep.equal({path: 'local-image.png'});
    });
  });
  describe('times out', function() {
    const timeoutBrowser = td.object({
      newPage: () => {}
    });
    const webPage = new WebPage(timeoutBrowser, 'url');
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
        expect(error).to.equal("Doesn't resolve");
      });
    });
  });
  describe('cannot connect', function() {
    const cantConnectBrowser = td.object({
      newPage: () => {}
    });
    const webPage = new WebPage(cantConnectBrowser, 'url');
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
    const webPage = new WebPage(unknownBrowser, 'url');
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