const express = require('express');
const app = express();
const axios = require('axios');
const dataLogger = require('./libraries/dataLogger');
const fileLogger = require('./libraries/fileLogger');

/**
 * Get allowed query parameters and return them in an object.
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
  let data;

  axios.get(baseUrl, { params: getQueryParameters(req.query, ['location', 'full_time']) })
    .then(response => { return data = response.data })
    .then(() => { return dataLogger.saveToFile(JSON.stringify(data)) })
    .then(() => res.json(data))
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
