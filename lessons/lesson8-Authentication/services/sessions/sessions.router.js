const express = require('express');
const router  = express.Router();
const loginValidation = require('./middlewares/login.validation');

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
    res.json({ message: 'Login successfully performed.' });
  });

  return router;
};
