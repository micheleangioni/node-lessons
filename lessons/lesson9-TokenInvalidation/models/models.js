const usersModel = require('./users');

module.exports = (app) => {
  app.set('usersModel', usersModel(app));
};
