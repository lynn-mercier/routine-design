#!/usr/bin/env node
const program = require('commander');
const RoutineDesignTree = require('../src/routine-design-tree');

program
  .option('--port <port>', 'Specify port');

program
  .arguments('<renderDirectory>')
  .action(async function(renderDirectory) {
    try {
      const routineDesignTree = new RoutineDesignTree(renderDirectory);
      await routineDesignTree.render(program.port);
    } catch (err) {
      console.error(err);
    }
  });

program.parse(process.argv);


