const fs = require('fs');
const path = require('path');
const LocalDirectory = require('./local-directory');

class MochaWriter {
  constructor(name = "mocha-writer", MyLocalDirectory = LocalDirectory) {
    this.localDirectory_ = new MyLocalDirectory(name);
  }

  async prepareForWriting() {
    await this.localDirectory_.create();
  }

  async write(renderDirectory, gcpProjectId, storageBucketName, tryCount = 10, myFs = fs) {
    const javaScriptPath = './'+this.localDirectory_.getFullPath()+'/index.test.js';
    let fileContent = "const RoutineDesign = require('routine-design');";
    fileContent += "\nconst assert = require('assert');";
    fileContent += "\ndescribe('render', function() {";
    fileContent += "\nconst componentWorkshop = new RoutineDesign().createComponentWorkshop('"+renderDirectory+"', '"+gcpProjectId+"', '"+storageBucketName+"');";
    fileContent += "\nbefore(async function() {";
    fileContent += "\nawait componentWorkshop.setup();";
    fileContent += "\n});";
    fileContent += "\nconst pixelValidators = componentWorkshop.getPixelValidators();";
    fileContent += "\nfor (pixelValidator of pixelValidators) {";
    fileContent += "\nit(pixelValidator.getComponentDirectoryId(), async function() {";
    fileContent += "\nconst result = await pixelValidator.validate("+tryCount+");";
    fileContent += "\nassert(result.allPass, result.gcpUrl);";
    fileContent += "\n});";
    fileContent += "\n}";
    fileContent += "\nafter(async function() {";
    fileContent += "\nawait componentWorkshop.cleanup();";
    fileContent += "\n});";
    fileContent += "\n});";
    return new Promise(function(resolve, reject) {
      myFs.writeFile(javaScriptPath, fileContent, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = MochaWriter;
