const {expect} = require('chai');
const td = require('testdouble');
const Docker = require('docker-cli-js').Docker;
const fs = require('fs');
const username = td.func(require('username'));
const userid = td.object(require('userid'));
const RoutineDesignContainer = require('../../../src/local-storage/routine-design-container');
const LocalDirectory = require('../../../src/local-storage/local-directory');
const GoogleCredentials = require('../../../src/local-storage/routine-design-container/google-credentials');

describe('local-storage/RoutineDesignContainer', function() {
  process.env.PWD = '/home';
  describe('with Google creds', function() {
    const MyLocalDirectory = td.constructor(LocalDirectory);
    td.when(MyLocalDirectory.prototype.getFilePath(td.matchers.anything())).thenReturn('auth.json');
    td.when(MyLocalDirectory.prototype.create()).thenResolve();
    const MyGoogleCredentials = td.constructor(GoogleCredentials);
    td.when(MyGoogleCredentials.prototype.isSet()).thenReturn(true);
    td.when(MyGoogleCredentials.prototype.getValue()).thenReturn('routine-design-google-creds');
    describe('successful filesystem', function() {
      const successfulFs = td.object(fs);
      td.when(successfulFs.writeFile(td.matchers.anything(), td.matchers.anything())).thenCallback();
      td.when(successfulFs.unlink(td.matchers.anything())).thenCallback();
      describe('#start', function() {
        it('successful docker', async function() {
          const MockDocker = td.constructor(Docker);
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
          td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
          return container.start().then(function() {
            const dockerCalls = td.explain(MockDocker.prototype.command).calls;
            expect(dockerCalls.length).to.equal(2);
            expect(dockerCalls[0].args[0]).to.equal('create -t -v /home:/home/routine-design --name=foo --cap-add=SYS_ADMIN lynnmercier/routine-design');
            expect(dockerCalls[1].args[0]).to.equal('start foo');
            expect(td.explain(MyLocalDirectory.prototype.create).calls.length).to.equal(1);
            expect(td.explain(successfulFs.writeFile).calls[0].args[0]).to.equal('auth.json');
            expect(td.explain(successfulFs.writeFile).calls[0].args[1]).to.equal('routine-design-google-creds');
          });
        });
        it('unsuccessfully create docker', async function() {
          const MockDocker = td.constructor(Docker);
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
          td.when(MockDocker.prototype.command(td.matchers.contains('create'))).thenCallback(`error: 'Error: Command failed: docker blah blah
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
        it('unsuccessfully start docker', async function() {
          const MockDocker = td.constructor(Docker);
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
          td.when(MockDocker.prototype.command(td.matchers.contains('create'))).thenCallback();
          td.when(MockDocker.prototype.command(td.matchers.contains('start'))).thenCallback(`error: 'Error: Command failed: docker blah blah
  Cannot start Docker
  ' stdout = '' stderr = 'Cannot start Docker
  '`);
          let caughtError = false;
          try {
            await container.start()
          } catch (error) {
            caughtError = true;
            expect(error.message).to.equal('Cannot start Docker');
          }
          expect(caughtError).to.equal(true);
        });
      });
      describe('#buildNodeSass', function() {
        it('successful docker', async function() {
          const MockDocker = td.constructor(Docker);
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
          td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
          return container.buildNodeSass().then(function() {
            expect(td.explain(MockDocker.prototype.command).calls[0].args[0]).to.equal('exec foo bash -c "npm rebuild node-sass"');
          });
        });
        it('unsuccessful docker', async function() {
          const MockDocker = td.constructor(Docker);
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
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
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
          td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback(null, {raw:'data'});
          return container.run('command', false, username, userid).then(function(data) {
            expect(data).to.equal('data');
            expect(td.explain(MockDocker.prototype.command).calls[0].args[0]).to.equal('exec -u 1234 -e GOOGLE_APPLICATION_CREDENTIALS="/home/routine-design/auth.json" foo bash -c "command"');
            expect(td.explain(userid.uid).calls[0].args[0]).to.equal('username');
          });
        });
        it('successful detached docker', async function() {
          const MockDocker = td.constructor(Docker);
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
          td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback(null, {raw:'data'});
          return container.run('command', true, username, userid).then(function(data) {
            expect(td.explain(MockDocker.prototype.command).calls[0].args[0]).to.equal('exec -u 1234 -e GOOGLE_APPLICATION_CREDENTIALS="/home/routine-design/auth.json" --detach foo bash -c "command"');
          });
        });
        it('unsuccessful docker', async function() {
          const MockDocker = td.constructor(Docker);
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
          td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback(`error: 'Error: Command failed: docker blah blah
  Error: Cannot run
    at some line
  ' stdout = '' stderr = 'Error: Cannot run
    at some line
  '`);
          let caughtError = false;
          try {
            await container.run('command', false, username, userid);
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
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
          td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
          return container.cleanup().then(function() {
            const dockerCalls = td.explain(MockDocker.prototype.command).calls;
            expect(dockerCalls.length).to.equal(2);
            expect(dockerCalls[0].args[0]).to.equal('stop foo');
            expect(dockerCalls[1].args[0]).to.equal('rm foo');
            expect(td.explain(MyLocalDirectory.prototype.empty).calls.length).to.equal(1);
          });
        });
        it('unsuccessfully stop docker', async function() {
          const MockDocker = td.constructor(Docker);
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
          td.when(MockDocker.prototype.command(td.matchers.contains('stop'))).thenCallback(`error: 'Error: Command failed: docker blah blah
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
        it('unsuccessfully rm docker', async function() {
          const MockDocker = td.constructor(Docker);
          const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, successfulFs, MyGoogleCredentials);
          td.when(MockDocker.prototype.command(td.matchers.contains('stop'))).thenCallback();
          td.when(MockDocker.prototype.command(td.matchers.contains('rm'))).thenCallback(`error: 'Error: Command failed: docker blah blah
  Cannot stop docker
  ' stdout = '' stderr = 'Cannot rm docker
  '`);
          let caughtError = false;
          try {
            await container.cleanup();
          } catch(error) {
            caughtError = true;
            expect(error.message).to.equal('Cannot rm docker');
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
        const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, unsuccessfulFs, MyGoogleCredentials);
        td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
        let caughtError = false;
        try {
          await container.start();
        } catch (err) {
          caughtError = true;
        }
        expect(caughtError).to.equal(true);
      });
    });
  });
  describe('no Google creds', function() {
    const MyLocalDirectory = td.constructor(LocalDirectory);
    const MyGoogleCredentials = td.constructor(GoogleCredentials);
    td.when(MyGoogleCredentials.prototype.isSet()).thenReturn(false);
    const myFs = td.object(fs);
    it('#start', async function() {
      const MockDocker = td.constructor(Docker);
      const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, myFs, MyGoogleCredentials);
      td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
      return container.start().then(function() {
        expect(td.explain(MyLocalDirectory.prototype.create).calls.length).to.equal(0);
        expect(td.explain(myFs.writeFile).calls.length).to.equal(0);
      });
    });
    it('#run', async function() {
      const MockDocker = td.constructor(Docker);
      const container = new RoutineDesignContainer('foo', MockDocker, MyLocalDirectory, myFs, MyGoogleCredentials);
      td.when(MockDocker.prototype.command(td.matchers.anything())).thenCallback();
      return container.run('command', false, username, userid).then(function() {
        expect(td.explain(MockDocker.prototype.command).calls[0].args[0]).to.equal('exec -u 1234 foo bash -c "command"');
      });
    });
  });
});
