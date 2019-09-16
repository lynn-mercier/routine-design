#!/usr/bin/env node
const program = require('commander');
const Mocha = require('mocha');
const MochaWriter = require('../src/local-storage/mocha-writer');

program
  .arguments('<renderDirectory> <gcpProjectId> <storageBucketName>')
  .action(async function(renderDirectory, gcpProjectId, storageBucketName) {
    try {
      await new MochaWriter().write(renderDirectory, gcpProjectId, storageBucketName);
      const mocha = new Mocha({
        timeout: 60000
      });
      mocha.addFile('./routine-design-out/mocha-writer/index.test.js');
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
