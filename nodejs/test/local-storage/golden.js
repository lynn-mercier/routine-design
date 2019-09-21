const RoutineDesign = require('routine-design');
const assert = require('assert');
describe('render', function() {
const componentWorkshop = new RoutineDesign().createComponentWorkshop('./render', 'gcp-project', 'storage-bucket');
before(async function() {
await componentWorkshop.setup();
});
const pixelValidators = componentWorkshop.getPixelValidators();
for (pixelValidator in pixelValidators) {
it(pixelValidator.getComponentDirectoryId(), async function() {
const result = await pixelValidator.validate(20);
assert(result.allPass, result.gcpUrl);
});
}
after(async function() {
await componentWorkshop.cleanup();
});
});