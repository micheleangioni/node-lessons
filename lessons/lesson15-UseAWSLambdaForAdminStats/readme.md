# Node Lessons

### Lesson 15: Use AWS Lambda to process Admin statistics

**Description**
One of the most captivating features of the Amazon Web Services is the possibility of execute javascript code, which interacts with other AWS services, based on certain events and conditions.

This can be very useful, for example, when a task needs a few seconds to be performed (i.e. some data processing, even almost-real-time)
and numerous requests of the same task would require some enhanced server management.
By using AWS Lambda, we can forget completely about the infrastructure of our application, thanks to its continuous and automatic scaling, and focus only on the code.

Even more interesting, we can setup events between different AWS services, such as S3 and Lambda, such as when certain events occur, lambda functions are automatically invoked.

Although it is not the purpose of these lessons to teach the use of AWS, most of the needed steps will be carefully explained during this lesson, by providing directly the code needed to achieve them.

With the mere purpose of learning how to properly use AMS Lambda, we will now replace the data file logger with a call to the S3 Storage we are already using,
which will then invoke a Lambda function in order to compute the Admin statistics.
They will be saved in S3 again, so that out Random Jobs service will just have to get them from S3.

Since we will use S3 more intensively, it could be a good idea to create different buckets for different environments.
Let's add a `NODE_ENV=local` key to our `.env` and `.env.example` files and store the name of our bucket in `nconf`:

```js
// index.js
nconf.argv()
   .env()
   .file({ file: 'config/secrets.json' })
   .defaults({'s3-bucket-name': `nodelessons-${process.env.NODE_ENV}`});
```

so that it can be retrieved every time we need it.

The first step of our switch to AWS is to add two new methods to our `s3client`,
a `getObject()` and a `putObject()` which respectively get and save an object from and to a S3 bucket (see suggestions).

We can now replace the Data Logger created in lesson 5 with a call of the `s3client` to save the retrieved job list into a new object, which we call `jobSearch`:

```js
s3client.putObject(
  nconf.get('s3-bucket-name'),
  'jobSearch', JSON.stringify(data).replace(/[^\x20-\x7E]/g, '') // Clean non utf-8 chars
)
```

We now want to run an AWS Lambda function to update the Admin statistics, *every time* the list of jobs is updated in our S3 bucket.

Of course, in this sample application, requiring a Lambda Function to run every time the jobs list gets updated is less efficient and more expensive than
running a lambda funcion every time an Admin requires the Jobs statistics (since in an application the number of Admins is supposed to be much lower
than the number of normal users).
But in our case we want to learn how to connect the two AWS services through even sources and we will not focus on optimizing the global AWS costs.

In order to start using AWS Lambda, let's create a new IAM Role with proper policies:

1. `AWSLambdaBasicExecutionRole`
2. A custom Policy with the following definition
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::nodelessons-local/*"
        }
    ]
}
```

Let's create now the real lambda function, which must perform two operations every time it is invoked:

1. Read the `jobSearch` key of out S3 bucket
2. Save the stats data into the `jobStats` key of our S3 bucket

You can start writing the function by using the following template:

```js
// lambda/jobs-stats.js

'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3();

const bucket = `nodelessons-local`;

exports.handler = async (event, context) => {

  let stats;

  try {
    stats = await getJobStats();
  } catch (err) {
    throw new Error(err);
  }

  const statsJson = JSON.stringify(stats);

  try {
    await saveStats(statsJson);
  } catch (err) {
    throw new Error(err);
  }

  return { body: statsJson };
};

function getJobStats() {
  const params = {
    Bucket: bucket,
    Key: 'jobSearch'
  };

  // TODO Call s3.getObject()
}

/**
 * @param {string} stats
 * @return {Promise}
 */
function saveStats(stats) {
  const params = {
    ACL: 'private',
    Body: Buffer.from(stats, 'utf-8'),
    Bucket: bucket,
    ContentType: 'text/html; charset=utf-8',
    Key: 'jobStats',
    ServerSideEncryption: 'AES256'
  };

  // TODO Call s3.putObject()
}
```

In order to upload our lambda function to AWS, we need to zip it into a `jobs-stats.zip` file.
We can then use the AWS Cli to upload it through:

`aws lambda create-function \
 --region region \
 --function-name nodeLessons-job-stats \
 --zip-file fileb://lambda/jobs-stats.zip \
 --role <role-arn> \
 --handler jobs-stats.handler \
 --runtime nodejs8.10`

where `<role-arn>` is the arn code of the role we have created before, eg.

`aws lambda create-function \
  --region eu-central-1 \
  --function-name nodeLessons-job-stats \
  --zip-file fileb://lambda/jobs-stats.zip \
  --role arn:aws:iam::123456789012:role/nodeLessons-lambda\
  --handler jobs-stats.handler \
  --runtime nodejs8.10`

We need also to [pass the PassRole Policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html) to the IAM User,
in order to allow User to pass the Role to the Lambda Service.

By using the AWS Console, add the following policy to the IAM User:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowUserToPassAnyROle",
            "Effect": "Allow",
            "Action": [
                "iam:GetRole",
                "iam:PassRole",
                "iam:PutRolePolicy"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

In order to invoke our lambda function from the AWS CLI, we need to assign also the `lambda:InvokeFunction` policy to the IAM User.
In the AWS Console, in the page to add permissions to the IAM User choose "Create Policy" and "JSON" and copy paste the following code:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Resource": [
                "<ARN OF THE LAMBDA FUNCTION WE HAVE JUST CREATED>"
            ]
        }
    ]
}
```

