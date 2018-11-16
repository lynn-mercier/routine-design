const fs = require('fs');
const path = require('path');

class EntryPoint {
  constructor(rootId = "root") {
    this.rootId_ = rootId;
  }

  async write(webpackDir, routesPath, javaScriptPath, myFs = fs) {
    const sassFilename = "index.scss";
    const sassPath = path.join(webpackDir, sassFilename);
    myFs.writeFile(sassPath, "", function(err) {});
    let fileContent = "import React from 'react';";
    fileContent += "\nimport ReactDOM from 'react-dom';";
    fileContent += "\nimport {HashRouter} from 'react-router-dom';";
    const sassImport = path.join(path.relative(path.dirname(javaScriptPath), webpackDir), path.basename(sassPath));
    fileContent += "\nimport './"+sassImport+"';";
    const routesImport = path.join(path.relative(path.dirname(javaScriptPath), path.dirname(routesPath)), path.basename(routesPath));
    fileContent += "\nimport Routes from './"+routesImport+"';";
    fileContent += "\nReactDOM.render(<HashRouter><Routes/></HashRouter>,document.getElementById('"+this.rootId_+"'));";
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

  getDiv() {
    return "<div id='"+this.rootId_+"'></div>";
  }
}

module.exports = EntryPoint;
