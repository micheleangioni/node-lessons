const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const JwtManager = require('./libraries/jwtManager');
const nconf = require('nconf');
const fileLogger = require('./libraries/fileLogger');
const http = require('http').Server(app);
const models = require('./models/models');
const Redis = require('./libraries/redis');
const S3client = require('./libraries/s3client');
const services  = require('./services/services');

dotenv.config({path: 'config/.env'});

nconf.argv()
  .env()
  .file({ file: 'config/secrets.json' })
  .defaults({'s3-bucket-name': `nodelessons-${process.env.NODE_ENV}`});

const s3client = S3client(process.env.AWS_REGION);
s3client.createBucket(nconf.get('s3-bucket-name'));

const dynamoose = require('./dynamoose');

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
    .then(() => {
      return s3client.putObject(
        nconf.get('s3-bucket-name'),
        'jobSearch', JSON.stringify(data).replace(/[^\x20-\x7E]/g, '') // Clean non utf-8 chars
      )
    })
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
app.set('s3client', s3client);

/**
 * Set Dynamoose Client.
 */
app.set('dynamooseClient', dynamoose);

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
