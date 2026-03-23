'use strict';
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const sh = require('shelljs');
const { minify } = require('terser');

module.exports = async function renderScripts() {
    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/js');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');

    sh.cp('-R', sourcePath, destPath)

    const sourcePathScriptsJS = upath.resolve(upath.dirname(__filename), '../src/js/scripts.js');
    const destPathScriptsJS = upath.resolve(upath.dirname(__filename), '../dist/js/scripts.js');

    const copyright = `/*!
* Start Bootstrap - ${packageJSON.title} v${packageJSON.version} (${packageJSON.homepage})
* Copyright 2013-${new Date().getFullYear()} ${packageJSON.author}
* Licensed under ${packageJSON.license} (https://github.com/StartBootstrap/${packageJSON.name}/blob/master/LICENSE)
*/
`
    const scriptsJS = fs.readFileSync(sourcePathScriptsJS, 'utf8');

    // Minify with Terser
    const minified = await minify(scriptsJS, {
        format: {
            comments: false,
            preamble: copyright
        }
    });

    fs.writeFileSync(destPathScriptsJS, minified.code);
};
