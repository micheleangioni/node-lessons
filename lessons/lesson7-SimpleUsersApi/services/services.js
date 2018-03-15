const usersRouter = require('./users/users.router')

module.exports = (app) => {
  app.use('/users', usersRouter(app));
};
