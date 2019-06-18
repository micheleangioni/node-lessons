const bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports = (req, res, next) => {
  let data = req.body;
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
    res.status(422).json({ hasError: 1, error: error.toString() });
    return;
  }

  next();
};
