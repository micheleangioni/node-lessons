const jwt = require('jsonwebtoken');

class JwtManager
{
  /**
   * @param {string} secretKey
   */
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  /**
   * Create a new token.
   *
   * @param {string} userId
   * @return {*}
   */
  createToken(userId) {
    return jwt.sign({
      data: {}
    }, this.secretKey, {
      expiresIn: '4h',
      subject: userId.toString()
    });
  }

  /**
   * Validate input token.
   *
   * @param {string} token
   * @return {object}
   */
  verify(token) {
    let decoded;

    try {
      decoded = jwt.verify(token, this.secretKey);
    } catch(error) {
      /*
      error object structure (example):

      err = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: 1408621000
      }
      */
      throw error;
    }

    return decoded;
  }
}

module.exports = function (secretKey) {
  return new JwtManager(secretKey);
};
