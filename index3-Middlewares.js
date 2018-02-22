const express = require('express');
const app = express();
const fs = require('fs');
const rp = require('request-promise');

/**
 * This function could be heavily simplified or avoided by using the 'request' or 'axios' Node modules.
 *
 * @param {string} baseUrl
 * @param {array} query
 * @param {array} queryNames
 */
const addQueryParameters = (baseUrl, query, queryNames) => {
  const values = queryNames.reduce((acc, queryName) => {
    if (query[queryName]) {
      acc[queryName] = query[queryName];
    }

    return acc;
  }, {});

  let first = true;

  for (const queryName in values) {
    const queryValue = values[queryName];
    baseUrl += first === true ? '?' : '&';
    baseUrl += `${queryName}=${queryValue}`;

    first = false;
  }

  return baseUrl;
};

/**
 * Save input data to file.
 *
 * @param {string} data
 * @param {function} cb
 */
const saveToFile = (data, cb) => {
  fs.writeFile('userdata/data.json', data, (err) => {
    if (err) throw err;
    cb();
  });
};

const retrieveJobs = (req, res) => {
  let baseUrl = 'https://jobs.github.com/positions.json';
  let fullUrl = addQueryParameters(baseUrl, req.query, ['location', 'full_time']);

  rp.get({uri: fullUrl, resolveWithFullResponse: true})
    .then(response => {
      let data = response.body;

      saveToFile(data, () => res.json(JSON.parse(data)));
    })
    .catch(e => {
      console.error('ERROR');
      console.error(e);
    });
};

app.get('/', retrieveJobs);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
