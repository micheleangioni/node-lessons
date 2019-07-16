const bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports = async (req, res, next) => {
  const UsersModel = req.app.get('usersModel');

  let data = req.body;
  let errors = [];

  if (!req.context) {
    req.context = {};
  }

  if (!data.email || !data.password) {
    if (!data.email) {
      errors.push('The Email is missing.')
    }

    if (!data.password) {
      errors.push('The Password is missing.')
    }
  } else {
    // Check whether the User exists

    const user = await UsersModel.findOne({
      email: data.email
    });

    if (!user) {
      // Hash random string to protect against timing attacks
      bcrypt.hashSync('random', saltRounds);

      res.status(403).json({ hasError: 1, error: 'Wrong credentials.' });
      return;
    }

    // Verify the Password

    if (await !bcrypt.compare(data.password, user.password)) {
      res.status(403).json({ hasError: 1, error: 'Wrong credentials.' });
      return;
    }

    // Save the User id and data in the context object to make it available after the middleware ran
    req.context.id = user._id;
    req.context.user = {
      id: user._id,
      email: user.email,
      username: user.username,
      admin: user.admin || false
    };
  }

  if (errors.length > 0) {
    res.status(422).json({ hasError: 1, error: errors.join(' ') });
    return;
  }

  next();
};
