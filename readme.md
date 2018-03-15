# Node Lessons

> Node Lessons are a series of exercises aimed to learn the basics of NodeJs and Express.

## Introduction

Learning the basics of NodeJs can be tough.
The number of guides, tutorials and articles can be overwhelming and, even though NodeJs after years of crazy and almost hysteric development has entered an more mature era in its life, the number of libraries, plugins and frameworks to choose from can leave the new users quite confused.

These lessons will guide new users to explore the potential of Express, the most used framework to build Web back ends with NodeJs.
Since its low level nature, it will soon become important to rely on various npm packages to avoid drowning in the complexities of low level Javascript.

In order to practice with Node Lessons the following software requirements are needed:

- NodeJs v8+
- MongoDB server

## Installation

Just clone the repo and run `npm install` to install the needed dependencies.

## Lessons

The `/lessons` folder contains an implementation of the code required to fulfill the requirements of each lesson.

Each lesson has a list of **goals**, a list of **allowed npm packages**, some **requirements** and some **suggestions**.

Moreover, each lesson inherits the goals of *all* previous lessons, but a completely *new* list of allowed npm packages and requirements is given.

As a general suggestion, once understood the goals of a lesson, try to implement the requirements one by one.

Suggestions can be read before starting to code or only after getting stuck, it is up to the reader.

### Lesson 1: Base Api

**Goals**
- Build a simple endpoint `/` using Express which fetches a list of jobs from `https://jobs.github.com/positions.json`
- The following query parameters must be supported: `location`, `full_time`
- The obtained results must be saved into a file
- The url must return the results as a json response

**Allowed Npm Packages**
- `express`: web server
- `https`: http client used to perform the (GET) http request to fetch the job list

**Requirements**
- Neither Promises nor async / await must be used
- The results must be saved in `userdata/data.json`

**Suggestions**
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

- Use Node's `fs.writeFile()` to save the results to file

### Lesson 2: RequestPromise

**Goals**
- Simplify the http client code by using `request-promise`

**Allowed Npm Packages**
- `express`: web server
- `request-promise`: http client used to perform the (GET) http request to fetch the job list

**Requirements**
- The results must be saved in `userdata/data.json`
- `fs.writeFile` must reside inside its own function that returns a Promise

**Suggestions**
- Asynchronous functions using callbacks, such as Node ones, can be wrapped into a Promise by

```js
return new Promise((resolve, reject) => {
  fs.writeFile('userdata/data.json', data, (err) => {
    if (err) reject();
    resolve(data);
  });
})
```

### Lesson 3: Middleware Logs

**Goals**
- Every time the Web Server is hit, a log to file must be written by using Winstone, containing the timestamp, the request method and url. Winstone must be used in a global Express application middleware

**Allowed Npm Packages**
- `express`: web server
- `moment`: date manager
- `request-promise`: http client used to perform the (GET) http request to fetch the job list
- `winston`: logger

**Requirements**
- The results must be saved in `userdata/data.json`
- The logs must be saved under `storage/logs/nodeJobs.log`

**Suggestions**
- Use `moment` to handle a proper date format to be logged into file

### Lesson 4: Axios

**Goals**
- Use `axios` as http client

**Allowed Npm Packages**
- `axios`: http client used to perform the (GET) http requests
- `express`: web server
- `moment`: date manager
- `winston`: logger

**Requirements**
- The results must be saved in `userdata/data.json`
- The logs must be saved under `storage/logs/nodeJobs.log`

**Suggestions**
- Rewrite the function that takes the query parameters from the incoming request

### Lesson 5: Modularization

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
- In order for a module to be imported through `require('./myfile')`, the module file structure must be the following

