export const MARKET = {
    baseURL : 'http://localhost:3033/api/',
    countryCodes : ['EG' , 'IQ' , 'SA'],
    bundleId : 'com.market.project',
    appId : 'xxxxxxxxxxx',
    googlePlayLink : 'https://play.google.com/store/apps/details?id={{bundleId}}',
    appStoreURL : 'https://apps.apple.com/us/app/{{appName}}/id{{appId}}',
    name  : "Marostore",   
    description : "an awesome ecommerce online shopping platform",
    languages : [
        {
            code : 'ar',
            direction : 'rtl'
        },
        {
            code : 'en',
            direction : 'ltr'
        }
    ],
    defaultLang : 'en'
}