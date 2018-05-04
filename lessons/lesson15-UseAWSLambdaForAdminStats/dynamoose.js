const dynamoose = require('dynamoose');

dynamoose.setDefaults({
  prefix: 'nodeLessons-',
  suffix: ''
});

module.exports = dynamoose;
