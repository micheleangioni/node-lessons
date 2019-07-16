module.exports = async (req, res, next) => {
  const jwtManager = req.app.get('jwtManager');
  const headers = req.headers;

  // Check whether the Authorization header is present

  let authorization = headers.authorization;

  if (!authorization || !(authorization.search('Bearer ') === 0)) {
    res.status(401).json({ hasError: 1, message: 'User is not authenticated.' });
    return;
  }

  let token = authorization.split(' ')[1];

  if (!token) {
    res.status(422).json({ hasError: 1, message: 'Token not found.' });
    return;
  }

  // Verify the Token

  let payload;

  try {
    payload = jwtManager.verify(token);
  } catch(error) {
    /*
    error object structure:

    err = {
      name: 'TokenExpiredError' / 'JsonWebTokenError',
      message: <string>,
      expiredAt: 1408621000 (only for 'TokenExpiredError' error)
    }
    */

    res.status(401).json({ hasError: 1, message: 'Invalid token.' });
    return;
  }

  // Invalidate the token
  try {
    await jwtManager.invalidate(payload.sub, payload.jti);
  } catch(error) {
    res.status(500).json({ hasError: 1, message: 'Internal error.' });
    return;
  }

  next();
};
