/**
 * User documentation collection mounted at /d/.
 *
 * Declaration object only (JSON-compatible; double quotes).
 */
export default {
    defaultLocale: 'en-us',
    locales: {
        'en-us': { label: 'English' },
        'zh-hans': { label: '简体中文' },
    },
    collections: {
        default: {
            source: '.',
            mount: '/d',
        },
    },
};
