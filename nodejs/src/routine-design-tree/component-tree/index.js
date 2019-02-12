const glob = require('glob');
const fs = require('fs');
const path = require('path');
const ComponentDirectory = require('./component-directory')
const ComponentRoute = require('./component-route');

class ComponentTree {
  constructor(directory, myGlob = glob, MyComponentDirectory = ComponentDirectory) {
    this.directory_ = directory;
    this.myGlob_ = myGlob;
    this.MyComponentDirectory_ = MyComponentDirectory;
  }

  getDirectories() {
    if (this.directories_) {
      return this.directories_;
    }

    const dirnames = [];
    this.myGlob_.sync(this.directory_ + '/**/*.js').forEach(function(file) {
      const dirname = path.dirname(file);
      if (!dirnames.includes(dirname)) {
        dirnames.push(dirname);
      }
    });

    this.directories_ = new Map();
    dirnames.forEach((dirname) => {
      const componentDirectory = new this.MyComponentDirectory_(this.directory_, dirname);
      this.directories_.set(componentDirectory.getPath(), componentDirectory);
    })
    return this.directories_;
  }

  async writeRoutes(routesPath, myFs = fs, MyComponentRoute = ComponentRoute) {
    let fileContent = "import React from 'react';\n";
    fileContent += "import {Route} from 'react-router-dom';\n";
    fileContent += "class Routes extends React.Component {\nrender() {return (<div>\n";
    this.getDirectories().forEach(function(componentDirectory) {
      componentDirectory.getFiles().forEach(function(componentFile) {
        const componentRoute = new MyComponentRoute(routesPath, componentFile);
        fileContent += componentRoute.getRoute()+"\n";
      });
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
