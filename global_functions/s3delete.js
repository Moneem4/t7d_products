const {s3} = require('../global_functions/connectS3')

exports.s3delete = (imageKeys) => {
  s3.deleteObject(
    {
      Bucket: 't7d-galactech',
      Key: imageKeys,
    },
    (err, data) => {
      if (err) {
        console.log('err ==>', err.message);
      } else {
        console.error('delete successfully', data);
      }
    }
  );
}