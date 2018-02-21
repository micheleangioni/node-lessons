const express = require('express')
const app = express();
const https = require('https');
const fs = require('fs');

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

  return baseUrl
};

const retrieveJobs = (req, res) => {
  let baseUrl = 'https://jobs.github.com/positions.json'
  let fullUrl = addQueryParameters(baseUrl, req.query, ['location', 'full_time'])

  https.get(fullUrl, (response) => {
    let data = '' ;

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data))
    });
  }).on('error', (e) => {
    console.error('ERROR');
    console.error(e);
  });
};

app.get('/', retrieveJobs);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
