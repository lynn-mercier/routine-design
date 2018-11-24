const {expect} = require('chai');
const td = require('testdouble');
const WebsiteStatus = require('../src/website-status');

describe('WebsiteStatus', function() {
  describe('resolves successfully', function() {
    const goodPage = td.object({
      goto: () => {}
    });
    const websiteStatus = new WebsiteStatus(goodPage, 'url');
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
    const timeoutPage = td.object({
      goto: () => {}
    });
    const timeoutError = {message:'Navigation Timeout Exceeded'};
    td.when(timeoutPage.goto(td.matchers.anything(), td.matchers.anything())).thenThrow(timeoutError);
    const websiteStatus = new WebsiteStatus(timeoutPage, 'url');
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
    const cantConnectPage = td.object({
      goto: () => {}
    });
    const connectionError = {message:'net::ERR_CONNECTION_REFUSED'};
    td.when(cantConnectPage.goto(td.matchers.anything(), td.matchers.anything())).thenThrow(connectionError);
    const websiteStatus = new WebsiteStatus(cantConnectPage, 'url');
    it('#resolves returns false', async function() {
      return websiteStatus.resolves().then(function(resolves) {
        expect(resolves).to.equal(false);
      });
    });
  });
});
