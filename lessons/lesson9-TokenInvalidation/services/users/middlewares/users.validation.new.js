const validator = require('validator');

module.exports = async (app, data) => {
  const UsersModel = app.get('usersModel');

  let errors = [];

  // Check whether there is the `username` property
  if (!data.username) {
    errors.push('The username is missing.');
  } else {
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
  if (!data.email) {
    errors.push('The email is missing.');
  } else if (!validator.isEmail(data.email)) {
    errors.push('The email is invalid.');
  } else {
    // Check whether the email has already been taken
    const users = await UsersModel.find({
      email: data.email
    });

    if (users.length > 0) {
      errors.push('The email has already been taken.');
    }
  }

  // Check whether there is the `password` property
  if (!data.password) {
    errors.push('The password is missing.');
  } else {
    // Check whether the it is valid
    if (data.password.length < 8 || data.password.length > 50) {
      errors.push('The password must be at least 8 and not more than 50 characters long');
    }
  }

  // For the sake of simplicity we omit a 'passwordConfirmation' field,
  // but it is a good practice to always use it

  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }
};
