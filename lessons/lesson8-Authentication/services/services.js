const sessionsRouter = require('./sessions/sessions.router')
const usersRouter = require('./users/users.router')

module.exports = (app) => {
  app.use('/sessions', sessionsRouter(app));
  app.use('/users', usersRouter(app));
};
