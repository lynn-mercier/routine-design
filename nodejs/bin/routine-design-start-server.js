#!/usr/bin/env node
const program = require('commander');
const LocalStorage = require('../src/local-storage');

program
  .arguments('<routesPath>')
  .option('--port <port>', 'Specify port')
  .option('--name <name>', 'Specify name')
  .action(async function(routesPath, options) {
    try {
      const localStorage = new LocalStorage();
      const routesServer = localStorage.createRoutesServer(options.name);
      await routesServer.emptyDirectory();
      await routesServer.write(routesPath);
      await routesServer.startServer(options.port);
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);


