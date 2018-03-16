const validator = require('validator');

module.exports = async (app, data) => {
  const UsersModel = app.get('usersModel');

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
      const users = await UsersModel.find({
        username: data.username
      });

      if (users.length > 0) {
        errors.push('The username has already been taken.');
      }
    }
  }

  // Check whether there is the `email` property
  if (data.email && !validator.isEmail(data.email)) {
    errors.push('The email is invalid.');
  } else if (data.email) {
    // Check whether the email has already been taken
    const users = await UsersModel.find({
      email: data.email
    });

    if (users.length > 0) {
      errors.push('The email has already been taken.');
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }
};
