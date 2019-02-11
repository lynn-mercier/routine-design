const {Docker} = require('docker-cli-js');
const userid = require('userid');
const username = require('username');
const path = require('path');
const fs = require('fs');
const LocalDirectory = require('./local-directory');

class RoutineDesignContainer {
	constructor(containerName, MyDocker = Docker, MyLocalDirectory = LocalDirectory, myFs = fs) {
    this.containerName_ = containerName;
    this.docker_ = new MyDocker();
    this.localDirectory_ = new MyLocalDirectory(containerName);
    this.googleCredentialsPath_ = this.localDirectory_.getFilePath('auth.json');
    this.myFs_ = myFs;
  }

  async start() {
    const volumeFlag = '-v '+process.env.PWD+':/home/routine-design';
    const nameFlag = '--name='+this.containerName_;
    const sysAdminFlag = '--cap-add=SYS_ADMIN';
    const createContainerPromise = new Promise((resolve, reject) => {
      this.docker_.command('create -t '+volumeFlag+' '+nameFlag+' '+sysAdminFlag+' routine-design', function(err) {
        if (err) {
          const stderr = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length, err.length-2);
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
            const stderr = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length, err.length-2);
            reject(new Error(stderr));
          } else {
            resolve();
          }
        });
      });
    });
    const writeGoogleCredsPromise = this.localDirectory_.create().then(() => {
      return new Promise((resolve, reject) => {
        this.myFs_.writeFile(this.googleCredentialsPath_, process.env.ROUTINE_DESIGN_GOOGLE_CREDS, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
    return Promise.all([startContainerPromise, writeGoogleCredsPromise]);
  }

  async buildNodeSass() {
    return new Promise((resolve, reject) => {
      this.docker_.command('exec '+this.containerName_+' bash -c "npm rebuild node-sass"', function(err, data) {
        if (err) {
          const stderr = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length, err.length-2);
          reject(new Error(stderr));
        } else {
          resolve();
        }
      });
    });
  }

  async run(command, myUsername = username, myUserid = userid) {
    const userFlagPromise = myUsername().then((usernameResult) => {
      return '-u '+myUserid.uid(usernameResult);
    });
    const googleEnvironmentFlag = '-e GOOGLE_APPLICATION_CREDENTIALS="'+path.join('/home/routine-design', this.googleCredentialsPath_)+'"';
    
    const dockerCommandPromise = userFlagPromise.then((userFlag) => {
      return 'exec '+userFlag+' '+googleEnvironmentFlag+' '+this.containerName_+' bash -c "'+command+'"';
    });

    return dockerCommandPromise.then((dockerCommand) => {
      return new Promise((resolve, reject) => {
        this.docker_.command(dockerCommand, function(err, data) {
          if (err) {
            const stderr = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length, err.length-2);
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
          const stderr = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length, err.length-2);
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
            const stderr = err.substring(err.indexOf('stderr = \'')+'stderr = \''.length, err.length-2);
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
