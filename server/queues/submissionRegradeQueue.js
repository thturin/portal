const { Queue } = require('bullmq');
const { redisOptions } = require('../config/redis');

const submissionRegradeDueDateQueue = new Queue('submission-regrade-duedate', {
  connection: redisOptions
});

module.exports = { submissionRegradeDueDateQueue };