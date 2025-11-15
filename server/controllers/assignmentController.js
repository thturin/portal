const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
require('dotenv').config();  // Add this to load .env variables


const createAssignment = async (req, res) => {
    try {
        //WHWEN ASSIGNMENT IS CREATED CRREATE A LAB TOO IF IT IS A LAB
        const { title, dueDate, submissions, type } = req.body;

        if (!title) return res.status(400).json({ error: 'Missing title field' });

        const data = {
            title,
            dueDate: dueDate ? new Date(dueDate) : null,
            type: type || null
        };
        if (submissions) {
            data.submissions = submissions
        }

        const assignment = await prisma.assignment.create({ data });
    // IF A LAB ASSIGNMENT WAS CREATED, CREATE AN EMPTY LAB AND SESSION
        if (type === 'lab') {
            //call lab-creator api
            try {
                const blocks = [];
                const lab = await axios.post(`${process.env.LAB_CREATOR_API_URL}/lab/upsert-lab`, {
                    title,
                    blocks,
                    assignmentId: assignment.id
                });

                await prisma.assignment.update({
                    where:{id:assignment.id},
                    data:{labId:lab.data.id}
                })
            } catch (err) {
                console.error('Error creating lab: ',err.message);
            }
        }
        return res.json(assignment);
    } catch (err) {
        console.error('Error creating assignment: ', err.message);
        return res.status(500).json({ error: 'Failed to create assignment.' });

    }
};

const getAllAssignments = async (req, res) => {
    try {
        const assignments = await prisma.assignment.findMany();
        return res.json(assignments);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Failed to fetch' });
    }
};

const getAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const assignment = await prisma.assignment.findUnique({
            where: { id: Number(id) }
        });
        return res.json(assignment);

    } catch (err) {
        console.log('Cannot /get assignment ', err);
        return res.status(400).json({ error: 'Failed to get assignment' });
    }
}

const updateAssignment = async (req, res) => {
    const { id } = req.params;
    const { title, dueDate, showExplanations } = req.body;
    try {
        const updatedAssignment = await prisma.assignment.update({
            where: { id: Number(id) },
            data: {
                title,
                dueDate: new Date(dueDate),
                showExplanations
            }
        });

        return res.json(updatedAssignment);
    } catch (err) {
        console.error('Update Assignment Error', err);
        return res.status(400).json({ error: 'Failed to update assignment' });
    }
};

const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    console.log(assignmentId);
    if (!assignmentId) return res.status(400).json({ error: 'missing assignment Id' });
    try {
        //execute multiple prisma requests sequentially
        let assignment;
        await prisma.$transaction(async (tx) => {
        //fFIND THE ASSIGNMENT
            assignment = await tx.assignment.findUnique({
                where: { id: Number(assignmentId) }
            });
            console.log(assignment);
            if (!assignment) throw new Error('Assignment not found');

        //DELETE SUBMISSIONS LINKED TO ASSIGNMENT
            await tx.submission.deleteMany({
                where:{assignmentId:Number(assignment.id)}
            });

        //IF LAB ID EXISTS, DELETE SESSION AND LAB
            //call the lab-creator api 
            if (assignment.labId) {
                console.log('lab id exists');
                try {
                    console.log(`${process.env.LAB_CREATOR_API_URL}/session/delete-session/${assignment.labId}`);
                    await axios.delete(`${process.env.LAB_CREATOR_API_URL}/session/delete-session/${assignment.labId}`)
                    console.log('Sessions deleted for labId:', assignment.labId);

                    await axios.delete(`${process.env.LAB_CREATOR_API_URL}/lab/delete-lab/${assignment.labId}`);
                    console.log('Lab deleted for labId:', assignment.labId);

                    // console.log(`localhost/submissions/delete-submissions/${assignment.id}`);
                    // await axios.delete(`${process.env.SERVER_URL}/submissions/delete-submissions/${assignment.id}`);
                    // console.log('Submissions deleted for assignmentId',assignment.id);

                } catch (err) {
                    console.error('Failed to delete associated data via API:', err.message);
                    throw new Error('Failed to delete associated lab and sessions');
                }

            }

            await tx.assignment.delete({
                where: { id: Number(assignmentId) }
            });
        });
        //return the assignment back to be deleted
        return res.json(assignment);
    } catch (err) {
        console.console.error('deleteAssignment Error', err);
        return res.status(500).json({ error: 'Failed to update assignment' });
    }
}


module.exports = { deleteAssignment, createAssignment, getAllAssignments, updateAssignment, getAssignment };