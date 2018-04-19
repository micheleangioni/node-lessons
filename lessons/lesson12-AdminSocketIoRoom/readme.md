# Node Lessons

### Lesson 12: Create a socket.io room for Admin Users

**Description**
Now that we have a CLI Command to turn users into admins, let's create a socket.io Admin [room](https://socket.io/docs/rooms-and-namespaces/) , named `admins` which sends them some statistics of the available Jobs.

Only users who have been previously turned into admins must join the `admins` room.

One particular important point to consider is the authentication of the requiring user. Sending for example just the user id to during the Web Socket connection (i.e. when calling `io.connect()` from the client) is not enough, since the back end has no way to check whether the client user sending the request is really the user corresponding to the received id.

For that reason, when setting up the Web Socket connection, the access token of the authenticated user must also be sent, as a simply query parameter (i.e. `http://localhost:3000/random-jobs/?token=mylongandrandomtoken`). The backend then will check the validity of the received token and, provided it belongs to an Admin user, it will let the socket connection to join the `admins` room.

***Testing***
At this point, testing our backend API without a frontend becomes challenging.
We can still use [serve](https://github.com/zeit/serve) to use the simple front end located in the `index.html` file of the lesson folder.

However, since in this case the front end will have to perform Cross Origin requests, we need to configure [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) on our server,
otherwise the browsers will block our requests, for example the one we use to login.

In order to do so, we just need to use [cors](https://github.com/expressjs/cors) in our Express server and configure it to allow the `Authorization` header to be exposed.
We also need to allow `Options` calls to our server, in order to allow "not simple" requests (e.g. POST request) to be handled.
The code is straightforward:

```js
// index.js

[...]
const cors = require('cors');
[...]

/**
 * Use CORS and enable pre-flight accross all routes.
 */
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

[...]

```

**Goals**
- Add a private socket.io room for Admin users, used to require the total available jobs

**Allowed Npm Packages**
- `axios`: http client used to perform http requests
- `bcrypt`: password hasher
- `body-parser`: Express middleware to parse the body requests
- `commander`: library to build NodeJs CLI commands
- `cors`: CORS configuration for Express
- `express`: web server
- `jsonwebtoken`: create and verify Json Web Tokens
- `moment`: date manager
- `mongoose`: MongoDB client
- `nconf`: configuration files manager
- `node-uuid`: library to generate uuids
- `redis`: NodeJs Redis client
- `socket.io`: Web Socket management library
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
  - admin: boolean, default: false

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
- The private socket.io room for Admin users must be named `admins`, which listens for `adminStatisticsRequest` events and sends `adminStatistics` events with the number of total available jobs, read from the `data.json` file
- The `admins` room must verify a valid authentication token, before granting access to the private room

**Suggestions**
- Upon connection, the query parameters received by socket.io are available under `socket.handshake.query`:

```js
io.on('connection', (socket) => {
    // query parameters are available under 'socket.handshake.query'
    [...]
});
```

- Joining an `admins` room is as simple as calling `socket.join('admins');`
