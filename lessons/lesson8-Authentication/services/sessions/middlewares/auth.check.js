module.exports = (app, headers, context) => {
  const jwtManager = app.get('jwtManager');

  // Check whether the Authorization header is present

  let authorization = headers.authorization;

  if (!authorization || !(authorization.search('Bearer ') === 0)) {
    throw { name: 'UserNotAuthenticated', message: 'User is not authenticated.' };
  }

  let token = authorization.split(' ')[1];

  if (!token) {
    throw { name: 'UserNotAuthenticated', message: 'Token not found.' };
  }

  // Verify the Token

  let payload;

  try {
    payload = jwtManager.verify(token)
  } catch(error) {
    /*
    error object structure:

    err = {
      name: 'TokenExpiredError' / 'JsonWebTokenError',
      message: <string>,
      expiredAt: 1408621000 (only for 'TokenExpiredError' error)
    }
    */

    throw error;
  }

  // Save the User id in the context object to make it available after the middleware ran
  context.id = payload.sub;
};
