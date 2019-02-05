#!/usr/bin/env node
const program = require('commander');

program
  .command('capture', 'Capture screenshots for a directory')
  .command('pixel-validate', 'Checks that all screenshot images are identical to the screenshots saved on GCP')
  .parse(process.argv);
