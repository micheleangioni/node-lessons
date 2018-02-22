const express = require('express');
const app = express();
const fs = require('fs');
const moment = require('moment');
const rp = require('request-promise');

const winston = require('winston');
winston.add(winston.transports.File, { filename: 'storage/logs/nodeJobs.log' });
winston.remove(winston.transports.Console);

/**
 * This function could be heavily simplified or avoided by using the 'axios' Node module.
 *
 * @param {string} baseUrl
 * @param {object} query
 * @param {array} queryNames
 * @return {string}
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
 * @return {Promise}
 */
const saveToFile = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile('userdata/data.json', data, (err) => {
      if (err) reject();
      resolve(data);
    });
  })
};

const retrieveJobs = (req, res) => {
  let baseUrl = 'https://jobs.github.com/positions.json';
  let fullUrl = addQueryParameters(baseUrl, req.query, ['location', 'full_time']);

  rp.get({uri: fullUrl, resolveWithFullResponse: true})
    .then(response => response.body)
    .then(saveToFile)
    .then(data => res.json(JSON.parse(data)))
    .catch(e => {
      console.error('ERROR');
      console.error(e);
    });
};

/**
 * Middleware which logs to file.
 */
app.use((req, res, next) => {
  winston.info(`${moment().format('YYYY-MM-DD HH:mm:SS')}: Incoming ${req.method} request at ${req.url}`);
  next()
});

app.get('/', retrieveJobs);

app.listen(3000, () => console.log('App listening on port 3000!'));
