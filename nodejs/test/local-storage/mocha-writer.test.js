const {expect} = require('chai');
const fs = require('fs');
const td = require('testdouble');
const mockFs = td.object(fs);
const MochaWriter = require('../../src/local-storage/mocha-writer');
const LocalDirectory = td.constructor(require('../../src/local-storage/local-directory'));

describe('local-storage/MochaWriter', function() {
  //TODO make tmp dir
  const mochaWriter = new MochaWriter();
  td.when(LocalDirectory.prototype.getFullPath()).thenReturn('foo');
  it('#write(renderDirectory, gcpProjectId, storageBucketName, name)', async function() {
    const promise = mochaWriter.write('./render', 'gcp-project', 'storage-bucket', "foo", 20, LocalDirectory, mockFs).then(() => {
      expect(td.explain(LocalDirectory).calls[0].args[0]).to.equal('foo');
      expect(td.explain(mockFs.writeFile).calls[0].args[0]).to.equal('./foo/index.test.js');
      expect(td.explain(mockFs.writeFile).calls[0].args[1]).to.equal(fs.readFileSync('test/local-storage/golden.js', 'utf8'));
    });
    td.explain(mockFs.writeFile).calls[0].args[2]();
    return promise;
  });
});
