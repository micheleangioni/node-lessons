#!/usr/bin/env node

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

const makeUserAdmin = async (email) => {
  let user = await UsersModel.findOneAndUpdate({ email }, { admin: true });

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

program
  .option('-u, --user <email>', 'Make input user as an admin.')
  .parse(process.argv);

if (!program.user) {
  console.log('Please provide a user through the -u option.');
  process.exit(0);
}

Promise.resolve()
  .then(() => makeUserAdmin(program.user))
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e.toString());
    process.exit(0);
  });
