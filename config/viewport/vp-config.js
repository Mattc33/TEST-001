const envMap = require("./environment-url-map");

module.exports = function(url) {

    url = url.toLowerCase();

    const env = envMap[url];
    const config = require("./controls/" + env + "-config");

    return {
        "environment": env,
        "config": config
    };

}
