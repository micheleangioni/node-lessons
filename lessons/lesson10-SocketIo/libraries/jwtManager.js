const jwt = require('jsonwebtoken');
const uuid = require('node-uuid');

class JwtManager
{
  /**
   * @param {string} secretKey
   * @param {object} redis
   */
  constructor (secretKey, redis) {
    this.secretKey = secretKey

    this.redis = redis
  }

  /**
   * Create a new token.
   *
   * @param {string} userId
   * @return {*}
   */
  createToken (userId) {
    return jwt.sign({
      data: {}
    }, this.secretKey, {
      expiresIn: '4h',
      jwtid: uuid.v4(),
      subject: userId.toString()
    });
  }

  /**
   * Validate input token.
   *
   * @param {string} token
   * @return {object}
   */
  verify (token) {
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

  /**
   * Check whether input token has been invalidated.
   *
   * @param {string} userId
   * @param {string} token
   * @return {boolean}
   */
  async isInvalidated (userId, token) {
    const invalidUserTokens = await this.redis.lrange(JwtManager._getUserInvalidTokensKey(userId));

    return invalidUserTokens ? invalidUserTokens.includes(token) : false;
  }

  /**
   * Invalidate input Token.
   *
   * @param {string} userId
   * @param {string} token
   * @return {boolean}
   */
  async invalidate (userId, token) {
    if (await this.isInvalidated(userId, token)) {
      return true;
    }

    const userInvalidTokensKey = JwtManager._getUserInvalidTokensKey(userId);

    // Set an expiration time for the User invalid tokens, so that much longer than tokens validity limit
    await this.redis.expire(userInvalidTokensKey, 60 * 60 * 24);

    // Insert the token amongst the invalid tokens for the authenticated user
    await this.redis.lpush(userInvalidTokensKey, token);

    return true;
  }

  /**
   * Return the Redis User Invalid Tokens key.
   *
   * @param {string} userId
   * @return {string}
   * @private
   */
  static _getUserInvalidTokensKey (userId) {
    return `invalid-tokens-${userId}`;
  }
}

module.exports = function (secretKey, redis) {
  return new JwtManager(secretKey, redis);
};
