'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3();

const bucket = `nodelessons-local`;

exports.handler = async (event, context) => {

  let stats;

  try {
    stats = await getJobStats();
  } catch (err) {
    throw new Error(err);
  }

  const statsJson = JSON.stringify(stats);

  try {
    await saveStats(statsJson);
  } catch (err) {
    throw new Error(err);
  }

  return { body: statsJson };
};

/**
 * @return {Promise}
 */
function getJobStats() {
  const params = {
    Bucket: bucket,
    Key: 'jobSearch'
  };

  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        availableJobs: JSON.parse(data.Body.toString('utf-8')).length
      });
    });
  })
}

/**
 * @param {string} stats
 * @return {Promise}
 */
function saveStats(stats) {
  const params = {
    ACL: 'private',
    Body: Buffer.from(stats, 'utf-8'),
    Bucket: bucket,
    ContentType: 'text/html; charset=utf-8',
    Key: 'jobStats',
    ServerSideEncryption: 'AES256'
  };

  return new Promise((resolve, reject) => {
    s3.putObject(params, function(err, data) {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  })
}
