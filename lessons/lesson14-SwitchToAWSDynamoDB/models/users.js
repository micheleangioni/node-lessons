module.exports = (app) => {
  const dynamoose = app.get('dynamooseClient');

  if (process.env.NODE_ENV !== 'production') {
    dynamoose.local('http://localhost:8100');
  }

  return dynamoose.model('User', {
    id: {
      type: String,
      hashKey: true,
    },
    email: {
      type: String,
      rangeKey: true,
      index: {
        global: true,
        rangeKey: 'username',
        name: 'EmailIndex',
        project: true,
        throughput: 1
      }
    },
    username: {
      type: String,
      index: {
        global: true,
        rangeKey: 'email',
        name: 'UsernameIndex',
        project: true,
        throughput: 1
      },
      required: true
    },
    password: {
      type: String,
      required: true
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
    {
      throughput: {
        read: 1,
        write: 1
      }
    });
};
