#published-locals
'require' project specific modules/files just like 3rd party ones i.e. no relative paths. Great for project config.

##Use Case
Often enough project specific files need to be referenced frequently throughout a code base. This can become an ugly
and tiresome sprinkling of confusing relative path requires or the passing of instances down through parameters to
nested code. This is especially painful during refactoring. The canonical example is project
config (unless using a fancy module). **published-locals** makes project specific modules/files accessible as though
they were 3rd party published modules.

###Example
####Before
    - app.js
    - config.js
    - lib
        - models
            - customer-model.js
                var config = require('../../config');
        - controllers
            - a-controllers
                - a1-controller.js
                    var config = require('../../../config');
####After
    - app.js
        require('published-locals')();
    - config.js
    - lib
        - models
            - customer-model.js
                var config = require('config');
        - controllers
            - a-controllers
                - a1-controller.js
                    var config = require('config');


Try running `node app` within this module's **example** for a demonstration.

#Use
1. `npm install published-locals --save`
2. Edit your project's **package.json** as follows:

        {
            "localDependencies": {
                "[KEY 1]" : "[RELATIVE PATH 1 FROM PROJECT ROOT]",
                "[KEY 2]" : "[RELATIVE PATH 2 FROM PROJECT ROOT]"
            }
        }

    e.g.

        {
            "localDependencies": {
                "config" : "./config"
            }
        }

3. Near the top of your project's entry point (app.js, server.js, etc) add:

        var error = require('published-locals')();
        if (error) {
            console.error("Unable to create published local references - " + error);
            return process.exit(1);
        }

    or pass the optional key name to use within the package.json (default is 'localDependencies').

        require('published-locals')("project-globals");

4. When your project is run, reference modules are created under **node_modules**. Given the config example, the
contents will be as follows. The reference modules can be safetly commited to your repo (if you're following NPMs
recommendations to do so).

        module.exports = require('../../config.js');

#Heroku Users
* Works fine in the Cedar stack's ephemeral storage
* Not compatible in the legacy Bamboo stack which does not allow file writing.