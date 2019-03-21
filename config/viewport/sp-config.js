module.exports = (env) => {

    env = env.toLowerCase();

    const config = require(`./env/${env}-config`);

    return {
        portal: {
            creds: config.portal.creds,
            masterpage: config.portal.masterpage,
            cssCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/_catalogs/masterpage/_vp-portal/styles",
                checkin: true,
                checkinType: 1
            },
            jsCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/_catalogs/masterpage/_vp-portal/scripts",
                checkin: true,
                checkinType: 1
            },
            fontCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/_catalogs/masterpage/_vp-portal/font",
                checkin: true,
                checkinType: 1
            },
            imageCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/_catalogs/masterpage/_vp-portal/images",
                checkin: true,
                checkinType: 1
            },
            masterPgCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/_catalogs/masterpage/_vp-portal",
                checkin: true,
                checkinType: 1
            },        
            glob: {
                jsGlob: 'dist/scripts/**/*.{js,map}',
                compGlob: 'dist/component/**/*.txt',
                cssGlob: 'dist/css/**/*.css',
                fontGlob: 'dist/font/**/*',
                imageGlob: 'dist/images/**/*',
                masterPgGlob: 'dist/masterpage/**/*.master',
                pageLayoutGlob: 'dist/masterpage/**/*.{html,aspx}'
            },
            url: config.portal.url,
        },

        departmentSites: config.departmentSites || [],

        contentTypeHub: {
            url: config.contentTypeHub.url
        },

        searchCenter: {
            url: config.searchCenter.url,
            creds: config.searchCenter.creds,
            cssCore: {
                siteUrl : config.searchCenter.url,
                notification: false,
                folder: "/_catalogs/masterpage/_vp-portal/styles",
                checkin: true,
                checkinType: 1
            },
            fontCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/_catalogs/masterpage/_vp-portal/font",
                checkin: true,
                checkinType: 1
            },
            imageCore: {
                siteUrl : config.portal.url,
                notification: false,
                folder: "/_catalogs/masterpage/_vp-portal/images",
                checkin: true,
                checkinType: 1
            },
            masterPgCore: {
                siteUrl : config.searchCenter.url,
                notification: false,
                folder: "/_catalogs/masterpage/_vp-portal",
                checkin: true,
                checkinType: 1
            },
            glob: {
                jsGlob: 'dist/**/*.{js,map}',
                compGlob: 'dist/component/**/*.txt',
                cssGlob: [
                    'dist/css/**/wmg-portal-vendor.css'
                ],
                fontGlob: 'dist/font/**/*',
                masterPgGlob: 'dist/masterpage/**/vp-portal-search.master',
                pageLayoutGlob: 'dist/masterpage/**/*.html'
            }
        },

        appCatalog: {
            url: config.appCatalog.url,
            creds: config.appCatalog.creds
        }
    }

}
