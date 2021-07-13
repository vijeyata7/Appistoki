/* global exec */
/**
 * Compile CSS
 *
 * This Script can be used to compile the CSS assets for this application.
 *
 * The script will prompt for four parameters:
 * Brand: This should be one of the brands defined in the main package.json
 * ENV: This should be prod or dev. Production build will minimize / compress the CSS.
 * Debug: This should be yes or no, if you want debug messaging to show up
 * Watch: This should be yes or no, if you want to watch and automatically compile assets
 *
 * Overview:
 * This script will take either all brands or one specific brand, anaylyze the package.json
 * for that Brand and then 'stack' all of the dependent cartridges on top of one another.
 * Once all cartridges are 'stacked' to a single directory, the files that are not prefixed
 * with an underscore, will be compiled to CSS and written to that brands static folder.
 *
 * Calling this Script:
 * @example
 * // Interactive prompt:
 * node ./bin/Compile-SASS.js
 *
 * @example
 * // Non-Interactive prompt:
 * node ./bin/Compile-SASS.js --brand=app_delmonte_core --env=dev
 *
 */

const path = require('path'); // Abstract method for handling paths cross operating system
const fs = require('fs'); // File System operations
const async = require('async'); // Async Control Flow
const glob = require('glob'); // Find files with a specified 'glob' pattern
const log = require('pretty-log'); // Pretty Logging
const prompt = require('prompt'); // Interactive Command Line Prompt
const optimist = require('optimist'); // Handle the parameters passed to this script
const fileWatch = require('node-watch'); // File Watcher
const md5File = require('md5-file'); // MD5 Hash files
const crypto = require('crypto'); // Used to MD5 Hash Content
const webpack = require('webpack'); // Webpack
const ExtractTextPlugin = require('sgmf-scripts')['extract-text-webpack-plugin']; // this plugin is deprecated & will need to be replaced (may cause compilation issues; requires config change)
const fsExtra = require('fs-extra'); // File System Extras
const uglifycss = require('uglifycss'); // Uglify CSS

require('shelljs/make'); // Added comands for File System Operations

const utility = require('./Utility'); // Utility functions for Asset Compilation


const walkSync = function (dir, filelist) {
    let files = fs.readdirSync(dir);

    let filelist1 = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist1 = walkSync(path.join(dir, file), filelist1);
        } else {
            filelist1.push(path.join(dir, file));
        }
    });

    return filelist1;
};


// Temporary directory we should copy assets to for compiling
const tmpDirectory = './.tmp';

// The SASS directory for any relevant cartridges
const sassSource = 'client/default/scss';

// The CSS Destination directory for any relevant cartridges
const cssDest = 'static/default/css';

// The Glob to buse to find SASS files
const sassGlob = '/**/[^_]*.scss';

// Get the path of the repo
let pathParts = __dirname.split('/');
pathParts.pop();
const repoPath = pathParts.join('/');

// As the watcher been initialized?
let brandsWatching = {};

// A reference to the JSON contained in the Application package.json
const appPackageJSON = JSON.parse(fs.readFileSync('./package.json'));

// If the Temporary directory doesn't exist, create it asynchronously
if (!fs.existsSync(tmpDirectory)) {
    fs.mkdirSync(tmpDirectory);
}

// Get the array of all brands from the application package.json
const allBrands = appPackageJSON.brands;

allBrands.forEach((brand) => {
    brandsWatching[brand] = false;
});

/**
 * The Schema to be used for the command line prompt
 *
 * Properties:
 * - brand (should be one of the brands in the package.json or all)
 * - env (should be dev or prod)
 * - debug (should debug messages be shown?)
 */
const schema = {
    properties: {
        brand: {
            pattern: new RegExp(`all|${allBrands.join('|')}`),
            message: `Brand must be one of the following: all | ${allBrands.join(
                ' | '
            )}`,
            required: true,
            default: 'all'
        },
        env: {
            pattern: new RegExp('prod|dev'),
            message: 'env must be one of the following: prod | dev',
            required: true,
            default: 'dev'
        },
        debug: {
            pattern: new RegExp('yes|no'),
            message: 'debug must be one of the following: yes | no',
            required: false,
            default: 'no'
        },
        watch: {
            pattern: new RegExp('yes|no'),
            message: 'watch must be one of the following: yes | no',
            required: false,
            default: 'no'
        }
    }
};

/**
 * Script Finale
 * This function should be executed at the end of compilation. It will
 * show any errors present or show a success messsage with the amount of time
 * it took to execute.
 *
 * @param {Error} err an errors that occured
 * @param {Integer} startTime Timestamp for when the process started
 */
