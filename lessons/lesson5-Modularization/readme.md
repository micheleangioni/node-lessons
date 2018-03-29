# Node Lessons

### Lesson 5: Split our single-file application into different modules

**Description**
When an application becomes larger, keeping everything is one large file gets things quickly messy.
In order to improve the readability of the code, and thus the maintenability of the whole application, it is useful to split the code into different files, i.e. modules.

Let's put the code of the request logging into `libraries/fileLogger.js` and the code which saves the results to file into `libraries/dataLogger.js`.
Those modules will then be loeaded from our main `index.js` file.

**Goals**
- Move the Data Logger and the File Logger into separated files

**Allowed Npm Packages**
- `axios`: http client used to perform the (GET) http requests
- `express`: web server
- `moment`: date manager
- `winston`: logger

**Requirements**
- The results must be saved in `userdata/data.json`
- The logs must be saved under `storage/logs/nodeJobs.log`
- The Data Logger must reside into `libraries/dataLogger.js`
- The File Logger must reside into `libraries/fileLogger.js`

**Suggestions**
- In order for a module to be imported through `require('./myfile')`, and have a method which returns a Promise, the module file structure must be the following

```js
// myfile.js

const myFeature = {
  /**
   * Does something.
   *
   * @param {string} data
   * @return {Promise}
   */
  do (data) {
    return new Promise((resolve, reject) => {
      // Do some operation
      resolve(data)
    })
  }
};

module.exports = myFeature;
```

it can then be imported through `const myFeature = require('./myfeature.js')` and used with `myFeature.do(data)`, which will indeed return a Promise.
