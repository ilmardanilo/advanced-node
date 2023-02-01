export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID || '731188411760647',
    clientSecret:
      process.env.FB_CLIENT_SECRET || 'a53ad2e315017ace553cd85dfe61fa39',
    accessToken:
      process.env.FB_ACCESS_TOKEN ||
      'EAAKZAAxGMAAcBADU5QN5atiZCVeDLF1dSw7VcdSZB51KFMXmlujjiNrKZABAlPlozslzn5CZAHS8RJMHMtVI6P3pianloqhhCQg0NoD8bRZAw5r7S7bIr8wbtqQvymKpnYVgy5aNUIytSkryh4mZByVz08T2LhX0KYtI3rVyhyl86BSJwaiqoSUvYQgP7IMf69lRUGDn3X6IaqXTLHJY9YL',
  },
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY || '',
    secret: process.env.AWS_S3_SECRET || '',
    bucket: process.env.AWS_S3_BUCKET || '',
  },
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JWT_SECRET || '63617d955442ca004584b1ed',
};
