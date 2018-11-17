const glob = require('glob');
const path = require('path');
const fs = require('fs');

class RoutesSetup {
  constructor(renderDirectory, routesPath, myGlob = glob) {
    this.renderDirectory_ = renderDirectory;
    this.routesPath_ = routesPath;
    this.myGlob_ = myGlob;
  }

  getRoutes() {
    const routes = [];
    const routesPath = this.routesPath_;
    const renderDirectory = this.renderDirectory_;
    this.myGlob_.sync(this.renderDirectory_ + '/**/*.js').forEach(function(file) {
      const dirname = path.dirname(file);
      const route = {
        importPath: path.join(path.relative(path.dirname(routesPath), dirname), path.basename(file)),
        path: path.relative(renderDirectory, dirname)
      };
      if (route.importPath[0]!=".") {
        route.importPath = "./"+route.importPath;
      }
      if (path.basename(file)!="index.js") {
        route.path = path.join(path.relative(renderDirectory, dirname), path.basename(file, '.js'));
      }
      routes.push(route);
    });
    return routes;
  }

  async writeJavaScript(myFs = fs) {
    let fileContent = "import React from 'react';\n";
    fileContent += "import {Route} from 'react-router-dom';\n";
    fileContent += "class Routes extends React.Component {\nrender() {return (<div>\n";
    this.getRoutes().forEach((route) => {
      fileContent += "<Route exact path='/"+route.path+"' component={require('"+route.importPath+"').default} />\n";
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
