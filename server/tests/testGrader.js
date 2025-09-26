const { gradeJavaSubmission } = require('../services/gradingService');

const repoPath = 'app/test-repo'; // Path inside the container

gradeJavaSubmission(repoPath).then(result => {
  console.log('Grading result:', result);
});