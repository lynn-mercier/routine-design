#!/usr/bin/env node
const program = require('commander');
const WebpackSetup = require('../src/webpack-setup');
const Application = require('../src/application');

program
  .version('0.1.0')
  .option('--port <port>', 'Specify port');

program
  .arguments('<routesPath>')
  .action(async function(routesPath) {
    try {
      const webpackSetup = new WebpackSetup();
      await webpackSetup.emptyDirectory();
      await webpackSetup.write(routesPath);
      await webpackSetup.startServer(program.port);
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);


