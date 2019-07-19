const configSettings = require('./sp-config');

function getEnv(env) {

    var settings = null;

    if(!env)
        return settings;

    env = env.toLowerCase();

    if ([
        'viewport-prod',
        'bigapple-dev',
        'bigapple-dev03'
    ].indexOf(env) < 0) {
        return settings;
    }

    settings = configSettings(env);

    return settings;

}

module.exports = {
    getEnv
}