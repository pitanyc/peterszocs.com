'use strict';

const renderScripts = require('./render-scripts');

renderScripts().catch(err => {
    console.error('Error rendering scripts:', err);
    process.exit(1);
});