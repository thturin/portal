const {  parseISO } = require('date-fns');
const { cloneRepo } = require('../services/gitService');
const { gradeJavaSubmission } = require('../services/gradingService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();


const verifyGithubOwnership = async (req, res) => {
    let assignmentPrefix;
    try {
        const { url, githubUsername } = req.body;

        if (!url) {
            return res.status(400).json({
                error: 'GitHub URL is required'
            });
        }

        if (!githubUsername) {
            return res.status(400).json({
                success: false,
                output: '❌ No GitHub account linked. Please link your GitHub account first.'
            });
        } // Extract username from GitHub URL

        //https://github.com/APCSA-Turin/u1p1-calculator-thturin
        const repoNameMatch = url.match(/github\.com\/APCSA-Turin\/([^\/]+)/);
        if (!repoNameMatch) {
            return res.status(400).json({
                success: false,
                output: "'❌ You do not belong to the github classroom APCSA-Turin'"
            });
        }

        const repoName = repoNameMatch[1]; // e.g., 'u1p1-calculator-thturin'
        //https://github.com/APCSA-Turin/u1t6-programming-challenge-calculator-thturin.git
        // console.log(repoName);
        // // Extract GitHub username from repo name (after last '-')
        // const repoParts = repoName.split('-');
        //if username contains '-'... find prefix first u1p1-calculator
        const isOwner = repoName.toLowerCase().includes(githubUsername.toLowerCase());
        const assignmentPrefixMatch = repoName.match(/u\d+[pt]\d+/i); //case insensitive

        assignmentPrefix = assignmentPrefixMatch ? assignmentPrefixMatch[0] : '';

        return res.json({
            success: isOwner,
            output: isOwner ? `✅ You are the owner of this repository (${githubUsername})`
                : `❌ Repository does not belong to ${githubUsername}`
        });
    } catch (err) {
        console.error('Error verifying github username', err);
        res.status(500).json({
            error: 'POST/ verifyGithubOwnerShip (server) Failed to verify Github ownership'
        });
    }
};

const calculateLateScore = (submissionDate, dueDateString, score) => {
    //const submissionDate = parseISO(submissionDateString);
    const dueDate = parseISO(dueDateString);
    const diffTime = submissionDate - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && score !== 0) { //if submission is late and not a 0 
        //1 day late 
        if (diffDays === 1) {
            return score * .9;
        } else if (diffDays >= 2 && diffDays <= 3) {
            return score * .85
        } else if (diffDays >= 4 && diffDays <= 5) {
            return score * .8;
        } else if (diffDays > 5) {
            return score * .75;
        }
    } else { // negative difference, submission is on time/early
        //this will return on time 100% and submissions that are 0's 
        return score;
    }
};

const scoreGithubSubmission = async (url, path, assignmentTitle, submittedAt, dueDate) => { //clone student's repo pasted into submission portal
    //confirm that both the submission type and url verify that it is a googledoc
    console.log('-----Score Github Submission---------');
    try {
        ///DETEREMINE IF TITLE IN GITHUB URL MATCHES ASSIGNMENT NAME 
        //Example : U1T1-printlnVsPrint --> [U1T1]
        const assignmentPrefixMatch = assignmentTitle.match(/u\d+[pt]\d+/i);
        const assignmentTitlePrefix = assignmentPrefixMatch ? assignmentPrefixMatch[0] : '';
        if (assignmentPrefix === '') {
            return {
                score: 0,
                output: `❌ Assignment Prefix is empty `
            };
        }
        if (assignmentPrefix.toLowerCase() !== assignmentTitlePrefix.toLowerCase()) {
            return {
                score: 0,
                output: `❌ Repository name prefix ${assignmentTitlePrefix} does not match assignment prefix ${assignmentPrefix}`
            };
        }
        await cloneRepo(url, path); //returns a promise since cloneRepo is async function
    } catch (cloneError) {
        console.error("Error cloning repo:", cloneError);
        throw cloneError;
    }
    //returns the score and output 
    try {
        let results = await gradeJavaSubmission(path);
        let finalScore = calculateLateScore(submittedAt, dueDate, results.score);
        results = {
            ...results, //keep original results (output)
            score: finalScore
        }
        return results;
    } catch (err) {
        console.error("Error grading submission:", err);
        return {
            score: 0,
            output: `❌ Failed to grade submission: ${err.message}`
        };
    }
};

