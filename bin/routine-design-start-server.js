#!/usr/bin/env node
const program = require('commander');
const RoutesServer = require('../src/routes-server');
const Application = require('../src/application');

program
  .option('--port <port>', 'Specify port');

program
  .arguments('<routesPath>')
  .action(async function(routesPath) {
    try {
      const routesServer = new RoutesServer();
      await routesServer.emptyDirectory();
      await routesServer.write(routesPath);
      await routesServer.startServer(program.port);
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);


