const axios = require('axios');
const baseUrl = 'https://jobs.github.com/positions.json';
const dataLogger = require('../../libraries/dataLogger');
const jwtManager = require('../../libraries/jwtManager');

const getRandomJob = (location = null) => {
  return new Promise((resolve, reject) => {
    let params = {};

    if (location) {
      params.location = location;
    }

    axios.get(baseUrl, { params: params })
      .then(response => response.data)
      .then(jobs => {
        if (jobs.length === 0) {
          resolve('No jobs found.');
          return;
        }

        let min = 0;
        let max = jobs.length - 1;
        let job = jobs[Math.floor(Math.random() * (max - min + 1)) + min];

        resolve(`Title: ${job.title}; Location: ${job.location}; Type: ${job.type}.`);
      })
      .catch(e => {
        reject(e);
      });
  });
};

module.exports = (http) => {
  const io = require('socket.io')(http, {
    path: '/random-jobs'
  });

  /**
   * Setup Web Sockets.
   */
  io.on('connection', (socket) => {
    // Check Authentication and join the admin room is the User is an Admin

    if (socket.handshake.query && socket.handshake.query.token){
      try {
        jwtManager.verify(socket.handshake.query.token);
      } catch (e) {

      }

      socket.join('admins');
    }

    socket.on('jobRequest', (location) => {
      getRandomJob(location)
        .then(job => {
          io.emit('randomJob', job);
        })
        .catch(e => {
          console.error('ERROR');
          console.error(e);
        });
    });

    setInterval(() => {
      getRandomJob()
        .then(job => {
          io.emit('randomJob', `Random Job: ${job}`);
        })
        .catch(e => {
          console.error('ERROR');
          console.error(e);
        });
    }, 3000);

    socket.on('adminStatisticsRequest', async () => {
      const fileData = await dataLogger.readFile();

      const data = {
        availableJobs: fileData.length
      };

      io.to('admins').emit('adminStatistics', data);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
