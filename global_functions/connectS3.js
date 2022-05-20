const AWS = require('aws-sdk');

exports.s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: 'me-south-1',
  correctClockSkew: true
})