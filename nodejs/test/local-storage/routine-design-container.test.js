const {expect} = require('chai');
const td = require('testdouble');
const Docker = require('docker-cli-js').Docker;
const fs = require('fs');
const username = td.func(require('username'));
const userid = td.object(require('userid'));
const RoutineDesignContainer = require('../../src/local-storage/routine-design-container');
const LocalDirectory = td.constructor(require('../../src/local-storage/local-directory'));

describe('local-storage/RoutineDesignContainer', function() {
  process.env.PWD = '/home';
  process.env.ROUTINE_DESIGN_GOOGLE_CREDS = 'routine-design-google-creds';
  td.when(LocalDirectory.prototype.getFilePath(td.matchers.anything())).thenReturn('auth.json');
  td.when(LocalDirectory.prototype.create()).thenResolve();
  describe('successful filesystem', function() {
    const successfulFs = td.object(fs);
    td.when(successfulFs.writeFile(td.matchers.anything(), td.matchers.anything())).thenCallback();
    td.when(successfulFs.unlink(td.matchers.anything())).thenCallback();
    describe('#start', function() {
      it('successful docker', async function() {
        const MockDocker = td.constructor(Docker);
        const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
        td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
        return container.start().then(function() {
          const dockerCalls = td.explain(MockDocker.prototype.command).calls;
          expect(dockerCalls.length).to.equal(2);
          expect(dockerCalls[0].args[0]).to.equal('create -t -v /home:/home/routine-design --name=foo --cap-add=SYS_ADMIN routine-design');
          expect(dockerCalls[1].args[0]).to.equal('start foo');
          expect(td.explain(LocalDirectory.prototype.create).calls.length).to.equal(1);
          expect(td.explain(successfulFs.writeFile).calls[0].args[0]).to.equal('auth.json');
          expect(td.explain(successfulFs.writeFile).calls[0].args[1]).to.equal('routine-design-google-creds');
        });
      });
      it('unsuccessful docker', async function() {
        const MockDocker = td.constructor(Docker);
        const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
        td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback(`error: 'Error: Command failed: docker blah blah
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
' stdout = '' stderr = 'Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
'`);
        let caughtError = false;
        try {
          await container.start()
        } catch (error) {
          caughtError = true;
          expect(error.message).to.equal('Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?');
        }
        expect(caughtError).to.equal(true);
      });
    });
    describe('#buildNodeSass', function() {
      it('successful docker', async function() {
        const MockDocker = td.constructor(Docker);
        const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
        td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
        return container.buildNodeSass().then(function() {
          expect(td.explain(MockDocker.prototype.command).calls[0].args[0]).to.equal('exec foo bash -c "npm rebuild node-sass"');
        });
      });
      it('unsuccessful docker', async function() {
        const MockDocker = td.constructor(Docker);
        const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
        td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback(`error: 'Error: Command failed: docker blah blah
Cannot build Sass
' stdout = '' stderr = 'Cannot build Sass
'`);
        let caughtError = false;
        try {
          await container.buildNodeSass()
        } catch (error) {
          caughtError = true;
          expect(error.message).to.equal('Cannot build Sass');
        }
        expect(caughtError).to.equal(true);
      });
    });
    describe('#run', function() {
      td.when(username()).thenResolve('username');
      td.when(userid.uid(td.matchers.anything())).thenReturn(1234);
      it('successful docker', async function() {
        const MockDocker = td.constructor(Docker);
        const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
        td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback(null, 'data');
        return container.run('command', username, userid).then(function(data) {
          expect(data).to.equal('data');
          expect(td.explain(MockDocker.prototype.command).calls[0].args[0]).to.equal('exec -u 1234 -e GOOGLE_APPLICATION_CREDENTIALS="/home/routine-design/auth.json" foo bash -c "command"');
          expect(td.explain(userid.uid).calls[0].args[0]).to.equal('username');
        });
      });
      it('unsuccessful docker', async function() {
        const MockDocker = td.constructor(Docker);
        const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
        td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback(`error: 'Error: Command failed: docker blah blah
Error: Cannot run
  at some line
' stdout = '' stderr = 'Error: Cannot run
  at some line
'`);
        let caughtError = false;
        try {
          await container.run('command', username, userid);
        } catch(error) {
          caughtError = true;
          expect(error.message).to.equal('Cannot run');
        }
        expect(caughtError).to.equal(true);
      });
    });
    describe('#cleanup', function() {
      it('successful docker', async function() {
        const MockDocker = td.constructor(Docker);
        const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
        td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
        return container.cleanup().then(function() {
          const dockerCalls = td.explain(MockDocker.prototype.command).calls;
          expect(dockerCalls.length).to.equal(2);
          expect(dockerCalls[0].args[0]).to.equal('stop foo');
          expect(dockerCalls[1].args[0]).to.equal('rm foo');
          expect(td.explain(successfulFs.unlink).calls[0].args[0]).to.equal('auth.json');
        });
      });
      it('unsuccessful docker', async function() {
        const MockDocker = td.constructor(Docker);
        const container = new RoutineDesignContainer('foo', MockDocker, LocalDirectory, successfulFs);
        td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback(`error: 'Error: Command failed: docker blah blah
Cannot stop docker
' stdout = '' stderr = 'Cannot stop docker
'`);
        let caughtError = false;
        try {
          await container.cleanup();
        } catch(error) {
          caughtError = true;
          expect(error.message).to.equal('Cannot stop docker');
        }
        expect(caughtError).to.equal(true);
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
      td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
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
      td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
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
