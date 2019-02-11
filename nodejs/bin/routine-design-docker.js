#!/usr/bin/env node
const program = require('commander');
const LocalStorage = require('../src/local-storage');

program
  .command('build-node-sass')
  .option('--container-name <containerName>', 'Specify a Docker container name')
  .action(async function(options) {
    try {
      const localStorage = new LocalStorage();
      const routineDesignContainer = localStorage.createRoutineDesignContainer(options.containerName);
      try {
        await routineDesignContainer.start();
        await routineDesignContainer.buildNodeSass();
      } finally {
        await routineDesignContainer.cleanup();
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program
  .command('run <command>')
  .option('--container-name <containerName>', 'Specify a Docker container name')
  .option('--detach', 'Run in detached mode')
  .action(async function(command, options) {
    try {
      const localStorage = new LocalStorage();
      const routineDesignContainer = localStorage.createRoutineDesignContainer(options.containerName);
      try {
        await routineDesignContainer.start();
        await routineDesignContainer.run(command, options.detach);
      } finally {
        await routineDesignContainer.cleanup();
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
