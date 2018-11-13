#!/usr/bin/env node
const program = require('commander');
const RenderServer = require('../src/render-server');

program
  .version('0.1.0')
  .option('-d, --directory <directory>', 'Specify write directory')
  .option('--port <port>', 'Specify port');

program
  .arguments('<renderDirectory>')
  .action(async function(renderDirectory) {
    let dir = program.directory;
    if (!dir) {
      dir = "./tmp";
    }
    try {
      await new RenderServer().run(renderDirectory, dir, program.port);
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);


