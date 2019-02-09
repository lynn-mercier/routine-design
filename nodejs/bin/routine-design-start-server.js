#!/usr/bin/env node
const program = require('commander');
const LocalStorage = require('../src/local-storage');

program
  .option('--port <port>', 'Specify port')
  .option('--name <name>', 'Specify name');

program
  .arguments('<routesPath>')
  .action(async function(routesPath) {
    try {
      const localStorage = new LocalStorage();
      const routesServer = localStorage.createRoutesServer(program.name);
      await routesServer.emptyDirectory();
      await routesServer.write(routesPath);
      await routesServer.startServer(program.port);
    } catch (err) {
      console.error(err);
    }
  });

program.parse(process.argv);


