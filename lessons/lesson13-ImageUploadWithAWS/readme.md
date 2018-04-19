# Node Lessons

### Lesson 13: Allow for image profile upload using AWS to store them

**Description**
In this lesson we will use [Amazon Web Services (AWS)](https://aws.amazon.com/free) in order to allow Users to upload their profile image, without the need of storing them in our server.
It is not the purpose of this lessons to teach how to use AWS, however in the suggestions paragraph several hints are given in order to perform the required steps.

First of all, I assume the reader has a working [AWS account](https://aws.amazon.com/free) and has setup an IAM User (see suggestions for further information).

Unlike used in our application currectly up to now, the easiest way to load the AWS credentials is to use Environment variables, instead of loading them from a json file. This can be done in two ways:

1. Providing the variables directly from the CLI when starting the application `AWS_ACCESS_KEY_ID=your_access_key AWS_SECRET_ACCESS_KEY=your_secret_key AWS_REGION=eu-central-1 node index.js`

2. Loading the variables from an `.env` file through [dotenv](https://github.com/motdotla/dotenv), which reads an env file and loads the variables directly into the NodeJs `process.env` variable

We will opt for the second way. Let's replicate then the `secrets.json` / `secrets.json.example` files and create the `.env` (which must be gitignored) and `.env.example` files and place them in the `config` folders as well:
  ```
  // .env

  AWS_ACCESS_KEY_ID=your_access_key
  AWS_SECRET_ACCESS_KEY=your_secret_key
  AWS_REGION:eu-central-1
  ```
  Then use `dotenv` to load the file at the very beginning of the code of our `index.js` file.

Create then a `s3client.js` file in the `libraries` folder, which will act as a wrapper of [NodeJs AWS client `aws-sdk`](https://github.com/aws/aws-sdk-js). We need methods to
    1. Create a bucket with CORS permissions
    2. Retrieve a signed url (see suggestions)

Add then a PUT endpoint `'/:id/image/signed-url` to the users service. It will have to retrieve the `fileType` request query parameter, call the `s3client.js` library to create a signed url and return it to the client.

In order to keep our code simple, we assume here that a User always has an profile image, which is not true for newly registered user.
We then leave to the frontend the burden to check whether the image really exists and, if not, use a default image.

Things can of course be done differently, for example saving into the `users` collection of the database the url of the uploaded image.
This would also avoid to hardcode the image url in our application.

**Goals**
- Add an EPI endpoint which allows a client to upload an image
- The image must be stored using the AWS S3 service

**Allowed Npm Packages**
- `axios`: http client used to perform http requests
- `aws-sdk`: Amazon Web Services client
- `bcrypt`: password hasher
- `body-parser`: Express middleware to parse the body requests
- `commander`: library to build NodeJs CLI commands
- `cors`: CORS configuration for Express
- `dotenv`: load variables from an .env file
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
- IAM Accounts are used to avoid to use accounts with too many permissions in our application as a security measure.
    We want to avoid to use, and generally to create, accounts able with a complete access to our AWS account. In case of compromission of our account, we must limit the damage that the hacker can do.
    Crating a IAM Account on our AWS account is pretty straightforward:
    1. Head to [the IAM Console](https://aws.amazon.com/iam/)
    2. Type `IAM` in the list of AWS services and click on the result
    3. Click on `Users` on the left side menu
    4. Click on the blue `Add user` button and complete the required steps
    5. You will be given the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` assiged to the user

- The `s3client.js` needs two methods: `createBucket (name)` and `getSignedUrl (bucket, filename, fileType)`.
    1. `createBucket (name)` must first check whether the bucket already exists by using `s3.headBucket({ Bucket: name }, (err, data) => { ... })`. In case it does not exists, a new bucket must be created with `s3.createBucket(settings, (err, data) => { ... })`. On successful creation, CORS must be setup calling `this.s3.putBucketCors(params, function(err, corsData) { ... })`, where `params` is

    ```js
    const params = {
      Bucket: name,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: [
              '*'
            ],
            AllowedMethods: [
              'GET',
              'PUT',
              'POST',
              'DELETE'
            ],
            AllowedOrigins: [
              '*'
            ],
            ExposeHeaders: [
              'x-amz-server-side-encryption'
            ],
            MaxAgeSeconds: 3000
          }
        ]
      },
      ContentMD5: ''
    };
    ```

    2.  `getSignedUrl (bucket, filename, fileType)` must call `s3.getSignedUrl()` and return the retrieved data:

    ```js
    // s3client.js

    [...]

    getSignedUrl (bucket, filename, fileType) {
      const params = {
        Bucket: bucket,
        Key: filename,
        ContentType: fileType,
        Expires: 60,
        ACL: 'public-read'
      };

      return new Promise((resolve, reject) => {
        this.s3.getSignedUrl('putObject', params, (err, data) => {
          if (err) reject(err);

          const returnData = {
            signedRequest: data,
            url: `https://${bucket}.s3.amazonaws.com/${filename}`
          };

          resolve(returnData);
        });
      })
    }

    [...]
    ```

- Several tutorials which shows how to correctly integrate AWS'S3 service into a NodeJs application are available on the web.
    One that I find really well written is [Heroku's one](https://devcenter.heroku.com/articles/s3-upload-node), from which I've personally taken inspiration writing this lesson





