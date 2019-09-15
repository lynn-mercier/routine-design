#!/usr/bin/env node
const program = require('commander');
const ComponentWorkshop = require('../src/component-workshop');

program
  .arguments('<renderDirectory> <gcpProjectId> <storageBucketName>')
  .action(async function(renderDirectory, gcpProjectId, storageBucketName) {
    try {
      const componentWorkshop = new ComponentWorkshop(renderDirectory, gcpProjectId, storageBucketName);
      try {
        await componentWorkshop.setup();
        await componentWorkshop.captureAll();
      } finally {
        await componentWorkshop.cleanup();
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
