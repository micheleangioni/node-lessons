# Node Lessons

### Lesson 8: Add Authentication

**Description**
Handling Authentication is probably the most critical part of most applications.
Every error or bug where authentication is involved could lead to a hack or the website or a leak of private / sensible information.

In this lesson we will build an Authentication system using [Json Web Tokens (JWT)](https://slides.com/micheleangioni/authentication-tokens).

The first step is to build a module (i.e. a file) which will handle the JWT creation and validation.
For this purpose we will use the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) library.

Our Authentication system will then be composed of two parts:

1. In the login route, after validating the user credentials, a new token must be created and added to the response as `Authentication` header
```js
router.post('/', (req, res) => {
    // Create a new token and save it in a 'token' variable

    res.set('Authorization', `Bearer ${token}`);

    // Send back the User data as json response
  });
```
this will be read and stored by the client and sent back to each subsequent request to the server. The response will send back the data of the logged in User

2. A middleware which acts on each protected route (i.e. each route which needs an authenticated user to be accessed) and check whether the request has a valid token

**Goals**
- Build a `(POST) /sessions` API Endpoint to perform User login. A Json Web Token (JWT) must be returned upon successful authentication
- All `/users` routes must be now private, i.e. only authenticated users can access them

**Allowed Npm Packages**
- `axios`: http client used to perform http requests
- `bcrypt`: password hasher
- `body-parser`: Express middleware to parse the body requests
- `express`: web server
- `jsonwebtoken`: create and verify Json Web Tokens
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
- JWT management (creation and verification) must be handled in `libraries/jwtManager.js`, which must export a Javascript **Class**. It must be available in Express under the `jwtManager` key
- The Secret Key used to create the tokens must be stored in the `secrets.json` file
- `/sessions` routes must be defined in `services/sessions/sessions.router.js`
- `/users` API Endpoints must check for authenticated users through the use of a `auth.check.js` middleware
- HTTP Status Codes must be coherent: 401 if no authentication is provided (i.e. token not found in the `Authorization` header, 403 if the token is expired or invalid

**Suggestions**
- Exporting a class is quite easy

```js
const package = require('package');

class MyClass
{
  /**
   * @param {string} myvariable
   */
  constructor(myvariable) {
    this.myvariable = myvariable

    // Code
  }

  /**
   * @param {string} myparameter
   */
  myMethod(myparameter) {
    // variable is available under this.myvariable
    // package is available inside methods

    // Code
  }
}

module.exports = function (myvariable) {
  return new MyClass(myvariable);
};
```

- When creating a token, remember to save the userId into the `sub` payload field. It can be set with the `subject` key in the `options` parameter of the `sign()` method of the `jsonwebtoken` package

```js

// jwt.sign(payload, secretOrPrivateKey, [options, callback])
jwt.sign({
  data: {}
}, 'my secret key stored in /config/secrets.json', {
  expiresIn: '4h',
  subject: <User id> // The User Id, as defined by MongoDB, should be stored here
});
```

- When checking for login validation, in case of success it is useful to save the authenticated user id and user data into the request, so that it is available later

```js
// login.validation.js

module.exports = async (app, data, context) => {
  [...] // Perform Login Validation and retrieve the user data

  context.id = user._id;
  context.user = {
    id: user._id,
    email: user.email,
    username: user.username,
    admin: user.admin || false
  };
};
```

```js
// sessions.router.js

router.post('/', async (req, res, next) => {
  if (!req.context) {
    req.context = {};
  }

  try {
    await loginValidation(app, req.body, req.context);
  } catch (error) {
    // Handle error
  }

  next();
});

router.post('/', (req, res) => {
  // req.context.user is now available here!

  [...]
});
```

- Let's save the user id also in the auth check middleware

```js
// auth.check.js

module.exports = async (app, data, context) => {
  [...] // Check whether the user is authenticated

  context.id = userId;
};
```
