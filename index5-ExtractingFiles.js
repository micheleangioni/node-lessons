const express = require('express');
const app = express();
const axios = require('axios');
const dataLogger = require('./libraries/dataLogger');
const fileLogger = require('./libraries/fileLogger');

/**
 * This function could be heavily simplified or avoided by using the 'request' or 'axios' Node modules.
 *
 * @param {object} query
 * @param {array} allowedNames
 * @return {object}
 */
const getQueryParameters = (query, allowedNames) => {
  let queryObject = {};

  for (const queryName in query) {
    if (allowedNames.includes(queryName)) {
      queryObject[queryName] = query[queryName];
    }
  }

  return queryObject;
};

const retrieveJobs = (req, res) => {
  const baseUrl = 'https://jobs.github.com/positions.json';

  axios.get(baseUrl, { params: getQueryParameters(req.query, ['location', 'full_time']) })
    .then(response => response.data)
    .then(dataLogger.saveToFile)
    .then(data => res.json(data))
    .catch(e => {
      console.error('ERROR');
      console.error(e);
    });
};

/**
 * Use fileLogger middleware.
 */
app.use(fileLogger);

app.get('/', retrieveJobs);

app.listen(3000, () => console.log('App listening on port 3000!'));
