var path = require('path');
var fs = require('fs');
var util = require('util');


var refFormatCode = "module.exports = require('%s');";


function getConfig(packageJsonConfigKey) {
    "use strict";

    var pathToPackageJson = path.join(process.cwd(), "package.json");
    var packageJsonData = fs.readFileSync(pathToPackageJson);
    if (!packageJsonData) {
        return "Cannot find " + pathToPackageJson;
    }

    var packageJson = JSON.parse(packageJsonData);
    return packageJson[packageJsonConfigKey || "localDependencies"] || {};
}


function projectFileExists(relativeFilePath) {
    "use strict";

    var filePath = path.resolve(process.cwd(), relativeFilePath);
    return fs.existsSync(filePath);
}


function createReferenceFile(referenceFolderPath, sourceFilePath) {
    "use strict";

    fs.mkdirSync(referenceFolderPath);
    var referenceFilePath = path.join(referenceFolderPath, "index.js");
    fs.writeFileSync(referenceFilePath, util.format(refFormatCode, path.join('../../', sourceFilePath)));
}


module.exports = function setup(packageJsonConfigKey) {
    "use strict";

    var nodeModulesPath = path.resolve(process.cwd(), "node_modules");
    var config = getConfig(packageJsonConfigKey);

    for (var moduleName in config) {
        var sourceFilePath = config[moduleName];
        if (!projectFileExists(sourceFilePath)) {
            return "Cannot find " + sourceFilePath;
        }

        var referenceFolderPath = path.join(nodeModulesPath, moduleName);
        if (fs.existsSync(referenceFolderPath)) {
            continue;
        }

        createReferenceFile(referenceFolderPath, sourceFilePath);
    }
};