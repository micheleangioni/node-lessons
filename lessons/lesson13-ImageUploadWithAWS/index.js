const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const JwtManager = require('./libraries/jwtManager');
const nconf = require('nconf');
const dataLogger = require('./libraries/dataLogger');
const fileLogger = require('./libraries/fileLogger');
const http = require('http').Server(app);
const models = require('./models/models');
const Redis = require('./libraries/redis');
const S3client = require('./libraries/s3client');
const services  = require('./services/services');

dotenv.config({path: 'config/.env'});

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
 * Use CORS and enable pre-flight accross all routes.
 */
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Use fileLogger middleware.
 */
app.use(fileLogger);

/**
 * Set Redis Client.
 */
app.set('redisClient', Redis(nconf.get('redis_password')));

/**
 * Set Jwt Manager.
 */
app.set('jwtManager', JwtManager(nconf.get('app_key'), app.get('redisClient')));

/**
 * Set S3 Client.
 */
app.set('s3client', S3client(process.env.AWS_REGION));

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
services(http, app);

http.listen(3000, () => console.log('App listening on port 3000!'));
