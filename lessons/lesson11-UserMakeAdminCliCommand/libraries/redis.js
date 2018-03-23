const redis = require('redis');

class Redis
{
  /**
   *
   * @param {string} password
   */
  constructor (password) {
    this.client = redis.createClient({ password, prefix: 'nodeLessons-' })
  }

  /**
   * Retrieve and return a key.
   *
   * @param {string} key
   * @return {Promise}
   */
  get (key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) reject(err);

        resolve(reply ? reply.toString() : reply);
      })
    });
  }

  /**
   * Save a key.
   *
   * @param {string} key
   * @param {string} value
   * @param {int} seconds
   * @return {Promise}
   */
  set (key, value, seconds = 0) {
    return new Promise((resolve, reject) => {
      if (seconds > 0) {
        return this.client.set(key, value, 'EX', seconds, (err, reply) => {
          if (err) reject(err);

          resolve(reply.toString());
        });
      } else {
        return this.client.set(key, value, (err, reply) => {
          if (err) reject(err);

          resolve(reply.toString());
        });
      }
    });
  }

  /**
   * Return the elements of input list.
   *
   * @param {string} listName
   * @param {int} start
   * @param {int} end
   * @return {Promise}
   */
  lrange (listName, start = 0, end = -1) {
    return new Promise((resolve, reject) => {
      this.client.lrange(listName, start, end, (err, reply) => {
        if (err) reject(err);

        resolve(reply ? reply.toString() : null);
      });
    });
  }

  /**
   * Left insert a value on input list.
   *
   * @param {string} listName
   * @param {string} value
   * @return {Promise}
   */
  lpush (listName, value) {
    return new Promise((resolve, reject) => {
      this.client.lpush(listName, value , (err, reply) => {
        if (err) reject(err);

        resolve(reply.toString());
      });
    });
  }

  /**
   * Right insert a value on input list.
   *
   * @param {string} listName
   * @param {string} value
   * @return {Promise}
   */
  rpush (listName, value) {
    return new Promise((resolve, reject) => {
      this.client.rpush(listName, value, (err, reply) => {
        if (err) reject(err);

        resolve(reply.toString());
      });
    });
  }

  /**
   * Expire input key.
   *
   * @param {string} key
   * @param {int} seconds
   * @return {Promise}
   */
  expire (key, seconds) {
    return new Promise((resolve, reject) => {
      this.client.expire(key, seconds, (err, reply) => {
        if (err) reject(err);

        resolve(reply.toString());
      });
    });
  }
}

module.exports = function (password) {
  return new Redis(password);
};
