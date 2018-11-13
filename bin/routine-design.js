#!/usr/bin/env node
const program = require('commander');

program
  .version('0.1.0')
  .command('render', 'Render a directory')
  .command('write', 'Write files')
  .command('start-server', 'Start server')
  .parse(process.argv);
