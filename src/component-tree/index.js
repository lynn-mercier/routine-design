const glob = require('glob');
const fs = require('fs');
const ComponentFile = require('./component-file');
const ComponentRoute = require('./component-route');

class ComponentTree {
  constructor(directory, myGlob = glob, MyComponentFile = ComponentFile) {
    this.directory_ = directory;
    this.myGlob_ = myGlob;
    this.MyComponentFile_ = MyComponentFile;
  }

  getFiles() {
    const componentFiles = [];
    const directory = this.directory_;
    const MyComponentFile = this.MyComponentFile_;
    this.myGlob_.sync(this.directory_ + '/**/*.js').forEach(function(file) {
      const componentFile = new MyComponentFile(directory, file);
      componentFiles.push(componentFile);
    });
    return componentFiles;
  }

  async writeRoutes(routesPath, myFs = fs, MyComponentRoute = ComponentRoute) {
    let fileContent = "import React from 'react';\n";
    fileContent += "import {Route} from 'react-router-dom';\n";
    fileContent += "class Routes extends React.Component {\nrender() {return (<div>\n";
    this.getFiles().forEach((componentFile) => {
      const componentRoute = new MyComponentRoute(routesPath, componentFile);
      fileContent += componentRoute.getRoute()+"\n";
    });
    fileContent += "</div>);}\n}\nexport default Routes\n";
    
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

module.exports = ComponentTree;
