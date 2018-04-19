const express = require('express');
const router  = express.Router();
const loginValidation = require('./middlewares/login.validation');
const tokenInvalidation = require('./middlewares/token.invalidation');

module.exports = (app) => {
  // Check user credentials

  router.post('/', loginValidation);

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
  router.delete('/', tokenInvalidation);

  /**
   * Logout by invalidating the token.
   */
  router.delete('/', (req, res) => {
    res.json({ message: 'Logout successfully performed.' });
  });

  return router;
};
