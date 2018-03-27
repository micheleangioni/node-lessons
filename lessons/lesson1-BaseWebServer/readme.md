# Node Lessons

### Lesson 1: Create a base Github Jobs inspector

**Description**
In this first lesson we need to build a simple Github Jobs inspector. Through the use of Express, a Web Server with a single Endpoint should be created, which allows to look for Jobs through their public API, by filtering for location and full/part time, and returning the results as a Json request, after having saved them into a file.

As first step, let's use the NodeJs [https](https://nodejs.org/api/https.html) API to retrieve the Jobs list and [https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback](fs.writeFile()) to save it to a `userdata/data.json` file.

**Goals**
- Build a simple endpoint `/` using Express which fetches a list of jobs from `https://jobs.github.com/positions.json`
- The following query parameters must be supported: `location`, `full_time`
- The obtained results must be saved into a file
- The url must return the results as a json response

**Allowed Npm Packages**
- `express`: web server
- `https`: http client used to perform the (GET) http request to fetch the job list

**Requirements**
- Neither Promises nor async / await must be used, just simple callbacks
- The results must be saved into `userdata/data.json`

**Suggestions**
- As a starting point, a `index.js` file is available in the`/lessons` folder
- The Request query parameters are available in the Express' `req.query` variable
- `https` does not handle automatically the merge of the different data chunk received upon a http request, it must be done manually:

```js
https.get(url, (response) => {
  let data = '' ;

  response.on('data', (chunk) => {
    data += chunk; // Merging the data chunks
  });

  response.on('end', () => {
    // The full data can now be handled
  });
}).
```