function finale(err, startTime) {
    if (err) log.error(`\x1b[30m\x1b[41m${err}\x1b[0m`);
    else {
        const endTime = Date.now();
        log.success('Successfully compiled CSS!');
        log.success(
            `Time to build: ${Math.floor((endTime - startTime) / 1000)} Seconds`
        );
    }
}

/**
 * Write Generated CSS to a destination file
 *
 * @param {Error} err Any errors from the calling source function
 * @param {string} result The compiled CSS
 * @param {string} file The SASS file that was compiled
 * @param {string} brandCartridge The Brand Cartridge this CSS was compiled for
 * @param {string} cssDestDir The CSS destination directory to write the file to
 * @param {string} env The environment this build is running for
 * @param {function} callback A callback to execute when finished writing
 */
function writeCSS(err, result, file, brandCartridge, cssDestDir, env, callback) {
    if (err) log.error(`Write CSS: ${err}`);

    let destFile = file.replace(
        path.join(
            path.resolve(tmpDirectory),
            brandCartridge,
            'css'
        ),
        path.join(
            __dirname,
            '../',
            'cartridges',
            brandCartridge,
            'cartridge',
            cssDestDir
        )
    );

    /**
     * Minify the CSS if the environment is production
     */
    let compiledCSS;

    if (env === 'prod') {
        log.debug(`Uglifing CSS: ${file}`);
        compiledCSS = uglifycss.processString(
            result.toString(),
            { uglyComments: true, expandVars: true }
        );
    } else {
        compiledCSS = result.toString();
    }

    let destFileMD5 = 'notfound';

    if (fs.existsSync(destFile)) {
        destFileMD5 = md5File.sync(destFile) + '';
    }

    let srcMD5 = crypto.createHash('md5').update(compiledCSS).digest('hex') + '';

    log.debug(`${file} : DEST File MD5: ${destFileMD5}`);
    log.debug(`${file} : Source MD5: ${srcMD5}`);

    if (srcMD5 !== destFileMD5) {
        log.debug(`Writing CSS content for file: ${destFile}`);
        const destDir = path.dirname(destFile);

        fsExtra.mkdirpSync(destDir);

        fs.writeFile(destFile, compiledCSS, (err) => {
            if (err) {
                log.error(`Write File: ${err}`);
            }
            callback(err);
        });
    } else {
        log.debug('File unchanged, skipping write');
        callback(err);
    }
}

/**
 * Build SASS files for a Brand Cartridge
 *
 * @param {string} globPattern Glob pattern to be used to find files
 * @param {string} brandCartridge The Brand Cartridge to compile SASS from
 * @param {string} cssDestDir The destination directory for the compiled CSS
 * @param {string} env The environment parameter that we should respect
 * @param {function} callback A callback to execute when finished compiling
 */
function buildSass(globPattern, brandCartridge, cssDestDir, env, callback) {
    log.debug(`CSS Dest Dir: ${cssDestDir}`);
    // Find any files that match the glob pattern
    glob(globPattern, (er, files) => {
        log.debug(files);

        let entryFiles = {};

        files.forEach((file) => {
            const destFile = file.replace(`./.tmp/${brandCartridge}/scss/`, '').replace('.scss', '');
            entryFiles[destFile] = file;
        });

        let webpackConfig = {
            name: 'SASS',
            entry: entryFiles,
            mode: env === 'prod' ? 'production' : 'development',
            output: {
                path: path.resolve(
                    `./.tmp/${brandCartridge}/css/`
                ),
                filename: '[name].css'
            },
            resolve: {
                alias: {
                    base: path.resolve(__dirname, '../cartridges/app_storefront_base/cartridge/client/default/scss/'),
                    delmonte_core: path.resolve(__dirname, '../cartridges/app_delmonte_core/cartridge/client/default/scss/')
                }
            },
            module: {
                rules: [{
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        use: [{
                            loader: 'css-loader',
                            options: {
                                url: false,
                                sourceMap: true
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer')()
                                ],
                                sourceMap: true
                            }
                        }, {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [
                                    path.resolve('node_modules'),
                                    path.resolve('node_modules/flag-icon-css/sass')
                                ],
                                precision: 10,
                                sourceMap: true
                            }
                        }]
                    })
                }]
            },
            plugins: [
                new ExtractTextPlugin({
                    filename: '[name].css'
                })
            ],
            cache: false,
            bail: true
        };

        if (env === 'prod') {
            webpackConfig.optimization = {
                minimize: true,
                mangleWasmImports: true,
                removeAvailableModules: true,
                removeEmptyChunks: true,
                occurrenceOrder: true
            };
        }

        console.log(webpackConfig);
        const compiler = webpack(webpackConfig);

        compiler.run((err, stats) => {
            if (err) {
                log.error(err.stack || err);

                if (err.details) {
                    log.error(err.details);
                }

                callback(err, stats);
                return;
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                callback(info.errors, stats);
                return;
            }

            if (stats.hasWarnings()) {
                log.warn(info.warnings);
            }

            const cssFiles = walkSync(path.resolve(
                `./.tmp/${brandCartridge}/css/`
            ));

            log.success(cssFiles);

            async.each(cssFiles, function (file, asyncCallback) {
                // Perform operation on file here.
                log.debug(`Processing CSS file ${file}`);

                writeCSS(err, fs.readFileSync(file), file, brandCartridge, cssDestDir, env, asyncCallback);
            }, function (err) {
                callback(err, stats);
            });
        });
    });
}

