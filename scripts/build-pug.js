'use strict';
const upath = require('upath');
const sh = require('shelljs');
const renderPug = require('./render-pug');

const srcPath = upath.resolve(upath.dirname(__filename), '../src');

const promises = [];

sh.find(srcPath).forEach(_processFile);

Promise.all(promises).catch(err => {
    console.error('Error building pug files:', err);
    process.exit(1);
});

function _processFile(filePath) {
    if (
        filePath.match(/\.pug$/)
        && !filePath.match(/include/)
        && !filePath.match(/mixin/)
        && !filePath.match(/\/pug\/layouts\//)
    ) {
        promises.push(renderPug(filePath));
    }
}