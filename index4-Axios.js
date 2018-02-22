const express = require('express');
const app = express();
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');

const winston = require('winston');
winston.add(winston.transports.File, { filename: 'storage/logs/nodeJobs.log' });
winston.remove(winston.transports.Console);

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
  const baseUrl = 'https://jobs.github.com/positions.json';

  axios.get(baseUrl, { params: getQueryParameters(req.query, ['location', 'full_time']) })
    .then(response => {
      let data = response.data

      saveToFile(data, () => res.json(data));
    })
    .catch(e => {
      console.error('ERROR');
      console.error(e);
    });
};

app.use((req, res, next) => {
  winston.info(`${moment().format('YYYY-MM-DD HH:mm:SS')}: Incoming ${req.method} request at ${req.url}`);
  next()
});

app.get('/', retrieveJobs);

app.listen(3000, () => console.log('App listening on port 3000!'));
