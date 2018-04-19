# Node Lessons

### Lesson 7: Build a simple Users REST API

**Description**
Having a working database allows us to build a simple [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer).
A very simple API can allow us to list existing Users, create a new User (registration) and edit an existing User.

Let's build the three needed API Endpoints (see Goals) which interact with the underlying MongoDB database, by using the [Express router `express.Router()`](https://expressjs.com/en/guide/routing.html).

As all REST APIs, proper [HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) must be used in the server responses.

Do not forget to hash user passwords before storing it into the database. One of the most widely used hashing algorithm is [bcrypt](https://github.com/kelektiv/node.bcrypt.js).

Lastly, optionally use the new ES6 [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function](async / await) feature in all Services files.
It is often [simpler to use than pure Promises](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9)
and allows to use a [more traditional syntax](https://javascript.info/async-await).

**Goals**
- A `(GET) /users` API Endpoint must be available to retrieve the list of users
- A `(POST) /users` API Endpoint must be available to create a new User and return it
- A `(PUT) /users/:id` API Endpoint must be available to update a User and return the updated user. Only email and username can be updated.

**Allowed Npm Packages**
- `axios`: http client used to perform http requests
- `bcrypt`: password hasher
- `body-parser`: Express middleware to parse the body requests
- `express`: web server
- `moment`: date manager
- `mongoose`: MongoDB client
- `nconf`: configuration files manager
- `validator`: string validation library
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
- The `/users` routes must be defined in the `services/users/users.router.js` file by using the Express router
- Middlewares used in the `/users` endpoints must reside in the `services/users/middlewares/` folder
- Optionally use only `async` / `await` instead of pure Promises in all `/services/` files
- User input validation errors must return a `422` Json response with `{ hasError: 1/0`, `error: <string>`} as response data (payload)
- User passwords must be `bcrypt` hashed before being saved into the database

**Suggestions**
- Use [Postman](https://www.getpostman.com/) to test the API Endpoints
- The request json body data is available under the Express `req.body` variable, once the `body-parser` middleware has been configured

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

- In order to validate user inputs, [validator](https://github.com/chriso/validator.js/) can be very helpful
