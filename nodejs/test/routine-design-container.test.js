const {expect} = require('chai');
const td = require('testdouble');
const Docker = require('docker-cli-js').Docker;
const fs = require('fs');
const username = td.func(require('username'));
const userid = td.object(require('userid'));
const RoutineDesignContainer = require('../src/routine-design-container');
const LocalDirectory = td.constructor(require('../src/local-directory'));

describe('RoutineDesignContainer', function() {
  process.env.PWD = '/home';
  process.env.ROUTINE_DESIGN_GOOGLE_CREDS = 'routine-design-google-creds';
  td.when(LocalDirectory.prototype.getFilePath(td.matchers.anything())).thenReturn('auth.json');
  describe('successful filesystem', function() {
    const successfulFs = td.object(fs);
    td.when(successfulFs.writeFile(td.matchers.anything(), td.matchers.anything())).thenCallback();
    td.when(successfulFs.unlink(td.matchers.anything())).thenCallback();
    it('#start', async function() {
      const MockDocker = td.constructor(Docker);
      const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
      td.when(MockDocker.prototype.command(td.matchers.anything())).thenResolve();
      return container.start().then(function() {
        const dockerCalls = td.explain(MockDocker.prototype.command).calls;
        expect(dockerCalls.length).to.equal(2);
        expect(dockerCalls[0].args[0]).to.equal('create -t -v /home:/home/routine-design --name=foo --cap-add=SYS_ADMIN routine-design');
        expect(dockerCalls[1].args[0]).to.equal('start foo');
        expect(td.explain(successfulFs.writeFile).calls[0].args[0]).to.equal('auth.json');
        expect(td.explain(successfulFs.writeFile).calls[0].args[1]).to.equal('routine-design-google-creds');
      });
    });
    it('#run', async function() {
      const MockDocker = td.constructor(Docker);
      const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
      td.when(MockDocker.prototype.command(td.matchers.anything())).thenResolve();
      td.when(username()).thenResolve('username');
      td.when(userid.uid(td.matchers.anything())).thenReturn(1234);
      return container.run('command', username, userid).then(function() {
        expect(td.explain(MockDocker.prototype.command).calls[0].args[0]).to.equal('exec -u 1234 -e GOOGLE_APPLICATION_CREDENTIALS="/home/auth.json" foo bash -c "command"');
        expect(td.explain(userid.uid).calls[0].args[0]).to.equal('username');
      });
    });
    it('#cleanup', async function() {
      const MockDocker = td.constructor(Docker);
      const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
      td.when(MockDocker.prototype.command(td.matchers.anything())).thenResolve();
      return container.cleanup().then(function() {
        const dockerCalls = td.explain(MockDocker.prototype.command).calls;
        expect(dockerCalls.length).to.equal(2);
        expect(dockerCalls[0].args[0]).to.equal('stop foo');
        expect(dockerCalls[1].args[0]).to.equal('rm foo');
        expect(td.explain(successfulFs.unlink).calls[0].args[0]).to.equal('auth.json');
      });
    });
  });
  describe('unsuccessful filesystem', function() {
    const unsuccessfulFs = td.object(fs);
    td.when(unsuccessfulFs.writeFile(td.matchers.anything(), td.matchers.anything())).thenCallback('err');
    td.when(unsuccessfulFs.unlink(td.matchers.anything())).thenCallback('err');
    it('#start', async function() {
      const MockDocker = td.constructor(Docker);
      const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, unsuccessfulFs);
      td.when(MockDocker.prototype.command(td.matchers.anything())).thenResolve();
      let caughtError = false;
      try {
        await container.start();
      } catch (err) {
        caughtError = true;
      }
      expect(caughtError).to.equal(true);
    });
    it('#cleanup', async function() {
      const MockDocker = td.constructor(Docker);
      const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, unsuccessfulFs);
      td.when(MockDocker.prototype.command(td.matchers.anything())).thenResolve();
      let caughtError = false;
      try {
        await container.cleanup();
      } catch (err) {
        caughtError = true;
      }
      expect(caughtError).to.equal(true);
    });
  });
});
