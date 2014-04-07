var path = require('path');
var fs = require('fs');
var util = require('util');


var refFormatCode = "module.exports = require('%s');";


function getPackageJson() {
    "use strict";

    var pathToPackageJson = path.join(process.cwd(), "package.json");
    console.log(pathToPackageJson);
    return JSON.parse(fs.readFileSync(pathToPackageJson));
}


module.exports = function setup(packageJsonConfigKey) {
    "use strict";

    var nodeModulesPath = path.resolve(process.cwd(), "node_modules");
    var packageJson = getPackageJson();
    var config = packageJson[packageJsonConfigKey || "localDependencies"] || {};

    for (var moduleName in config) {
        var relFilePath = config[moduleName];
        console.log(relFilePath);
        var filePath = path.resolve(process.cwd(), relFilePath);
        console.log(moduleName + " " + filePath);

        if (!fs.existsSync(filePath)) {
            console.log("Missing " + filePath);
            return "Missing " + filePath;
        }

        var refFolderPath = path.join(nodeModulesPath, moduleName);
        if (fs.existsSync(refFolderPath)) {
            console.log("Module already exists");
            continue;
        }

        fs.mkdirSync(refFolderPath);
        console.log(refFolderPath);

        var refFilePath = path.join(refFolderPath, "index.js");
        console.log(refFilePath);
        fs.writeFileSync(refFilePath, util.format(refFormatCode, path.join('../../', relFilePath)));
    }
};