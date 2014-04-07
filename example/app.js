var fs = require('fs');
if (fs.existsSync('./node_modules/config/index.js')) {
    fs.unlinkSync('./node_modules/config/index.js');
    fs.rmdirSync('./node_modules/config');
}

require('../index')();
console.log("CONFIG" === require('config')() ? "SUCCESS" : "FAILED");

