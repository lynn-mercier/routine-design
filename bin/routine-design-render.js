#!/usr/bin/env node
const program = require('commander');
const RenderServer = require('../src/render-server');

program
  .version('0.1.0')
  .option('--port <port>', 'Specify port');

program
  .arguments('<renderDirectory>')
  .action(async function(renderDirectory) {
    try {
      await new RenderServer().run(renderDirectory, program.port);
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);


