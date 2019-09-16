#!/usr/bin/env node
const program = require('commander');
const ComponentWorkshop = require('../src/component-workshop');

program
  .arguments('<renderDirectory> <gcpProjectId> <storageBucketName>')
  .option('--try-count <tryCount>', 'Specify number of times to try capturing a screenshot')
  .action(async function(renderDirectory, gcpProjectId, storageBucketName, options) {
    try {
      const componentWorkshop = new ComponentWorkshop(renderDirectory, gcpProjectId, storageBucketName);
      try {
        await componentWorkshop.setup();
        await componentWorkshop.captureAll(options.tryCount);
      } finally {
        await componentWorkshop.cleanup();
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
