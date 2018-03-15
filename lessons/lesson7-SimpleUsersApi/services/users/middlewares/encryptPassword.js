const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (app, data) => {
  let errors = [];

  // Check whether there is the `password` property
  if (!data.password) {
    errors.push('The password is missing.');
  } else {
    // Encrypt the password
    data.password = bcrypt.hashSync(data.password, saltRounds);
  }

  // For the sake of simplicity we omit a 'passwordConfirmation' field,
  // but it is a good practice to always use it

  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }

  return data;
};
