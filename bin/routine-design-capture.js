#!/usr/bin/env node
const program = require('commander');
const Capturer = require('../src/capturer');
const ComponentTree = require('../src/component-tree');

program
  .option('--port <port>', 'Specify port');

program
  .arguments('<projectId> <storageBucketName> <renderDirectory> [captureDirectory]')
  .action(async function(projectId, storageBucketName, renderDirectory, captureDirectory) {
    try {
      const componentTree = new ComponentTree(renderDirectory);
      if (!captureDirectory) {
        captureDirectory = '';
      }
      const componentDirectory = componentTree.getDirectories().get(captureDirectory);
      await new Capturer().run(projectId, storageBucketName, componentDirectory, program.port);
      process.exit(0);
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);
