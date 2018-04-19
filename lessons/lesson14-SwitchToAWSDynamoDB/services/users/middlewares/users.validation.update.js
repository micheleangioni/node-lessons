const util = require('util');
const validator = require('validator');

module.exports = async (req, res, next) => {
  const UsersModel = req.app.get('usersModel');
  const UsersQueryOne = util.promisify(UsersModel.queryOne);

  let data = req.body;
  let errors = [];

  // Check whether there is the `username` property
  if (data.username) {
    data.username = data.username.trim();

    // Check whether it is a string and a valid username
    if (typeof data.username !== 'string') {
      errors.push('The username is invalid.');
    } else if (data.username.length < 5 || data.username.length > 25) {
      errors.push('The username must be at least 5 and not more than 25 characters long');
    } else if (!validator.isAlphanumeric(data.username)) {
      errors.push('Only alphanumeric characters are allowed in the username');
    } else {
      // Check whether the username has already been taken

      let user;

      try {
        user = await UsersQueryOne({ username: { eq: data.username } });
      } catch (e) {
        res.status(500).json({ hasError: 1, error: 'Internal error.' });
        return;
      }

      if (user) {
        errors.push('The username has already been taken.');
      }
    }
  }

  // Check whether there is the `email` property
  if (data.email && !validator.isEmail(data.email)) {
    errors.push('The email is invalid.');
  } else if (data.email) {
    // Check whether the email has already been taken

    let user;

    try {
      user = await UsersQueryOne({ username: { eq: data.username } });
    } catch (e) {
      res.status(500).json({ hasError: 1, error: 'Internal error.' });
      return;
    }

    if (user) {
      errors.push('The email has already been taken.');
    }
  }

  if (errors.length > 0) {
    res.status(422).json({ hasError: 1, error: error.toString() });
    return;
  }

  next();
};
