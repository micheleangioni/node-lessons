# Node Lessons

### Lesson 6: Use Mongoose to connect to a Mongo database

**Description**
It is now time to add some persistence to our application. NodeJs is often used in combination with NoSQL databases, such as [MongoDB](https://www.mongodb.com/).

This lesson requires a basic knowledge about MongoDB.
In particular, the concept of collections and how they differ from traditional tables of relational databases.

The most used NodeJs MongoDB client is [Mongoose](https://github.com/Automattic/mongoose).
Let's use it to connect to the MongoDB server.

Mongoose allows also to define our MongoDB collection [schemas](http://mongoosejs.com/docs/guide.html).
Let's define a `users` collection as defined in the requirement section.

Connecting to the MongoDB server requires certain variables such as the MongoDB database name and the user credentials (username and password).
We must **not** hardcode these variables into the code, but instead we should save it into a file which won't be added to the Version Control System (git).

In order to provide a blueprint of this file, so that anyone cloning the repo will still know which variables this file needs to contain,
let's add a `config/secrets.json.example` file to VCS with example values (see he suggestions paragraph).
The copy the just created file into a new `config/secrets.json` file and add it to the `.gitignore` file. Then fill in the appropriated values.

In order to then load those variables into the application, let's use [nconf](https://github.com/indexzero/nconf).

**Goals**
- Add a json configuration file to store MongoDB variables
- Add support for MongoDB database through the use of a Mongoose client
- Add a `users` Mongoose Model

**Allowed Npm Packages**
- `axios`: http client used to perform http requests
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
- The `config/secrets.json.example` could look like the following:

```json
{
  "db_adapter": "mongodb",
  "db_host": "localhost",
  "db_port": 27017,
  "db_name": "db",
  "db_username": "username",
  "db_password": "password"
}
```

it just contains all the needed variable to connect to the MongoDB server.

- To connect to the MongoDB client by using the variables read through `nconf`, use

```js
// mongoose.js

[...]

mongoose.connect(
  `${nconf.get('db_adapter')}://${nconf.get('db_username')}:${nconf.get('db_password')}@${nconf.get('db_host')}:${nconf.get('db_port')}/${nconf.get('db_name')}`, {})
  .catch(e => {
    console.log(e)
  });

[...]
```

- To make variables (such as objects) available in the Express application, use `app.set('name', variable);`.
  For example `app.set('mongooseClient', mongoose);` will make the `mongoose` variable available through the `mongooseClient` key. To retrieve it, just use `app.get('mongooseClient')` afterwards
