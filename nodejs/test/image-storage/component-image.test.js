const {expect} = require('chai');
const td = require('testdouble');
const ComponentImage = require('../../src/image-storage/component-image');
const randomstring = td.object(require('randomstring'));
const ComponentFile = td.constructor(require('../../src/component-tree/component-file'));
const GcpImage = td.constructor(require('../../src/gcp-image'));
const LocalImage = td.constructor(require('../../src/local-image'));

describe('image-storage/ComponentImage', function() {
  describe('has GCP ID', function() {
    const componentFile = new ComponentFile();
    td.when(componentFile.getPath()).thenReturn('foo');
    const componentImage = new ComponentImage('project-id', 'storage-bucket', componentFile, 'ID', GcpImage);
    describe('#getId', function() {
      it('returns GCP ID', function() {
        expect(componentImage.getId()).to.equal('ID');
      });
    });
    describe('#getGcpPath', function() {
      it("includes ID and component file's path", function() {
        expect(componentImage.getGcpPath()).to.equal('foo/ID.png');
      });
    });
    describe('#createGcpImage', function() {
      const gcpImage = componentImage.createGcpImage();
      it("uses storage bucket", function() {
        expect(td.explain(GcpImage).calls[0].args[0]).to.equal('project-id');
        expect(td.explain(GcpImage).calls[0].args[1]).to.equal('storage-bucket');
      });
      it("uses GCP Path", function() {
        expect(td.explain(GcpImage).calls[0].args[2]).to.equal('foo/ID.png');
      });
    });
  });
  describe('has no GCP ID', function() {
    const componentFile = new ComponentFile();
    const componentImage = new ComponentImage('project-id', 'storage-bucket', componentFile, null, GcpImage);
    describe('#getGcpPath', function() {
      it("throws error", function() {
        let caughtError = false;
        try {
          componentImage.getGcpPath()
        } catch(error) {
          caughtError = true;
        }
        expect(caughtError).to.equal(true);
      });
    });
  });
  it('#saveImage', async function() {
    const componentFile = new ComponentFile();
    const componentImage = new ComponentImage('project-id', 'storage-bucket', componentFile, null, GcpImage);
    const localImage = new LocalImage();
    td.when(randomstring.generate()).thenReturn('random');
    td.when(localImage.getPng()).thenReturn('png');
    return componentImage.saveImage(localImage, randomstring).then(function() {
      expect(componentImage.getId()).to.equal('random');
      expect(td.explain(GcpImage.prototype.upload).calls[0].args[0]).to.equal('png');
    });
  });
});