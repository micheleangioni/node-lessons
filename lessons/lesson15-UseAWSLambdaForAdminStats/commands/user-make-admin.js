#!/usr/bin/env node

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const util = require('util');

dotenv.config({path: 'config/.env'});

const dynamooseClient = require('../dynamoose');
app.set('dynamooseClient', dynamooseClient);

const userModelSchema = require('../models/users');
const UsersModel = userModelSchema(app);
const UsersQueryOne = util.promisify(UsersModel.queryOne);

let program = require('commander');

const makeUserAdmin = async (email) => {
  // Retrieve the User

  let user;

  try {
    user = await UsersQueryOne({ email: { eq: email } });
  } catch (error) {
    throw new Error(error.toString());
  }

  if (!user) {
    throw new Error('User not found.');
  }

  try {
    user = await UsersModel.update({ id: user.id, email: user.email }, { admin: true });
  } catch (error) {
    throw new Error(error.toString());
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
