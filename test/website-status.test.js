const {expect} = require('chai');
const td = require('testdouble');
const WebsiteStatus = require('../src/website-status');

describe('WebsiteStatus', function() {
  describe('resolves successfully', function() {
    const goodBrowser = td.object({
      newPage: () => {}
    });
    const websiteStatus = new WebsiteStatus(goodBrowser, 'url');
    const goodPage = td.object({
      goto: () => {}
    });
    td.when(goodBrowser.newPage()).thenReturn(goodPage);
    it('#resolves', async function() {
      return websiteStatus.resolves().then(function(resolves) {
        expect(resolves).to.equal(true);
        expect(td.explain(goodPage.goto).calls[0].args[0]).to.equal('url');
      });
    });
    it('#waitForResolution(tryCount)', async function() {
      return websiteStatus.waitForResolution(1).then(function() { 
        expect(td.explain(goodPage.goto).calls[0].args[0]).to.equal('url');
      });
    });
  });
  describe('times out', function() {
    const timeoutBrowser = td.object({
      newPage: () => {}
    });
    const websiteStatus = new WebsiteStatus(timeoutBrowser, 'url');
    const timeoutPage = td.object({
      goto: () => {}
    });
    td.when(timeoutBrowser.newPage()).thenReturn(timeoutPage);
    const timeoutError = {message:'Navigation Timeout Exceeded'};
    td.when(timeoutPage.goto(td.matchers.anything(), td.matchers.anything())).thenThrow(timeoutError);
    it('#resolves returns false', async function() {
      return websiteStatus.resolves().then(function(resolves) {
        expect(resolves).to.equal(false);
      });
    });
    it('#waitForResolution(tryCount)', async function() {
      return websiteStatus.waitForResolution(1).catch(function(error) { 
        expect(error).to.equal("Doesn't resolve");
      });
    });
  });
  describe('cannot connect', function() {
    const cantConnectBrowser = td.object({
      newPage: () => {}
    });
    const websiteStatus = new WebsiteStatus(cantConnectBrowser, 'url');
    const cantConnectPage = td.object({
      goto: () => {}
    });
    td.when(cantConnectBrowser.newPage()).thenReturn(cantConnectPage);
    const connectionError = {message:'net::ERR_CONNECTION_REFUSED'};
    td.when(cantConnectPage.goto(td.matchers.anything(), td.matchers.anything())).thenThrow(connectionError);
    it('#resolves returns false', async function() {
      return websiteStatus.resolves().then(function(resolves) {
        expect(resolves).to.equal(false);
      });
    });
  });
});
