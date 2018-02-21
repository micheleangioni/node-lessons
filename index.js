const express = require('express')
const app = express()
const https = require('https');
const fs = require('fs');

const retrieveJobs = (req, res) => {
  https.get('https://jobs.github.com/positions.json?description=python&location=sf&full_time=true', (response) => {
    let data = '' ;

    response.on('data' , function (chunk) {
      data += chunk.toString();
    });

    response.on('end' ,  function() {
      res.json(data)
    });
  }).on('error', (e) => {
    console.error('ERROR');
    console.error(e);
  });
}

app.get('/', retrieveJobs);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
