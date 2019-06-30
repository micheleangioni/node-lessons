# Node Lessons

### Lesson 10: Add Web Sockets with SocketIo

**Description**
One of the strong points of Node.js is its easiness to setup a [Web Socket](https://en.wikipedia.org/wiki/WebSocket) server and its endpoints.
If fact, nowadays every modern Web or Mobile Application makes use of Web Sockets to provide an ehnanced and more immersive User Experience.

Probably the most used Node.js library to setup Web Sockets is [socket.io](https://github.com/socketio/socket.io), which makes straightforward to handle the communication between two entities (usually server and client) through Web Sockets and additionally provides useful features to allow more complex patterns and the realization of sophisticated Web and Mobile Applications.

Let's add then a `/random-jobs` endpoint which opens a Web Socket connection with a client.
It will then automatically emit an event `randomJob` to the consumer (i.e. the connected client) with a random job taken from the public Github Jobs API.

It must also listen to the `'jobRequest'` event, with a location string as data.
It will then fetch a random job with the received location parameter (still from the public Github Jobs API) and emit an event `randomJob` with the found job.

In order to test the backend API, you can use [serve](https://github.com/zeit/serve) to use a simple frontend, located in the `index.html` file of the lesson folder.

**Goals**
- Build a Web Socket `/random-jobs` Endpoint by using [socket.io](https://socket.io/)
- The endpont should be able to receive a `jobRequest` event with a `location` data and answer with a random job from the free Gihub Jobs API
- Once connected to the Web Socket endpoint, every 3 seconds it should automatically send a random job, taken from the same API and without location filter, to the connected client via a `randomJob` event

**Allowed Npm Packages**
- `axios`: http client used to perform http requests
- `bcryptjs`: password hasher
- `body-parser`: Express middleware to parse the body requests
- `express`: web server
- `jsonwebtoken`: create and verify Json Web Tokens
- `moment`: date manager
- `mongoose`: MongoDB client
- `nconf`: configuration files manager
- `node-uuid`: library to generate uuids
- `redis`: Node.js Redis client
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

**Suggestions**
- Since `socket.io` requires an instance of the Node.js `http` server, modify your starting `index.js` file to use it

```js
// index.js

[...]
const express = require('express');
const app = express();
const http = require('http').Server(app);
[...]

http.listen(3000, () => console.log('App listening on port 3000!'));
```

- You can customize the Web Socket endpoint with

```js
const io = require('socket.io')(http, {
    path: '/random-jobs'
  });
```

- Use [serve](https://github.com/zeit/serve) to test the Web Sockets. Just globally install it, run `serve -p 5001` from the `/lessons/lesson10-SocketIo` folder and point your browser to `http://localhost:5001/`