const upsertGithubSubmission = async (req, res) => {
    const { submissionId, url, assignmentId, userId, assignmentTitle, dueDate } = req.body;
    let result = { score: -1, output: 'null' };
    const submittedAt = new Date(); //create the submission date
    const path = `./uploads/${Date.now()}`; //where repo will be cloned to locally

    result = await scoreGithubSubmission(url, path, assignmentTitle, submittedAt, dueDate);

    try {
        const submission = await prisma.submission.upsert({
            where: {
                id: Number(submissionId) || -1 //undefined will throw an error but -1 will execute the create 
            },
            create: {
                language: 'java',
                score: result.score,
                url,
                assignmentId: Number(assignmentId),
                userId: Number(userId),
                submittedAt
            },
            update: {
                score: result.score,
                url,
                submittedAt
            }
        });

        res.json({
            ...submission,
            result
        }); // return the updated or new submission along with the result (message and score)

    } catch (err) {
        console.error('Error in upsertGithubSubmission: ', err);
        res.status(500).json({ error: 'Failed to save submission' });
    }
};

const scoreLabSubmission = async (submittedAt, dueDate, score) => { //clone student's repo pasted into submission portal
    //confirm that both the submission type and url verify that it is a googledoc
    console.log('-----Score Lab Submission---------');
    //returns the score and output 
    let finalScore = calculateLateScore(submittedAt, dueDate, score);
    return finalScore;
};

const upsertLabSubmission = async (req, res) => {
    const { submissionId, assignmentId, userId, dueDate } = req.body;
    let result = -1;
    const submittedAt = new Date(); //create the submission date

    result = await scoreLabSubmission(submittedAt, dueDate, score);

    try {
        const submission = await prisma.submission.upsert({
            where: {
                id: Number(submissionId) || -1 //undefined will throw an error but -1 will execute the create 
            },
            create: {
                score: result,
                assignmentId: Number(assignmentId),
                userId: Number(userId),
                submittedAt
            },
            update: {
                score: result,
                submittedAt
            }
        });
        res.json({
            ...submission,
            result
        }); // return the updated or new submission along with the result (message and score)

    } catch (err) {
        console.error('Error in upsertGithubSubmission: ', err);
        res.status(500).json({ error: 'Failed to save submission' });
    }

};

//admin manual override
const updateSubmissionGrade = async (req, res) => {
    try {
        const { submissionId, score } = req.body;
        const updatedSubmission = await prisma.submission.update({
            where: {
                id: Number(submissionId)
            },
            data: {
                score: Number(score)
            }
        });
        res.json(updatedSubmission);
    } catch (err) {
        console.error('Error updating submission grade: ', err);
        res.status(500).json({ error: 'Failed to update grade' });
    }
};

const getSubmission = async (req, res) => {
    const { id } = req.params;

    try {
        //find the submission by id
        const submission = await prisma.submission.findUnique({
            where: { id: Number(id) }
        });
        if (!submission) {
            return res.status(404)({ error: 'Submission not found' });
        }
        res.json(submission);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            include: {
                user: {
                    include: {
                        section: true, //include section
                    },
                },
                // ...other includes if needed
            },
        });
        res.json(submissions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch' })
    }
};


module.exports = {
    verifyGithubOwnership,
    getAllSubmissions,
    getSubmission,
    updateSubmissionGrade,
    upsertLabSubmission,
    upsertGithubSubmission
};