We can now invoke our lambda function from the CLI:

`aws lambda invoke \
 --invocation-type RequestResponse \
 --function-name nodeLessons-job-stats \
 --region eu-central-1 \
 --log-type Tail \
 --payload '{"key":"value"}' \
  output.txt`

In case of errors, a base64-encoded-log will be provided, which can be unencrypted by using:
`echo base64-encoded-log | base64 --decode`

The AWS Console provides a much more complete and full-featured GUI, which allows for better debugging in case of problems.

AWS provides also a [local environment called SAM Local](https://docs.aws.amazon.com/lambda/latest/dg/test-sam-local.html),
to allow testing of lambda functions without having to pay the usual fee of AWS Lambda.

In order SAM Local to be configured, a template file is needed to instruct it on how to run the lambda function.
The following `template.yaml` file will work out:

```yaml
AWSTemplateFormatVersion : '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: NodeLessons lambda functions.

Resources:

  Products:
    Type: AWS::Serverless::Function
    Properties:
      Handler: jobs-stats.handler
      Runtime: nodejs8.10
      Events:
        GetStats:
          Type: Api
          Properties:
            Path: /stats
            Method: get

```

To invoke the lambda function locally, simply run
`sam local start-api -t lambda/template.yaml`
and visit the generated url with a browser or curl.

Now we need to use an event source to connect AWS S3 to AWS Lambda, in order to run our Lambda Function every time the `jobSearch` S3 key is updated.
Two steps are necessacy:

1. First let's allow the Lambda function to be called by S3:

`aws lambda add-permission \
 --function-name nodeLessons-job-stats \
 --region eu-central-1 \
 --statement-id lambdaPermissionToBeRunFromS3 \
 --action "lambda:InvokeFunction" \
 --principal s3.amazonaws.com \
 --source-arn arn:aws:s3:::nodelessons-local \
 --source-account <bucket-owner-account-id>`

([How to find the account id](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html))

2. Then let's configure the notifications of the S3 bucket towards the lambda function.
Copy the `lambda\s3-notification-configuration.json.example` file into a new `lambda\s3-notification-configuration.json` file and insert the ARN of the lambda function.
From the `lambda` folder then run:

`aws s3api put-bucket-notification \
--bucket nodelessons-local \
--notification-configuration file://s3-notification-configuration.json`

Finally we need to change our `randomjobs.js` file,
so that on the socket.io's `adminStatisticsRequest` event the jobs statistics must now be retrieved by using the `s3client`.

**Goals**
- Store the jobs list into an S3 object, updating it at every request
- Every time the jobs list gets updated, a lambda function should be invoked, which computes jobs statistics and save them into another S3 object
- The `adminStatisticsRequest` socket.io event should fetch the statistics from S3

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
- The logs must be saved under `storage/logs/nodeJobs.log`
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
- The private socket.io room for Admin users must be named `admins`, which listens for `adminStatisticsRequest` events and sends `adminStatistics` events with the number of total available jobs
- The `admins` room must verify a valid authentication token, before granting access to the private room
- A `/users/ PUT API endpoint must be available to retrieve a AWS S3 signed url to allow users to upload profile images
- A wrapper library which handles all calls to to AWS'S3 client must be created in `/libraries/s3client.js`
- The jobs list must be saved into an S3 object named `jobSearch`
- Every time the S3 `jobSearch` object gets updated, a lambda function saved in `lambda/jobs-stats.js` should be invoked
- The lambda function must fetch the job list from S3 and compute some statistics, such as the number of available jobs, saving them into a S3 `jobStats` object
- The job statistics sent via the socket.io `adminStatistics` events must be fetched from S3

**Suggestions**

- Our s3client needs methods to fetch and save single objects into a S3 bucket:

```js
// s3client.js

[...]

class S3client
{
  [...]

  /**
   * Retrieve an object.
   *
   * @param {string} bucket
   * @param {string} key
   * @return {Promise}
   */
  getObject (bucket, key) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucket,
        Key: key
      };

      this.s3.getObject(params, function(err, data) {
        if (err) reject(err);

        resolve(data);
      });
    })
  }

  /**
   * Save an object.
   *
   * @param {string} bucket
   * @param {string} key
   * @param {string} value
   * @return {Promise}
   */
  putObject (bucket, key, value) {
    return new Promise((resolve, reject) => {
      const params = {
        ACL: 'private',
        Body: Buffer.from(value, 'utf-8'),
        Bucket: bucket,
        ContentType: 'text/html; charset=utf-8',
        Key: key,
        ServerSideEncryption: 'AES256'
      };

      this.s3.putObject(params, function(err, data) {
        if (err) reject(err);

        resolve(data);
      });
    })
  }

  [...]
```

- When fetching an object from S3, we get a full object response.
  To access the object data we need to first get the `Body` key, which is a Node `Buffer` variable, and then convert it to string:

```js
const data = await s3client.getObject('s3-bucket-name', 'object-name');
console.log(JSON.parse(object.Body.toString()));
```

- Another way to test a lambda function, is to use the [AWS Lambda Console](https://eu-central-1.console.aws.amazon.com/lambda).
  From there it is indeed possible to directly edit it and perform test runs, with full output and error logs

- The current AWS billing costs can be taken under control under the [Bills page](https://console.aws.amazon.com/billing/home?#/bills?year=2018&month=5) of the Billing area

- Since AWS does not provide any way to set hard expenses limit, it is wise to add some alerts through the [Budgets page](https://console.aws.amazon.com/billing/home?#/budgets) of the Billing area
