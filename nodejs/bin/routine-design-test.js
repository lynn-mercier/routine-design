#!/usr/bin/env node
const program = require('commander');
const Mocha = require('mocha');
const MochaWriter = require('../src/local-storage/mocha-writer');

program
  .arguments('<renderDirectory> <gcpProjectId> <storageBucketName>')
  .option('--try-count <tryCount>', 'Specify number of times to try capturing a screenshot')
  .action(async function(renderDirectory, gcpProjectId, storageBucketName, options) {
    try {
      await new MochaWriter().write(renderDirectory, gcpProjectId, storageBucketName, options.tryCount);
      const mocha = new Mocha({
        timeout: 60000
      });
      mocha.addFile('./routine-design-output/mocha-writer/index.test.js');
      const promise = new Promise(function(resolve, reject) {
        mocha.run(() => {
          resolve();
        });
      });
      await promise;
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
