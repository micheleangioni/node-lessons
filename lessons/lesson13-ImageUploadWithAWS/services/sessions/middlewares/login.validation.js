const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = async (app, data, context) => {
  const UsersModel = app.get('usersModel');

  let errors = [];

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

      throw {
        code: 403,
        message: 'Wrong credentials.'
      };
    }

    // Verify the Password

    if (await !bcrypt.compare(data.password, user.password)) {
      throw {
        code: 403,
        message: 'Wrong credentials.'
      };
    }

    // Save the User id and data in the context object to make it available after the middleware ran
    context.id = user._id;
    context.user = {
      id: user._id,
      email: user.email,
      username: user.username,
      admin: user.admin || false,
      image: `https://nodelessons-profile-images.s3.amazonaws.com/image-profile-${user._id}` // (!) This should be usually avoided by putting the string creator in an external file or saving the image url in the database
    };
  }

  if (errors.length > 0) {
    throw {
      code: 422,
      message: errors.join(' ')
    };
  }
};
