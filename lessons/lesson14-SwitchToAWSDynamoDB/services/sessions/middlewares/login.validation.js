const util = require('util');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = async (req, res, next) => {
  const UsersModel = req.app.get('usersModel');
  const UsersQueryOne = util.promisify(UsersModel.queryOne);

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
    let user;

    try {
      user = await UsersQueryOne({ email: { eq: data.email } });
    } catch (e) {
      res.status(500).json({ hasError: 1, error: e.toString() });
      return;
    }

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
    req.context.id = user.id;
    req.context.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      admin: user.admin || false,
      image: `https://nodelessons-profile-images.s3.amazonaws.com/image-profile-${user.id}` // (!) This should be usually avoided by putting the string creator in an external file or saving the image url in the database
    };
  }

  if (errors.length > 0) {
    res.status(422).json({ hasError: 1, error: errors.join(' ') });
    return;
  }

  next();
};