/**
 * Build SASS for a Brand Cartridge
 *
 * @param {string} brandCartridge The Brand Cartridge to compile SASS from
 * @param {string} env The environment parameter that we should respect
 * @param {boolean} watch Shoud this function watch for file changes?
 * @param {function} callback A callback to execute when finished building the brands SASS files
 */
function buildBrand(brandCartridge, env, watch, callback) {
    // Keep track of the time the script started, so we can calculate run time at the end
    let startTime = Date.now();

    const brandParts = brandCartridge.split('_');

    // Pop the "core" part off
    brandParts.pop();

    const brandCode = brandParts.length > 2 ? `${brandParts.pop()} - ${brandParts.pop()}` : brandParts.pop();

    log.success(`Building CSS for brand: ${brandCode.toUpperCase()}`);

    log.debug(`Brand ${brandCartridge}`);
    log.debug(`ENV ${env}`);
    log.debug(`Should Watch? ${watch}`);
    log.debug(`Callback ${callback}`);

    fsExtra.removeSync(`${tmpDirectory}/${brandCartridge}`);

    fs.mkdirSync(`${tmpDirectory}/${brandCartridge}`);
    fs.mkdirSync(`${tmpDirectory}/${brandCartridge}/scss`);
    fs.mkdirSync(`${tmpDirectory}/${brandCartridge}/css`);

    let packageJSON = JSON.parse(
        fs.readFileSync(`./cartridges/${brandCartridge}/package.json`)
    );

    let cartridges = packageJSON.buildPath;

    /**
     * Take all of the cartridges defined in the brand package.json and stack
     * them on top of each other in the .tmp directory.  When that is complete
     * execute the buildSASS function to compile the files from the .tmp directory.
     */
    utility.stackCartridges(
        cartridges,
        sassSource,
        `${tmpDirectory}/${brandCartridge}/scss`,
        () => {
            log.debug('Cartridges stacked!');

            log.debug('Building SASS...');

            buildSass(
                `${tmpDirectory}/${brandCartridge}/scss${sassGlob}`,
                brandCartridge,
                cssDest,
                env,
                err => {
                    let filesToWatch = cartridges.map((cartridge) => {
                        return `./cartridges/${cartridge}/cartridge/client/default/scss/`;
                    });

                    filesToWatch = filesToWatch.filter((scssfolder) => {
                        return fs.existsSync(`${scssfolder}`);
                    });

                    finale(err, startTime);

                    if (watch) {
                        log.success('Watching for file changes ...');
                        if (!brandsWatching[brandCartridge]) {
                            fileWatch(filesToWatch, {
                                recursive: true
                            }, function (event, filepath) {
                                log.warn(`File: ${filepath.replace(repoPath, '')} was ${event}, rebuilding ...`);
                                buildBrand(brandCartridge, env, watch, null);
                            });
                            brandsWatching[brandCartridge] = true;
                        }
                    }

                    if (typeof callback === 'function') {
                        callback(err);
                    }
                }
            );
        }
    );
}

prompt.override = optimist.argv;

prompt.start();

// Retrieve the results of the prompt and execute the compiliation of the SASS files
prompt.get(schema, (err, results) => {
    if (results.debug === 'no') {
        log.debug = function () {};
    }

    log.debug(JSON.stringify(results));

    /**
     * If 'all' was specified, compile all brands in parrallel
     * Otherwise compile the brand specified
     */
    if (results.brand === 'all') {
        log.success('Compiling all brands');
        console.log(allBrands)
        async.each(allBrands, (brand, callback) => {
            if (brand !== 'int_braintree') {
                buildBrand(brand, results.env, results.watch === 'yes', callback);
            }
        });
    } else {
        log.success(`Compiling ${results.brand} brand`);
        buildBrand(results.brand, results.env, results.watch === 'yes');
    }
});
