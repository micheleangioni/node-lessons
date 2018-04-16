const express = require('express');
const router  = express.Router();
const loginValidation = require('./middlewares/login.validation');
const tokenInvalidation = require('./middlewares/token.invalidation');

module.exports = (app) => {
  // Check user credentials

  router.post('/', async (req, res, next) => {
    if (!req.context) {
      req.context = {};
    }

    try {
      await loginValidation(app, req.body, req.context);
    } catch (error) {
      res.status(error.code).json({ hasError: 1, error: error.message });
      return;
    }

    next();
  });

  /**
   * Authenticate the User by creating a new token.
   */
  router.post('/', (req, res) => {
    const jwtManager = app.get('jwtManager');
    const token = jwtManager.createToken(req.context.id);

    res.set('Authorization', `Bearer ${token}`);
    res.json({ data: req.context.user });
  });

  /**
   * Token invalidation.
   */
  router.delete('/', async (req, res, next) => {
    try {
      await tokenInvalidation(app, req.headers)
    } catch (error) {
      res.status(500).json({ hasError: 1, message: 'Internal error.' });
      return;
    }

    next();
  });

  /**
   * Logout by invalidating the token.
   */
  router.delete('/', (req, res) => {
    res.json({ message: 'Logout successfully performed.' });
  });

  return router;
};
