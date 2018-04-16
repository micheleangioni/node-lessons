const aws = require('aws-sdk');

class S3client
{
  /**
   * @param {string} region
   */
  constructor (region) {
    this.s3 = new aws.S3({ region });
  }

  /**
   * Create a bucket.
   *
   * @param {string} name
   * @return {Promise}
   */
  async createBucket (name) {
    // Check whether the bucket already exists

    let code;

    try {
      await this._checkBucket(name);
    } catch (e) {
      code = e.statusCode
    }

    if (code === 404) {
      return new Promise((resolve, reject) => {
        const settings = {
          Bucket: name
        };

        this.s3.createBucket(settings, (err, data) => {
          if (err) reject(err);

          // Now set CORS for the bucket

          const params = {
            Bucket: name,
            CORSConfiguration: {
              CORSRules: [
                {
                  AllowedHeaders: [
                    '*'
                  ],
                  AllowedMethods: [
                    'GET',
                    'PUT',
                    'POST',
                    'DELETE'
                  ],
                  AllowedOrigins: [
                    '*'
                  ],
                  ExposeHeaders: [
                    'x-amz-server-side-encryption'
                  ],
                  MaxAgeSeconds: 3000
                }
              ]
            },
            ContentMD5: ''
          };

          this.s3.putBucketCors(params, function(err, corsData) {
            if (err) reject(err);

            resolve(data);
          });
        });
      })
    }

    return Promise.resolve();
  }

  /**
   * Get a signed url for input bucket and filename.
   *
   * @param {string} bucket
   * @param {string} filename
   * @param {string} fileType
   * @return {Promise}
   */
  getSignedUrl (bucket, filename, fileType) {
    const params = {
      Bucket: bucket,
      Key: filename,
      ContentType: fileType,
      Expires: 60,
      ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('putObject', params, (err, data) => {
        if (err) reject(err);

        const returnData = {
          signedRequest: data,
          url: `https://${bucket}.s3.amazonaws.com/${filename}`
        };

        resolve(returnData);
      });
    })
  }

  /**
   * Check whether input bucket exists.
   *
   * @param {string} name
   * @return {Promise}
   * @private
   */
  _checkBucket (name) {
    return new Promise((resolve, reject) => {
      this.s3.headBucket({ Bucket: name }, (err, data) => {
        if (err) reject(err);

        resolve(data);
      });
    });
  }
}

module.exports = function () {
  return new S3client();
};
