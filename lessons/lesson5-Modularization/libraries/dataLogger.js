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
        if (err) reject();
        resolve(data);
      });
    })
  }
};

module.exports = dataLogger;
