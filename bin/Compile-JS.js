/**
 * Compile JS
 *
 * This Script can be used to compile the Javascript assets for this application.
 *
 * The script will prompt for four parameters:
 * Brand: This should be one of the brands defined in the main package.json
 * ENV: This should be prod or dev. Production build will minimize / compress the CSS.
 * Debug: This should be yes or no, if you want debug messaging to show up
 * Watch: This should be yes or no, if you want to watch and automatically compile assets
 *
 * Overview:
 * This script will take either all brands or one specific brand, anaylyze the package.json
 * for that Brand and then "stack" all of the dependent cartridges on top of one another.
 * Once all cartridges are "stacked" to a single directory, execute webpack on that directory
 * to compile the Javascript assets.
 *
 * Calling this Script:
 * @example
 * // Interactive prompt:
 * node ./bin/Compile-JS.js
 *
 * @example
 * // Non-Interactive prompt:
 * node ./bin/Compile-JS.js --brand=app_olivergal_core --env=dev --debug=no --watch=no
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
const webpack = require('webpack'); // Webpack

const utility = require('./Utility'); // Utility functions for Asset Compilation

log.success('Starting to compile JS');

// Temporary directory we should copy assets to for compiling
const tmpDirectory = './.tmp';

// The SASS directory for any relevant cartridges
const jsSource = 'client/default/js';

// The CSS Destination directory for any relevant cartridges
const jsDest = 'static/default/js';

// The Glob to use to find JS files
const jsGlob = '/*.js';

// Get the path of the repo
let pathParts = __dirname.split('/');
pathParts.pop();
const repoPath = pathParts.join('/');

// As the watcher been initialized?
let brandsWatching = {};

// A reference to the JSON contained in the Application package.json
const appPackageJSON = JSON.parse(fs.readFileSync('./package.json'));

// Bootstrap Packages for WebPack
const bootstrapPackages = {
    Alert: 'exports-loader?Alert!bootstrap/js/src/alert',
    // Button: 'exports-loader?Button!bootstrap/js/src/button',
    Carousel: 'exports-loader?Carousel!bootstrap/js/src/carousel',
    Collapse: 'exports-loader?Collapse!bootstrap/js/src/collapse',
    Dropdown: 'exports-loader?Dropdown!bootstrap/js/src/dropdown',
    Modal: 'exports-loader?Modal!bootstrap/js/src/modal',
    Popover: 'exports-loader?Popover!bootstrap/js/src/popover',
    Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/src/scrollspy',
    Tab: 'exports-loader?Tab!bootstrap/js/src/tab',
    Tooltip: 'exports-loader?Tooltip!bootstrap/js/src/tooltip',
    Util: 'exports-loader?Util!bootstrap/js/src/util'
};

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
 * @param {Error} err were there any errors to log?
 * @param {Integer} startTime when did the process start?
 */
function finale(err, startTime) {
    if (err) log.error(`\x1b[30m\x1b[41m$${err}\x1b[0m`);
    else {
        const endTime = Date.now();
        log.success('Successfully compiled JS!');
        log.success(
            `Time to build: ${Math.floor((endTime - startTime) / 1000)} Seconds`
        );
    }
}

/**
 * Create Javascript Path
 * Find the Javascript files to be included in WebPack
 *
 * @param {string} globPattern Glob Pattern to Search for
 * @param {Function} callback Function to execute results with
 */
function createJSPath(globPattern, callback) {
    var result = {};

    glob(globPattern, function (er, files) {
        files.forEach(function (filePath) {
            var name = path.basename(filePath, '.js');
            result[name] = filePath;
        });

        callback(er, result);
    });
}

/**
 * Build JS files for a Brand Cartridge
 *g
 * @param {string} globPattern Glob pattern to be used to find files
 * @param {string} brandCartridge The Brand Cartridge to compile JS from
 * @param {string} cssDest The destination directory for the compiled JS
 * @param {string} env The environment parameter that we should respect
 * @param {Function} callback The function to execute when finished
 * @callback callback A callback to execute when finished compiling
 */
