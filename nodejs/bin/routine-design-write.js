#!/usr/bin/env node
const program = require('commander');

program
  .command('html <element> <htmlPath>')
  .option('--css-filename <cssFilename>', 'Specify CSS filename')
  .option('--javascript-filename <javaScriptFilename>', 'Specify JavaScript filename')
  .action(async function(element, htmlPath, options) {
    try {
      const Application = require('../src/application');
      await new Application(options.cssFilename, options.javascriptFilename).writeHtml(htmlPath, element);
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program
  .command('routes <directory> <routesPath>')
  .action(async function(directory, routesPath) {
    try {
      const RoutineDesignTree = require('../src/routine-design-tree');
      const routineDesignTree = new RoutineDesignTree(directory);
      await routineDesignTree.getComponentTree().writeRoutes(routesPath);
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);


