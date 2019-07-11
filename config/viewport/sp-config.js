module.exports = (env) => {

    env = env.toLowerCase();

    const config = require(`./env/${env}-config`);

    return {
        portal: {
            creds: config.portal.creds,
            cssCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/SVPSiteAssets/css",
                checkin: true,
                checkinType: 1
            },
            bootstrapCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/SVPSiteAssets/fonts/bootstrap",
                checkin: true,
                checkinType: 1
            },
            fontCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/SVPSiteAssets/font",
                checkin: true,
                checkinType: 1
            },
            imageCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/SVPSiteAssets/images",
                checkin: true,
                checkinType: 1
            },     
            glob: {
                cssGlob: 'dist/css/**/*.css',
                fontGlob: 'dist/font/**/*',
                bootstrapGlob: 'dist/fonts/bootstrap/**/*',
                imageGlob: 'dist/images/**/*'
            },
            url: config.portal.url
        },

        appCatalog: {
            url: config.appCatalog.url,
            creds: config.appCatalog.creds
        }
    }

}
