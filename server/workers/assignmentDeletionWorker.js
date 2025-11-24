const { Worker } = require('bullmq');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { redisOptions } = require('../config/redis');

const prisma = new PrismaClient();

const worker = new Worker('assignment-deletion', async job => {
    const { assignmentId, labId } = job.data;
    await prisma.$transaction(async tx => {
        //DELETE ALL SUBMISSIONS
        await tx.submission.deleteMany({ where: { assignmentId } });

        //DELETE LAB AND ALL SESSIONS
        if (labId) {
            try {
                await axios.delete(`${process.env.LAB_CREATOR_API_URL}/session/delete-session/${labId}`);
                await axios.delete(`${process.env.LAB_CREATOR_API_URL}/lab/delete-lab/${labId}`);
            } catch (err) {
                throw new Error(`Lab cleanup failed for labId ${labId}: ${err.message}`);
            }
        }

        //FINALLY DELETE ASSIGNMENT
        await tx.assignment.delete({ where: { id: assignmentId } });
    });

},{connection:redisOptions});

worker.on('completed', job => console.log('Assignment deletion completed', job.id));
worker.on('failed', (job, err) => console.error('Assignment deletion failed', job?.id, err));