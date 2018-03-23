const randomJobs = require('./randomjobs/randomjobs')
const sessionsRouter = require('./sessions/sessions.router')
const usersRouter = require('./users/users.router')

module.exports = (http, app) => {
  randomJobs(http);
  app.use('/sessions', sessionsRouter(app));
  app.use('/users', usersRouter(app));
};
