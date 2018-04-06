# Node Lessons

### Lesson 9: Add a Logout endpoint

**Description**
The logout feature is still missing in our application. Let's add it via a new API Endpoint.

Since an Authenticated User is identified through his/her authentication token (i.e. the JWT attached to the `Authorization` header), upon logout we need to mark somehow that token expired.
This is called **token invalidation**.

We then need database to store the list of invalidated tokens.
One of the most suitable solution is to use the in-memory database [Redis](https://redis.io/), which guarantees a super-fast and reliable access to its database.

A [NodeJs client](https://github.com/NodeRedis/node_redis) is of course available.
Let's build a `Redis` wrapper class around it in `libraries/redis.js` and place in it all methods which communicate with the Redis server.

Instead of storing in Redis the token itself, which is usually pretty long, let's add a [uuid](https://en.wikipedia.org/wiki/Universally_unique_identifier) to the token payload during its creation.
We will then use this uuid to invalidate the token.
The uuid can be generated through [node-uuid](https://github.com/kelektiv/node-uuid).

The `JwtManager` class will need now new methods to invalidate a token and check whether a token has been previously invalidated.

There are several strategies to implement token invalidation in Redis.
The simplest one is just to keep a [list](https://redis.io/topics/data-types) with all invalidated tokens.
At each logout the token is just added to the list.

A bit more sophisticated strategy is to keep a [list](https://redis.io/topics/data-types) for each User.
In this way, each User list can also have an expiration date in order to avoid to keep the whole history of invalidated tokens in Redis.

Remember to modify the Authentication checker middleware, created in Lesson 8, in order to check not only whether the token is expired or invalid, but also invalidated now.

**Goals**
- Build a `(DELETE) /sessions` API Endpoint to perform User logout. The provided Jwt must be put in an invalidated tokens list handled with Redis

**Allowed Npm Packages**
- `axios`: http client used to perform http requests
- `bcrypt`: password hasher
- `body-parser`: Express middleware to parse the body requests
- `express`: web server
- `jsonwebtoken`: create and verify Json Web Tokens
- `moment`: date manager
- `mongoose`: MongoDB client
- `nconf`: configuration files manager
- `node-uuid`: library to generate uuids
- `redis`: NodeJs Redis client
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

**Suggestions**
- It is useful to assign to each newly generated token a random **uuid**, saved under the `jti` field:

```js
jwt.sign({
  data: {}
}, this.secretKey, {
  expiresIn: '4h',
  jwtid: uuid.v4(), // uuid comes from 'const uuid = require('node-uuid');'
  subject: userId.toString()
});
```

- An efficient way to store invalidated tokens is to use a Redis [list](https://redis.io/topics/data-types). Each user could have its own list
- In order to avoid too long lists, each user key could have an expiration time, renewed every time a new token is added to the list
