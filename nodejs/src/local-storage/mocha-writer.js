const fs = require('fs');
const path = require('path');
const LocalDirectory = require('./local-directory');

class MochaWriter {

  async write(renderDirectory, gcpProjectId, storageBucketName, name, tryCount = 10, MyLocalDirectory = LocalDirectory, myFs = fs) {
    const localDirectory = new MyLocalDirectory(name);
    const javaScriptPath = './'+localDirectory.getFullPath()+'/index.test.js';
    let fileContent = "const RoutineDesign = require('routine-design');";
    fileContent += "\nconst assert = require('assert');";
    fileContent += "\ndescribe('render', function() {";
    fileContent += "\nconst componentWorkshop = new RoutineDesign().createComponentWorkshop('"+renderDirectory+"', '"+gcpProjectId+"', '"+storageBucketName+"');";
    fileContent += "\nbefore(async function() {";
    fileContent += "\nawait componentWorkshop.setup();";
    fileContent += "\n});";
    fileContent += "\nconst pixelValidators = componentWorkshop.getPixelValidators();";
    fileContent += "\nfor (pixelValidator in pixelValidators) {";
    fileContent += "\nit(pixelValidator.getName(), async function() {";
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
