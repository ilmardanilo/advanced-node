export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID || '731188411760647',
    clientSecret:
      process.env.FB_CLIENT_SECRET || 'a53ad2e315017ace553cd85dfe61fa39',
  },
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JWT_SECRET || '63617d955442ca004584b1ed',
};