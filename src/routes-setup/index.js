const glob = require('glob');
const fs = require('fs');
const ComponentFile = require('./component-file');

class RoutesSetup {
  constructor(renderDirectory, routesPath, myGlob = glob, MyComponentFile = ComponentFile) {
    this.renderDirectory_ = renderDirectory;
    this.routesPath_ = routesPath;
    this.myGlob_ = myGlob;
    this.MyComponentFile_ = MyComponentFile;
  }

  getComponentFiles() {
    const componentFiles = [];
    const routesPath = this.routesPath_;
    const renderDirectory = this.renderDirectory_;
    const MyComponentFile = this.MyComponentFile_;
    this.myGlob_.sync(this.renderDirectory_ + '/**/*.js').forEach(function(file) {
      const componentFile = new MyComponentFile(renderDirectory, routesPath, file);
      componentFiles.push(componentFile);
    });
    return componentFiles;
  }

  async writeJavaScript(myFs = fs) {
    let fileContent = "import React from 'react';\n";
    fileContent += "import {Route} from 'react-router-dom';\n";
    fileContent += "class Routes extends React.Component {\nrender() {return (<div>\n";
    this.getComponentFiles().forEach((componentFile) => {
      fileContent += componentFile.getRoute()+"\n";
    });
    fileContent += "</div>);}\n}\nexport default Routes\n";

    const routesPath = this.routesPath_;
    return new Promise(function(resolve, reject) {
      myFs.writeFile(routesPath, fileContent, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = RoutesSetup;
