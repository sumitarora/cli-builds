"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SilentError = require('silent-error');
const chalk = require('chalk');
const common_tags_1 = require("common-tags");
const config_1 = require("../models/config");
function getAppFromConfig(nameOrIndex) {
    const apps = config_1.CliConfig.getValue('apps');
    if (!apps) {
        throw new SilentError(chalk.red('Unable to find any apps in `.angular-cli.json`.'));
    }
    if (nameOrIndex) {
        if (nameOrIndex.match(/^[0-9]+$/)) {
            const index = parseInt(nameOrIndex.toString(), 10);
            if (apps[index]) {
                return apps[index];
            }
        }
        else {
            const filtered = apps.filter((currentApp) => currentApp.name === nameOrIndex);
            if (filtered.length > 0) {
                return filtered[0];
            }
        }
    }
    else {
        return apps[0];
    }
    throw new SilentError(chalk.red(common_tags_1.oneLine `
    Unable to find app with name or index.
    Verify the configuration in \`.angular-cli.json\`
  `));
}
exports.getAppFromConfig = getAppFromConfig;
//# sourceMappingURL=/private/var/folders/70/r7lbk4zj0t791wwf4lxrn87c0000gn/t/angular-cli-builds11752-80737-h4wwoz.f35tye3ik9/angular-cli/utilities/app-utils.js.map