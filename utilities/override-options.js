"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloneDeep = require('lodash/cloneDeep');
function overrideOptions(original, overrides) {
    let copy = cloneDeep(original);
    overrides.forEach(override => {
        const option = copy.find((opt) => opt.name == override.name);
        if (option) {
            Object.assign(option, override);
        }
    });
    return copy;
}
exports.overrideOptions = overrideOptions;
//# sourceMappingURL=/private/var/folders/70/r7lbk4zj0t791wwf4lxrn87c0000gn/t/angular-cli-builds11752-80737-h4wwoz.f35tye3ik9/angular-cli/utilities/override-options.js.map