define(['jquery'],
    function ($,tmpl) {

        var loadResource = function (resourceName, parentRequire, callback, config) {
            parentRequire([("text!" + resourceName)],
                function (templateContent) {
                    var template = $.template(templateContent);
                    callback(template);
                }
            );
        };

        return {
            write: function (pluginName, moduleName, write) {
                //The text plugin keeps a map of strings it fetched
                //during the build process, in a buildMap object.
                if (moduleName in buildMap) {
                    //jsEscape is an internal method for the text plugin
                    //that is used to make the string safe
                    //for embedding in a JS string.
                    var text = jsEscape(buildMap[moduleName]);
                    write("define('" + pluginName + "!" + moduleName  +
                        "', function () { return '" + text + "';});\n");
                }
            },
            load: loadResource
        };

    });