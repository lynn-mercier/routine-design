#!/usr/bin/env node
const program = require('commander');
const Application = require('../src/application');
const RoutesSetup = require('../src/routes-setup');

program
  .version('0.1.0')

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
  .command('routes <renderDirectory> <routesPath>')
  .action(async function(renderDirectory, routesPath) {
    try {
      await new RoutesSetup(renderDirectory, routesPath).writeJavaScript();
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);


