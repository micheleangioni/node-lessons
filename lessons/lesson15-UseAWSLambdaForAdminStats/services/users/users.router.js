const express = require('express');
const util = require('util');
const uuid = require('node-uuid');
const router = express.Router();
const authCheck = require('./../sessions/middlewares/auth.check');
const encryptPassword = require('./middlewares/encryptPassword');
const usersValidationNew = require('./middlewares/users.validation.new');
const usersValidationUpdate = require('./middlewares/users.validation.update');

const profileImagesBucketName = 'nodelessons-profile-images';

async function createBucket (s3client) {
  try {
    await s3client.createBucket(profileImagesBucketName);
  } catch (e) {
    console.log('Error', e)
  }
}

/**
 * Return the profile image url for input user.
 *
 * @param {string} userId
 * @return {string}
 */
function getProfileImageFilename (userId) {
  return `image-profile-${userId}`;
}

module.exports = (app) => {
  const s3client = app.get('s3client');

  // Let's create an S3 bucket to store profile images
  createBucket(s3client);

  const UsersModel = app.get('usersModel');
  const UsersQueryOne = util.promisify(UsersModel.queryOne);

  /**
   * Add Authentication Middleware to all routes, except User registration.
   */
  router.use('/', async function (req, res, next) {
    if (!req.context) {
      req.context = {};
    }

    if (req.path === '/' && req.method === 'POST') {
      next();
      return;
    }

    try {
      await authCheck(app, req.headers, req.context);
    } catch (error) {
      let status;

      switch (error.name) {
        case 'UserNotAuthenticated':
          status = 401;
          break;
        case 'TokenExpiredError':
          status = 403;
          break;
        case 'JsonWebTokenError':
          status = 403;
          break;
        default:
          status = 500;
      }

      res.status(status).json({ hasError: 1, message: error.message });
      return;
    }

    next();
  });

  /**
   * Retrieve all Users
   */
  router.get('/', (req, res) => {
    UsersModel.scan().exec((err, users) => {
      res.json(users.map(user => {
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          image: getProfileImageFilename(user.id)
        };
      }));
    })
  });

  // Validation Middleware.

  router.post('/', usersValidationNew);

  // Encrypt Password Middleware.

  router.post('/', encryptPassword);

  /**
   * Create a new User.
   */
  router.post('/', (req, res) => {
    UsersModel.create({
      id: uuid.v4(),
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }, (err, user) => {
      if (err) res.status(500).json({ hasError: 1, error: err });

      res.json({ email: user.email, username: user.username });
    });
  });

  // Validation Middleware.

  router.put('/:id', usersValidationUpdate);

  /**
   * Update a User.
   */
  router.put('/:id', async (req, res) => {
    const data = {
      email: req.body.email,
      username: req.body.username
    };

    // Retrieve the User

    let user;

    try {
      user = await UsersQueryOne({ id: { eq: req.params.id } });
    } catch (error) {
      res.status(422).json({ hasError: 1, error: error });
      return;
    }

    if (!user) {
      res.status(404).json({ hasError: 1, error: 'User not found.' });
      return;
    }

    UsersModel.update({ id: user.id, email: user.email }, data, err => {
      if (err) {
        res.status(500).json({ hasError: 1, error: err });
        return;
      }

      res.json(data);
    });
  });

  /**
   * Get signed url to upload image.
   */
  router.get('/:id/image/signed-url', async (req, res) => {
    const filename = getProfileImageFilename(req.context.id);
    let data;

    if (!req.query.fileType) {
      res.status(422).json({ hasError: 1, error: 'Missing fileType query parameter.' });
      return;
    }

    // Get a signed url
    try {
      data = await s3client.getSignedUrl(profileImagesBucketName, filename, req.query.fileType)
    } catch (e) {
      res.status(500).json({ hasError: 1, error: 'Internal error, could not get signed url, try again later.' });
      return;
    }

    res.json(data);
  });

  return router;
};
