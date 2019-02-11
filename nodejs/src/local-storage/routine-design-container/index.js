const {Docker} = require('docker-cli-js');
const userid = require('userid');
const username = require('username');
const path = require('path');
const fs = require('fs');
const LocalDirectory = require('../local-directory');
const GoogleCredentials = require('./google-credentials');

class RoutineDesignContainer {
	constructor(containerName, 
    MyDocker = Docker, MyLocalDirectory = LocalDirectory, myFs = fs, MyGoogleCredentials = GoogleCredentials) {
    this.containerName_ = containerName;
    this.docker_ = new MyDocker();
    this.localDirectory_ = new MyLocalDirectory(containerName);
    this.googleCredentialsPath_ = this.localDirectory_.getFilePath('auth.json');
    this.myFs_ = myFs;
    this.googleCredentials_ = new MyGoogleCredentials();
  }

  async start() {
    const volumeFlag = '-v '+process.env.PWD+':/home/routine-design';
    const nameFlag = '--name='+this.containerName_;
    const sysAdminFlag = '--cap-add=SYS_ADMIN';
    const createContainerPromise = new Promise((resolve, reject) => {
      this.docker_.command('create -t '+volumeFlag+' '+nameFlag+' '+sysAdminFlag+' routine-design', function(err) {
        if (err) {
          const stderrBegin = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length);
          const stderr = stderrBegin.substring(0, stderrBegin.indexOf('\n'));
          reject(new Error(stderr));
        } else {
          resolve();
        }
      });
    });
    const startContainerPromise = createContainerPromise.then(() => {
      return new Promise((resolve, reject) => {
        this.docker_.command('start '+this.containerName_, function(err) {
          if (err) {
            const stderrBegin = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length);
            const stderr = stderrBegin.substring(0, stderrBegin.indexOf('\n'));
            reject(new Error(stderr));
          } else {
            resolve();
          }
        });
      });
    });
    let writeGoogleCredsPromise;
    if (this.googleCredentials_.isSet()) {
      writeGoogleCredsPromise = this.localDirectory_.create().then(() => {
        return new Promise((resolve, reject) => {
          this.myFs_.writeFile(this.googleCredentialsPath_, this.googleCredentials_.getValue(), function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });
    } else {
      writeGoogleCredsPromise = new Promise(function(resolve) {
        resolve();
      });
    }
    return Promise.all([startContainerPromise, writeGoogleCredsPromise]);
  }

  async buildNodeSass() {
    return new Promise((resolve, reject) => {
      this.docker_.command('exec '+this.containerName_+' bash -c "npm rebuild node-sass"', function(err, data) {
        if (err) {
          const stderrBegin = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length);
          const stderr = stderrBegin.substring(0, stderrBegin.indexOf('\n'));
          reject(new Error(stderr));
        } else {
          resolve();
        }
      });
    });
  }

  async run(command, detached = false, myUsername = username, myUserid = userid) {
    const userFlagPromise = myUsername().then((usernameResult) => {
      return '-u '+myUserid.uid(usernameResult);
    });
    let googleEnvironmentFlag;
    if (this.googleCredentials_.isSet()) {
      googleEnvironmentFlag = '-e GOOGLE_APPLICATION_CREDENTIALS="'+path.join('/home/routine-design', this.googleCredentialsPath_)+'"';
    }
    let detachedFlag;
    if (detached) {
      detachedFlag = '--detach';
    }
    const dockerCommandPromise = userFlagPromise.then((userFlag) => {
      const flags = [userFlag];
      if (googleEnvironmentFlag) {
        flags.push(googleEnvironmentFlag);
      }
      if (detachedFlag) {
        flags.push(detachedFlag);
      }
      const flagsStr = flags.join(' ');
      return 'exec '+flagsStr+' '+this.containerName_+' bash -c "'+command+'"';
    });
    return dockerCommandPromise.then((dockerCommand) => {
      return new Promise((resolve, reject) => {
        this.docker_.command(dockerCommand, function(err, data) {
          if (err) {
            const stderrBegin = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length);
            const stderr = stderrBegin.substring(0, stderrBegin.lastIndexOf('\n'));
            console.error(stderr);
            const errorMessage = stderr.substring(stderr.indexOf(':')+2, stderr.indexOf('\n'));
            reject(new Error(errorMessage));
          } else {
            resolve(data);
          }
        });
      });
    });
  }

  async cleanup() {
    const stopContainerPromise = new Promise((resolve, reject) => {
      this.docker_.command('stop '+this.containerName_, function(err) {
        if (err) {
          const stderrBegin = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length);
          const stderr = stderrBegin.substring(0, stderrBegin.indexOf('\n'));
          reject(new Error(stderr));
        } else {
          resolve();
        }
      });
    });
    const removeContainerPromise = stopContainerPromise.then(() => {
      return new Promise((resolve, reject) => {
        this.docker_.command('rm '+this.containerName_, function(err) {
          if (err) {
            const stderrBegin = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length);
            const stderr = stderrBegin.substring(0, stderrBegin.indexOf('\n'));
            reject(new Error(stderr));
          } else {
            resolve();
          }
        });
      });
    });
    const deleteGoogleCredsPromise = new Promise((resolve, reject) => {
      this.myFs_.unlink(this.googleCredentialsPath_, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return Promise.all([removeContainerPromise, deleteGoogleCredsPromise]);
  }
}

module.exports = RoutineDesignContainer;