function buildJS(globPattern, brandCartridge, cssDest, env, callback) {
    const brandParts = brandCartridge.split('_');
    brandParts.pop();
    const brandCode = brandParts.length > 2 ? `${brandParts.pop()} - ${brandParts.pop()}` : brandParts.pop();

    log.success(`Building JS for brand: ${brandCode.toUpperCase()}`);

    createJSPath(globPattern, (err, jsFiles) => {
        if (err) {
            log.error(err);
            callback(err);
            return;
        }

        log.debug(`JS files to build:\n${JSON.stringify(jsFiles)}`);

        let webpackConfig = {
            name: 'js',
            entry: jsFiles,
            mode: env === 'prod' ? 'production' : 'development',
            output: {
                path: path.resolve(
                    `./cartridges/${brandCartridge}/cartridge/static/default/js/`
                ),
                filename: '[name].js'
            },
            resolve: {
                alias: {
                    base: path.resolve(__dirname, '../cartridges/app_storefront_base/cartridge/client/default/js/'),
                    plugin_applepay: path.resolve(__dirname, '../cartridges/plugin_applepay/cartridge/client/default/js/'),
                    olivergal_core: path.resolve(__dirname, '../cartridges/app_olivergal_core/cartridge/client/default/js/'),
                    int_braintree: path.resolve(__dirname, '../cartridges/int_braintree/cartridge/client/default/js/')
                }
            },
            module: {
                rules: [{
                    test: /\.js$/,
                    exclude: [
                        /node_modules[/|\\](@vimeo|jquery-datepicker)/
                    ],
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            babelrc: true
                        }
                    }]
                }]
            },
            plugins: []
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

        webpackConfig.plugins.push(
            new webpack.ProvidePlugin(bootstrapPackages)
        );

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

            callback(err, stats);
        });
    });
}

/**
 * Build JS for a Brand Cartridge
 *
 * @param {string} brandCartridge The Brand Cartridge to compile JS from
 * @param {string} env The environment parameter that we should respect
 * @param {boolean} watch Shoud this function watch for file changes?
 * @param {Function} callback A callback to execute when finished building the brands JS files
 */
function buildBrand(brandCartridge, env, watch, callback) {
    // Keep track of the time the script started, so we can calculate run time at the end
    let startTime = Date.now();

    log.debug(
        `Building JS for brand: ${brandCartridge
            .split('_')
            .pop()
            .toUpperCase()}`
    );

    log.debug(`Brand ${brandCartridge}`);
    log.debug(`ENV ${env}`);
    log.debug(`Should Watch? ${watch}`);
    log.debug(`Callback ${callback}`);

    if (!fs.existsSync(`${tmpDirectory}/${brandCartridge}`)) {
        fs.mkdirSync(`${tmpDirectory}/${brandCartridge}`);
    }

    if (!fs.existsSync(`${tmpDirectory}/${brandCartridge}/js`)) {
        fs.mkdirSync(`${tmpDirectory}/${brandCartridge}/js`);
    }

    let packageJSON = JSON.parse(
        fs.readFileSync(`./cartridges/${brandCartridge}/package.json`)
    );

    let cartridges = packageJSON.buildPath;

    log.debug('Stacking the cartridges');

    /**
     * Take all of the cartridges defined in the brand package.json and stack
     * them on top of each other in the .tmp directory.  When that is complete
     * execute the buildJS function to compile the files from the .tmp directory.
     */
    utility.stackCartridges(
        cartridges,
        jsSource,
        `${tmpDirectory}/${brandCartridge}/js`,
        () => {
            buildJS(
                `${tmpDirectory}/${brandCartridge}/js${jsGlob}`,
                brandCartridge,
                jsDest,
                env,
                (err) => {
                    let filesToWatch = cartridges.map((cartridge) => {
                        return `./cartridges/${cartridge}/cartridge/client/default/js/`;
                    });

                    filesToWatch = filesToWatch.filter((jsfolder) => {
                        return fs.existsSync(`${jsfolder}`);
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

// Retrieve the results of the prompt and execute the compiliation of the JS files
prompt.get(schema, function (err, results) {
    if (results.debug === 'no') {
        log.debug = function () {};
    }

    log.debug(JSON.stringify(results));

    /**
     * If 'all' was specified, compile all brands in parallel
     * Otherwise compile the brand specified
     */
    if (results.brand === 'all') {
        log.success('Compiling all brands');
        async.each(allBrands, (brand, callback) => {
            buildBrand(
                brand,
                results.env,
                results.watch === 'yes',
                callback
            );
        });
    } else {
        log.success(`Compiling ${results.brand} brand`);
        buildBrand(
            results.brand,
            results.env,
            results.watch === 'yes'
        );
    }
});
