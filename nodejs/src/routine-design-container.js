const {Docker} = require('docker-cli-js');
const userid = require('userid');
const username = require('username');
const path = require('path');
const fs = require('fs');
const LocalDirectory = require('./local-directory');

class RoutineDesignContainer {
	constructor(containerName = 'routine-design', MyDocker = Docker, MyLocalDirectory = LocalDirectory, myFs = fs) {
    this.containerName_ = containerName;
    this.docker_ = new MyDocker();
    const localDirectory = new MyLocalDirectory('docker');
    this.googleCredentialsPath_ = localDirectory.getFilePath('auth.json');
    this.myFs_ = myFs;
  }

  async start() {
    const volumeFlag = '-v '+process.env.PWD+':/home/routine-design';
    const nameFlag = '--name='+this.containerName_;
    const sysAdminFlag = '--cap-add=SYS_ADMIN';
    const startContainerPromise = 
      this.docker_.command('create -t '+volumeFlag+' '+nameFlag+' '+sysAdminFlag+' routine-design').then(() => {
        return this.docker_.command('start '+this.containerName_);
      });
    const writeGoogleCredsPromise = new Promise((resolve, reject) => {
      this.myFs_.writeFile(this.googleCredentialsPath_, process.env.ROUTINE_DESIGN_GOOGLE_CREDS, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return Promise.all([startContainerPromise, writeGoogleCredsPromise]);
  }

  async run(command, myUsername = username, myUserid = userid) {
    const userFlagPromise = myUsername().then((usernameResult) => {
      return '-u '+myUserid.uid(usernameResult);
    });
    const googleEnvironmentFlag = '-e GOOGLE_APPLICATION_CREDENTIALS="'+path.join(process.env.PWD, this.googleCredentialsPath_)+'"';
    return this.docker_.command('exec '+(await userFlagPromise)+' '+googleEnvironmentFlag+' '+this.containerName_+' bash -c "'+command+'"');
  }

  async cleanup() {
    const removeContainerPromise = this.docker_.command('stop '+this.containerName_).then(() => {
      return this.docker_.command('rm '+this.containerName_);
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
