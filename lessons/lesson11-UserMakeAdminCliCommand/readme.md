# Node Lessons

### Lesson 11: Create a UserMakeAdmin Cli Command

**Description**
As every Application, we need to define a special class of users who may have particular rights, such as accessing to a specific area of the Website, ban other users or simply see some statistics.
Let's give the possibilities to our Users to became Admin.

For sure this is not something we want for all users, so the users themselves must not have the possibility to turn themselves into Admin.
We could, for example, give the possibility for an Admin to turn other users into Admins. But then who creates the very first Admin?

One solution is to create a CLI Command, to be run directly on the server, which turns an existing User into ad Admin.
For this, use [commander.js](https://github.com/tj/commander.js) to create a `user-make-admin -u <email>` command,
which takes the email of a user and turns it into ad admin setting the `admin` field of the user record to true.

**Goals**
- Build a CLI Command to turn existing Users into Admins by using [commander.js](https://github.com/tj/commander.js)

**Allowed Npm Packages**
- `axios`: http client used to perform http requests
- `bcrypt`: password hasher
- `body-parser`: Express middleware to parse the body requests
- `commander`: library to build NodeJs CLI commands
- `express`: web server
- `jsonwebtoken`: create and verify Json Web Tokens
- `moment`: date manager
- `mongoose`: MongoDB client
- `nconf`: configuration files manager
- `node-uuid`: library to generate uuids
- `redis`: NodeJs Redis client
- `socket.io`: Web Socket management library
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
- HTTP Status Codes must be coherent: 401 is no authentication is provided, 403 is the token is expired or invalid
- Communication with Redis server must happen entirely inside `libraries/redis.js` which must export a Javascript **Class**. It must be available in Express under the `redisClient` key
- The `Redis` class constructor must take the Redis password as an argument, which must be saved into the `config/secrets.json` file. All methods inside `libraries/redis.js` must return a Promise
- The second argument of the `JwtManager` must be the a `Redis` instance, in order to perform token invalidation
- The `auth.check.js` middleware must also check if the token has been invalidated
- The token invalidation of the `(DELETE) /sessions` route must happen inside a `token.invalidation.js` middleware
- All the Web Sockets code (i.e. the use of the `socket.io` package) must reside into `services/randomjobs/randomjobs.js`
- The `/random-jobs` endpoint must periodically emit a `randomJob` event with a random job data
- The `/random-jobs` endpoint must listen for a `jobRequest` endpoint and a `location` data and emit a `randomJob` event with a random job data for the requested location
- All CLI Commands must reside into the `/commands` folder and build with `commander`
- There must be a CLI Command with signature `user-make-admin -u <email>` which turns existing users into admins

**Suggestions**
- In order to make the `commander` CLI commands speak with the database, the code related to MongoDb and Mongoose could be rewritten directly into the command itself. However that would lead to severe code duplication (imagine having several CLI commands) which would greatly worse code maintenability. A better way consists of importing existing files into the command itself, by making use of an Express instance:

```js
// user-make-admin.js

const express = require('express');
const app = express();
const nconf = require('nconf');

nconf.argv()
  .env()
  .file({ file: 'config/secrets.json' });

const mongooseClient = require('../mongoose');
app.set('mongooseClient', mongooseClient);

const userModelSchema = require('../models/users');
const UsersModel = userModelSchema(app);

let program = require('commander');

[...]
```

- Sometimes in order to end a NodeJs process, it is necessary to explicitily call `process.exit(0)`
