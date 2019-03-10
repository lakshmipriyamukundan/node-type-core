import AWS from './base';

export const s3 = new AWS.S3({
  apiVersion: '2010-12-01',
  signatureVersion: 'v4',
  region: 'eu-central-1',
});
