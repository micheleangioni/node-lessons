const express = require('express'); // Node.js Web Server
const app = express(); // Main Express application object

const retrieveJobs = (req, res) => {
  console.log('Request Query Parameters: ', req.query);

  res.json('I need to retrieve the jobs.');
};

app.get('/', retrieveJobs);

app.listen(3000, () => console.log('App listening on port 3000!'));
