const mongoose = require('mongoose');
const nconf = require('nconf');

mongoose.connect(
  `${nconf.get('db_adapter')}://${nconf.get('db_username')}:${nconf.get('db_password')}@${nconf.get('db_host')}:${nconf.get('db_port')}/${nconf.get('db_name')}`, {})
  .catch(e => {
    console.log(e)
  });
// mongoose.Promise = global.Promise;

module.exports = mongoose;