```js
// myfeature.js

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

it can then be imported through `const myFeature = require('./myfeature.js')` and used with `myFeature.do(data)`, which will return a Promise.

### Lesson 6: Mongoose

**Goals**
- Add a json configuration file to store MongoDB variables
- Add support for MongoDB database through the use of Mongoose client
- Add a `users` Mongoose Model

**Allowed Npm Packages**
- `axios`: http client used to perform the (GET) http requests
- `express`: web server
- `moment`: date manager
- `mongoose`: MongoDB client
- `nconf`: configuration files manager
- `winston`: logger

**Requirements**
- The results must be saved in `userdata/data.json`
- The logs must be saved under `storage/logs/nodeJobs.log`
- The Data Logger must reside into `libraries/dataLogger.js`
- The File Logger must reside into `libraries/fileLogger.js`
- The MongoDB configuration variables must reside into `config/secrets.json`, which **MUST** be gitignored
- A `config/secrets.json.example` file must be provided, with the list of supported keys and example values of the `config/secrets.json` file
- Configuration values must be loaded by using `nconf` directly at the beginning of the `index.js`
- The Mongoose configuration must reside into a `mongoose.js` file, loaded directly from the `index.js`
- The Mongoose client must be made available in Express under the `mongooseClient` key
- The Users Model must be saved into `models/users.js` and have the following __Schema__ :

  - username: String, required, unique
  - email: String, unique
  - password: string, required

- The Users Model must be made available in Express under the `usersModel` key

**Suggestions**
- To connect to the MongoDB client by using the variables read through `nconf`, use

```js
mongoose.connect(
  `${nconf.get('db_adapter')}://${nconf.get('db_username')}:${nconf.get('db_password')}@${nconf.get('db_host')}:${nconf.get('db_port')}/${nconf.get('db_name')}`, {})
  .catch(e => {
    console.log(e)
  });
```

- To make variables (such as objects) available in the Express application, use `app.set('name', variable);`.
  For example `app.set('mongooseClient', mongoose);` will make the `mongoose` variable available through the `mongooseClient` key. To retrieve it, just use `app.get('mongooseClient')` afterwards

### Lesson 7: Simple Users API

**Goals**
- A `(GET) /users` API Endpoint must be available to retrieve the list of users
- A `(POST) /users` API Endpoint must be available to create a new User and return it
- A `(PUT) /users/:id` API Endpoint must be available to update a User and return the updated user. Only email and username can be updated.

**Allowed Npm Packages**
- `axios`: http client used to perform the (GET) http requests
- `bcrypt`: password hasher
- `body-parser`: Express middleware to parse the body requests
- `express`: web server
- `moment`: date manager
- `mongoose`: MongoDB client
- `nconf`: configuration files manager
- `winston`: logger

**Requirements**
- The results must be saved in `userdata/data.json`
- The logs must be saved under `storage/logs/nodeJobs.log`
- The Data Logger must reside into `libraries/dataLogger.js`
- The File Logger must reside into `libraries/fileLogger.js`
- The MongoDB configuration variables must reside into `config/secrets.json`, which **MUST** be gitignored
- A `config/secrets.json.example` file must be provided, with the list of supported keys and example values of the `config/secrets.json` file
- Configuration values must be loaded by using `nconf` directly at the beginning of the `index.js`
- The Mongoose configuration must reside into a `mongoose.js` file, loaded directly from the `index.js`
- The Mongoose client must be made available in Express under the `mongooseClient` key
- The Users Model must be saved into `models/users.js` and have the following __Schema__ :

  - username: String, required, unique
  - email: String, unique
  - password: string, required

- The Users Model must be made available in Express under the `usersModel` key
- The `/users` routes must be defined in the `services/users/users.router.js` file
- Middlewares used in the `/users` endpoints must reside in the `services/users/middlewares/` folder
- Use only `async` / `await` instead of pure Promises in all `/services/` files
- User input validation errors must return a `422` Json response with `hasError: 1/0` and `error: <string>` keys
- User passwords must be `bcrypt` hashed before being saved into the database

**Suggestions**
- Use [Postman](https://www.getpostman.com/) to test the API Endpoints
- The json body data are available under the Express `res.body` variable, once the `body-parser` middleware has been configured
```js
// index.js

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
```

- Use middlewares to perform data validation, eg.

```js
// services/users/users.router.js

[...]
const usersValidationNew = require('./middlewares/users.validation.new');
[...]

// Validation Middleware.

router.post('/', async (req, res, next) => {
  try {
    await usersValidationNew(app, req.body);
  } catch (error) {
    res.status(422).json({ hasError: 1, error: error.toString() });
    return;
  }

  next();
});
```

- Use `mongodb`'s `ObjectId` to check whether input User id is a valid id:

```js
// services/users/users.router.js

[...]
  const { ObjectId } = require('mongodb');
[...]

router.put('/:id', async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(422).json({ hasError: 1, error: 'Invalid User Id.' });
    return;
  }

  [...]
}
```

## Contribution guidelines

Please follow the coding style defined in the `.eslintrc.json` file.

Pull requests are welcome.

## License

Node Lessons is free software distributed under the terms of the MIT license.
