const RoutineDesign = require('routine-design');
const assert = require('assert');
describe('render', function() {
const componentWorkshop new RoutineDesign().createComponentWorkshop('./render', 'gcp-project', 'storage-bucket');
before(async function() {
await componentWorkshop.setup();
});
const pixelValidators = componentWorkshop.getPixelValidators();
for (pixelValidator in pixelValidators) {
it(pixelValidator.getName(), async function() {
const result = await pixelValidator.validate();
assert(result.allPass, result.gcpUrl);
});
}
after(async function() {
await componentWorkshop.cleanup();
});
});