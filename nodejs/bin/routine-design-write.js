#!/usr/bin/env node
const program = require('commander');
const Application = require('../src/application');
const ComponentTree = require('../src/component-tree');

program
  .command('html <element> <htmlPath>')
  .option('--css-filename <cssFilename>', 'Specify CSS filename')
  .option('--javascript-filename <javaScriptFilename>', 'Specify JavaScript filename')
  .action(async function(element, htmlPath, options) {
    try {
      await new Application(options.cssFilename, options.javascriptFilename).writeHtml(htmlPath, element);
    } catch (err) {
      console.log(err.message);
    }
  });

program
  .command('routes <directory> <routesPath>')
  .action(async function(directory, routesPath) {
    try {
      await new ComponentTree(directory).writeRoutes(routesPath);
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);


