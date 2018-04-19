const express = require('express');
const router  = express.Router();
const loginValidation = require('./middlewares/login.validation');

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

  return router;
};
