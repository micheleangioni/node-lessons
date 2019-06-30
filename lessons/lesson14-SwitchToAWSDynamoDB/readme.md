# Node Lessons

### Lesson 14: Switch to AWS DynamoDB in place of MongoDB

**Description**
Moving to a more serverless architecture brings us the necessity to get rid of our own MongoDB server.
We have already setup a basic use of the Amazon Web Services in the previous lesson, so let's use again Amazon's [DynamoDB](https://aws.amazon.com/dynamodb/) clound NoSQL database.

Being a NoSQL key-value database, DynamoDB shares many features with other popular NoSQL databases, including MongoDB.
However several details are deeply different, such as the handling of the records' primary key and the relevance of tables' indexes.

In order to proceed with the lesson a base knowledge about DynamoDB is required.
It is not the purpose of these lessons to teach the basics of DynamoDB, but if needed the reader can read the following articles and tutorials:
- [Main Core Concepts](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.SecondaryIndexes)
- [Choosing the right Partition Key](https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/)
- [Secondary Indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html)
- [Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)

Since [DynamoDB API](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property) is pretty low level and therefore complicated to interact directly with,
the use of a third party library is highly recommended, especially when starting to use DynamoDB.
For this reason we will use [dynamoose](https://github.com/automategreen/dynamoose) which uses an API similar to mongoose and allows a much simpler interaction with DynamoDB.

We want then to replace mongoose whenever used with dynamoose.
Having already setup the AWS cerdentials, we don't need to specify further authentication.
The `dynamoose.js` file, which replaces `mongoose.js` will be then particularly simple.

The dynamoose [Schema description](https://dynamoosejs.com/api#schema) is instead a bit different from the mongoose one, bringing us the need to update our `users.js` file with the new format.

We will then need to go through all our middlewares and services to switch to our new database client.

In order to avoid spending credit during development, it is useful to use a [local DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html).
We can then force `dynamoose` to use it instead of a the real cloud instance with

```js
const dynamoose = app.get('dynamooseClient');

if (process.env.NODE_ENV !== 'production') {
  dynamoose.local('http://localhost:8100');
}
```

(!) Remember to generate a User Id when creating a new User in the `users.router.js` file. A simple UUID generated through `uuid` will make the work.

(!!) In order to be able to interact with DynamoDB, the AWS user must have the right permissions. For example, we can add the `AmazonDynamoDBFullAccess` policy to the user through the [AWS Console](https://console.aws.amazon.com/iam).

**Goals**
- Switch from MongoDB to DynamoDB, by using `dynamoose` in place of `mongoose` to interact with the database

**Allowed Npm Packages**
- `axios`: http client used to perform http requests
- `aws-sdk`: Amazon Web Services client
- `bcryptjs`: password hasher
- `body-parser`: Express middleware to parse the body requests
- `commander`: library to build Node.js CLI commands
- `cors`: CORS configuration for Express
- `dotenv`: load variables from an .env file
- `dynamoose`: DynamoDB client
- `express`: web server
- `jsonwebtoken`: create and verify Json Web Tokens
- `moment`: date manager
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
- The Dynamoose configuration must reside into a `dynamoose.js` file, loaded directly from the `index.js`
- The Dynamoose client must be made available in Express under the `dynamooseClient` key
- The Users Model must be saved into `models/users.js` and have the following __Schema__ :

  - id: String, hashKey
  - email: String, rangeKey, GSI
  - username: String, required, GSI
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
- A `/users/ PUT API endpoint must be available to retrieve a AWS S3 signed url to allow users to upload profile images
- A wrapper library which handles all calls to to AWS'S3 client must be created in `/libraries/s3client.js`

**Suggestions**

- The `dynamoose.js` file can now be a simple export of the `dynamoose` client

```js
const dynamoose = require('dynamoose');

dynamoose.setDefaults({
  prefix: 'nodeLessons-',
  suffix: ''
});

module.exports = dynamoose;
```

- When creating a new User, it is important to define a unique Partition key

```js
// users.router.js

[...]

**
* Create a new User.
*/
router.post('/', (req, res) => {
  UsersModel.create({
    id: uuid.v4(),
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  }, (err, user) => {
    // Handle callback
  });
});

[...]

```

- `dynamoose` uses the Node.js callback format. It can be handy to [promisify](https://hackernoon.com/node8s-util-promisify-is-so-freakin-awesome-1d90c184bf44) its methods, for example:

```js
const UsersModel = req.app.get('usersModel');
const UsersQueryOne = util.promisify(UsersModel.queryOne);

try {
  user = await UsersQueryOne({ email: { eq: data.email } });
} catch (e) {
  // Handle exception
}
```
