const express = require('express');
const router = express.Router();
const authCheck = require('./../sessions/middlewares/auth.check');
const encryptPassword = require('./middlewares/encryptPassword');
const usersValidationNew = require('./middlewares/users.validation.new');
const usersValidationUpdate = require('./middlewares/users.validation.update');

module.exports = (app) => {
  const UsersModel = app.get('usersModel');

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
    UsersModel.find()
      .then(data => {
        res.json(data.map(user => {
          return { id: user._id, email: user.email, username: user.username };
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
  router.put('/:id', (req, res) => {
    const data = {
      email: req.body.email,
      username: req.body.username
    };

    UsersModel.findOneAndUpdate({ _id: req.params.id }, data, (err, user) => {
      if (err) {
        res.status(500).json({ hasError: 1, error: err });
        return;
      }

      if (!user) {
        res.status(404).json({ hasError: 1, error: 'User not found.' });
        return;
      }

      res.json(data);
    });
  });

  return router;
};
