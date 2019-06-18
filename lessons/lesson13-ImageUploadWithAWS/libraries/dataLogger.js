const fs = require('fs');

const dataLogger = {
  /**
   * Save input data to file.
   *
   * @param {string} data
   * @return {Promise}
   */
  saveToFile (data) {
    return new Promise((resolve, reject) => {
      fs.writeFile('userdata/data.json', data, (err) => {
        if (err) return reject();
        resolve(data);
      });
    });
  },

  /**
   * Read data file and return the content.
   *
   * @return {Promise}
   */
  readFile () {
    return new Promise((resolve, reject) => {
      fs.readFile('userdata/data.json', (err, data) => {
        if (err) return reject();
        resolve(JSON.parse(data));
      });
    });
  }
};

module.exports = dataLogger;
