#!/usr/bin/env node
const program = require('commander');

program
  .command('capture', 'Capture screenshots for a directory')
  .parse(process.argv);
