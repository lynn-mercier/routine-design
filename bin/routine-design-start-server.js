#!/usr/bin/env node
const program = require('commander');
const WebpackSetup = require('../src/webpack-setup');
const Application = require('../src/application');

program
  .version('0.1.0')
  .option('-d, --directory <directory>', 'Specify write directory')
  .option('--port <port>', 'Specify port');

program
  .command('routes <routesPath>')
  .action(async function(routesPath) {
    let dir = program.directory;
    if (!dir) {
      dir = "./tmp";
    }
    try {
      const webpackSetup = new WebpackSetup(dir, dir+"/index.js");
      await webpackSetup.emptyDirectory();
      await webpackSetup.write(routesPath);
      await webpackSetup.startServer(program.port);
    } catch (err) {
      console.log(err.message);
    }
  });

program
  .command('javascript <javaScriptPath> <element>')
  .action(async function(javaScriptPath, element) {
    let dir = program.directory;
    if (!dir) {
      dir = "./tmp";
    }
    try {
      const webpackSetup = new WebpackSetup(dir, javaScriptPath);
      await webpackSetup.emptyDirectory();
      await new Application().writeHtml(dir, element);
      await webpackSetup.startServer(program.port);
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);


