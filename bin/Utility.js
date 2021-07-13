const path = require('path');
const fx = require('mkdir-recursive');
const async = require('async');
const log = require('pretty-log');
const fs = require('fs-extra');

module.exports.mkDirByPathSync = function (
    targetDir, {
        isRelativeToScript = false
    } = {}
) {
    log.debug(`Creating path: ${targetDir}`);
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fx.mkdirSync(curDir);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }

        return curDir;
    }, initDir);
};

module.exports.stackCartridges = function (
    cartridges,
    directory,
    tmpDirectory,
    callback
) {
    log.debug(
        `Smashing the following cartridges together: ${cartridges.join(', ')}`
    );
    log.debug(`Dest Directory: ${tmpDirectory}`);

    log.debug(`Removing ${tmpDirectory}`);
    fs.removeSync(tmpDirectory);

    async.eachSeries(
        cartridges,
        (cartridge, asyncIteratorCallback) => {
            log.debug(
                `Source Directory: ./cartridges/${cartridge}/cartridge/${directory}`
            );

            const sourceDir = `./cartridges/${cartridge}/cartridge/${directory}`;

            if (fs.existsSync(sourceDir)) {
                fs.copySync(
                    sourceDir,
                    tmpDirectory,
                    {
                        overwrite: true
                    }
                );

                log.debug(`Finished Copying files from: ${sourceDir}`);
                asyncIteratorCallback(null);
            } else {
                log.debug(`Directory: ${sourceDir} was not found, skipping...`);
                asyncIteratorCallback(null);
            }
        },
        (err) => {
            callback(err);
        }
    );
};