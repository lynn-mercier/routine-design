#!/usr/bin/env node
const program = require('commander');

program
  .command('capture', 'Capture screenshots for a directory')
  .command('render', 'Render a directory')
  .command('write', 'Write files')
  .command('start-server', 'Start server')
  .parse(process.argv);
