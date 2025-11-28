const { Worker } = require('bullmq');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { redisOptions } = require('../config/redis');
const { calculateLateScore } = require('../controllers/submissionController');

const prisma = new PrismaClient();

const worker = new Worker('submission-regrade-duedate', async job => {
    const { assignmentId } = job.data;
    const submissions = await prisma.submission.findMany({
        where: { assignmentId: Number(assignmentId) },
        include: { assignment: true }
    });
    //loop through each submission and re-calculat the late score 
    for (const submission of submissions) {
        if (!submission.assignment) continue;
        const dueDateString = submission.assignment.dueDate.toISOString();
        const submittedAt = submission.submittedAt;
        const newScore = calculateLateScore(submittedAt, dueDateString, submission.rawScore);
        await prisma.submission.update({
            where: { id: submission.id },
            data: { score: newScore }
        });
    }

}, { connection: redisOptions });

worker.on('completed', job => console.log('Submission regrade completed', job.id));
worker.on('failed', (job, err) => console.error('Submission regrade failed', job?.id, err));
