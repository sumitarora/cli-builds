"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
const chalk_1 = require("chalk");
const common_tags_1 = require("common-tags");
const fs_1 = require("fs");
const path = require("path");
const config_1 = require("../models/config");
const find_up_1 = require("../utilities/find-up");
const resolve = require('resolve');
function _hasOldCliBuildFile() {
    return fs_1.existsSync(find_up_1.findUp('angular-cli-build.js', process.cwd()))
        || fs_1.existsSync(find_up_1.findUp('angular-cli-build.ts', process.cwd()))
        || fs_1.existsSync(find_up_1.findUp('ember-cli-build.js', process.cwd()))
        || fs_1.existsSync(find_up_1.findUp('angular-cli-build.js', __dirname))
        || fs_1.existsSync(find_up_1.findUp('angular-cli-build.ts', __dirname))
        || fs_1.existsSync(find_up_1.findUp('ember-cli-build.js', __dirname));
}
class Version {
    constructor(_version = null) {
        this._version = _version;
        this._semver = null;
        this._semver = _version && new semver_1.SemVer(_version);
    }
    isAlpha() { return this.qualifier == 'alpha'; }
    isBeta() { return this.qualifier == 'beta'; }
    isReleaseCandidate() { return this.qualifier == 'rc'; }
    isKnown() { return this._version !== null; }
    isLocal() { return this.isKnown() && path.isAbsolute(this._version); }
    isGreaterThanOrEqualTo(other) {
        return this._semver.compare(other) >= 0;
    }
    get major() { return this._semver ? this._semver.major : 0; }
    get minor() { return this._semver ? this._semver.minor : 0; }
    get patch() { return this._semver ? this._semver.patch : 0; }
    get qualifier() { return this._semver ? this._semver.prerelease[0] : ''; }
    get extra() { return this._semver ? this._semver.prerelease[1] : ''; }
    toString() { return this._version; }
    static fromProject() {
        let packageJson = null;
        try {
            const angularCliPath = resolve.sync('@angular/cli', {
                basedir: process.cwd(),
                packageFilter: (pkg, _pkgFile) => {
                    packageJson = pkg;
                }
            });
            if (angularCliPath && packageJson) {
                try {
                    return new Version(packageJson.version);
                }
                catch (e) {
                    return new Version(null);
                }
            }
        }
        catch (e) {
            // Fallback to reading config.
        }
        const configPath = config_1.CliConfig.configFilePath();
        if (configPath === null) {
            return new Version(null);
        }
        const configJson = fs_1.readFileSync(configPath, 'utf8');
        try {
            const json = JSON.parse(configJson);
            return new Version(json.project);
        }
        catch (e) {
            return new Version(null);
        }
    }
    static assertAngularVersionIs2_3_1OrHigher(projectRoot) {
        const angularCorePath = path.join(projectRoot, 'node_modules/@angular/core');
        const pkgJson = fs_1.existsSync(angularCorePath)
            ? JSON.parse(fs_1.readFileSync(path.join(angularCorePath, 'package.json'), 'utf8'))
            : null;
        // Just check @angular/core.
        if (pkgJson && pkgJson['version']) {
            const v = new Version(pkgJson['version']);
            if (v.isLocal()) {
                console.warn(chalk_1.yellow('Using a local version of angular. Proceeding with care...'));
            }
            else {
                // Check if major is not 0, so that we stay compatible with local compiled versions
                // of angular.
                if (!v.isGreaterThanOrEqualTo(new semver_1.SemVer('2.3.1')) && v.major != 0) {
                    console.error(chalk_1.bold(chalk_1.red(common_tags_1.stripIndents `
            This version of CLI is only compatible with angular version 2.3.1 or better. Please
            upgrade your angular version, e.g. by running:

            npm install @angular/core@latest
          ` + '\n')));
                    process.exit(3);
                }
            }
        }
        else {
            console.error(chalk_1.bold(chalk_1.red(common_tags_1.stripIndents `
        You seem to not be depending on "@angular/core". This is an error.
      `)));
            process.exit(2);
        }
    }
    static assertPostWebpackVersion() {
        if (this.isPreWebpack()) {
            console.error(chalk_1.bold(chalk_1.red('\n' + common_tags_1.stripIndents `
        It seems like you're using a project generated using an old version of the Angular CLI.
        The latest CLI now uses webpack and has a lot of improvements including a simpler
        workflow, a faster build, and smaller bundles.

        To get more info, including a step-by-step guide to upgrade the CLI, follow this link:
        https://github.com/angular/angular-cli/wiki/Upgrading-from-Beta.10-to-Beta.14
      ` + '\n')));
            process.exit(1);
        }
        else {
            // Verify that there's no build file.
            if (_hasOldCliBuildFile()) {
                console.error(chalk_1.bold(chalk_1.yellow('\n' + common_tags_1.stripIndents `
          It seems like you're using the newest version of the Angular CLI that uses webpack.
          This version does not require an angular-cli-build file, but your project has one.
          It will be ignored.
        ` + '\n')));
            }
        }
    }
    static isPreWebpack() {
        // CliConfig is a bit stricter with the schema, so we need to be a little looser with it.
        const version = Version.fromProject();
        if (version && version.isKnown()) {
            if (version.major == 0) {
                return true;
            }
            else if (version.minor != 0) {
                return false;
            }
            else if (version.isBeta() && !version.toString().match(/webpack/)) {
                const betaVersion = version.extra;
                if (parseInt(betaVersion) < 12) {
                    return true;
                }
            }
        }
        else {
            return _hasOldCliBuildFile();
        }
        return false;
    }
}
exports.Version = Version;
//# sourceMappingURL=/private/var/folders/70/r7lbk4zj0t791wwf4lxrn87c0000gn/t/angular-cli-builds11752-80737-h4wwoz.f35tye3ik9/angular-cli/upgrade/version.js.map