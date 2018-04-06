const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const JwtManager = require('./libraries/jwtManager');
const nconf = require('nconf');
const dataLogger = require('./libraries/dataLogger');
const fileLogger = require('./libraries/fileLogger');
const models = require('./models/models');
const services  = require('./services/services');

nconf.argv()
  .env()
  .file({ file: 'config/secrets.json' });

const mongoose = require('./mongoose');

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
 * Configure Body Parser.
 */
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

/**
 * Use fileLogger middleware.
 */
app.use(fileLogger);

/**
 * Set Jwt Manager.
 */
app.set('jwtManager', JwtManager(nconf.get('app_key')));

/**
 * Set Mongoose Client.
 */
app.set('mongooseClient', mongoose);

/**
 * Set Mongoose Models.
 */
models(app);

app.get('/', retrieveJobs);

/**
 * Set Services.
 */
services(app);

app.listen(3000, () => console.log('App listening on port 3000!'));
