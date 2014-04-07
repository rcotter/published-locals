var fs = require('fs');

if (!fs.existsSync('./node_modules')) {
    fs.mkdir('./node_modules');
}

if (fs.existsSync('./node_modules/config/index.js')) {
    fs.unlinkSync('./node_modules/config/index.js');
    fs.rmdirSync('./node_modules/config');
}

var error = require('../index')(); // Would be require('published-locals');
if (error) {
    console.error("Unable to create published local references - " + error);
    return process.exit(1);
}

console.log("CONFIG" === require('config')() ? "SUCCESS - No relative paths!" : "FAILED");

