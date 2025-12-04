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
            if (!process.env.LAB_CREATOR_API_URL) {
                throw new Error('LAB_CREATOR_API_URL is not configured');
            }
            let labCreatorBase;
            try {
                labCreatorBase = new URL(process.env.LAB_CREATOR_API_URL).toString().replace(/\/$/, '');
            } catch (err) {
                throw new Error(`Invalid LAB_CREATOR_API_URL (${process.env.LAB_CREATOR_API_URL}): ${err.message}`);
            }
            try {
                await axios.delete(`${labCreatorBase}/session/delete-session/${labId}`);
                await axios.delete(`${labCreatorBase}/lab/delete-lab/${labId}`);
            } catch (err) {
                if (err.response?.status === 404) {
                    console.warn(`Lab ${labId} already removed in lab-creator`);
                } else {
                    throw new Error(`Lab cleanup failed for labId ${labId}: ${err.message}`);
                }
            }
        }

        //FINALLY DELETE ASSIGNMENT
        await tx.assignment.delete({ where: { id: assignmentId } });
    });

},{connection:redisOptions});

worker.on('completed', job => console.log('Assignment deletion completed', job.id));
worker.on('failed', (job, err) => console.error('Assignment deletion failed', job?.id, err));