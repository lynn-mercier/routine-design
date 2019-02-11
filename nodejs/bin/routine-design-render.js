#!/usr/bin/env node
const program = require('commander');
const RoutineDesignTree = require('../src/routine-design-tree');

program
  .arguments('<renderDirectory>')
  .option('--port <port>', 'Specify port')
  .action(async function(renderDirectory, options) {
    try {
      const routineDesignTree = new RoutineDesignTree(renderDirectory);
      await routineDesignTree.render(options.port);
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);


