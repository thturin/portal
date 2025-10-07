// exports.handleSubmission = (req,res) => {
//     res.status(200).json({message:'Submission received successfully'});
// }
const { format, formatDistanceToNow, parseISO } = require('date-fns');
const{cloneRepo} = require('../services/gitService');
const{gradeJavaSubmission} = require('../services/gradingService');
const{authenticateGoogle, isUserOwnerOfDoc} = require('../services/googleService');
//const{gradeSubmission} = require('../services/gradingService');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
require('dotenv').config();

let assignmentPrefix;

const verifyGithubOwnership = async (req, res)=>{
    try{

        const {url,githubUsername} = req.body;
        //DEACTIVATED
        //const githubUsername = req.user?.githubUsername
        
             if(!url){
            return res.status(400).json({
                error: 'GitHub URL is required'
            });
        }

        if(!githubUsername){
            return res.status(400).json({
                success: false,
                output: '❌ No GitHub account linked. Please link your GitHub account first.'
            });
        } // Extract username from GitHub URL

        //https://github.com/APCSA-Turin/u1p1-calculator-thturin
        const repoNameMatch = url.match(/github\.com\/APCSA-Turin\/([^\/]+)/);
        if(!repoNameMatch){
            return res.status(400).json({
                success:false,
                output:"'❌ You do not belong to the github classroom APCSA-Turin'"
            });
        }
        
        const repoName = repoNameMatch[1]; // e.g., 'u1p1-calculator-thturin'
        //https://github.com/APCSA-Turin/u1t6-programming-challenge-calculator-thturin.git
        // console.log(repoName);
        // // Extract GitHub username from repo name (after last '-')
        // const repoParts = repoName.split('-');
        //if username contains '-'... find prefix first u1p1-calculator
        const isOwner = repoName.includes(githubUsername);
        const assignmentPrefixMatch = repoName.match(/u\d+[pt]\d+/i); //case insensitive
        console.log(assignmentPrefixMatch);
        assignmentPrefix = assignmentPrefixMatch ? assignmentPrefixMatch[0] : '';
        // const titleAfterPrefix = repoName.substring(assignmentPrefix.length+1); //calculator-thturin.git
        // let urlUsername = titleAfterPrefix.split('-'); //[calculator,thturin.git]
        // urlUsername.shift(); //remove first item (calculator)
        // urlUsername = urlUsername.join('-');
        // urlUsername = urlUsername.includes('.git') ? urlUsername.substring(0,urlUsername.length-4) : urlUsername;
        // console.log(urlUsername);
        // const isOwner = githubUsername.toLowerCase() === urlUsername.toLowerCase();
        return res.json({
            success:isOwner,
            output:  isOwner ? `✅ You are the owner of this repository (${githubUsername})`
        : `❌ Repository does not belong to ${githubUsername}`
        });
   
    }catch(err){
        console.error('Error verifying github username',err);
        res.status(500).json({
            error:'Failed to verify Github ownership'
        });
    }
};

//1. VERIFY APP PERMISSION TO ACCESS GOOGLE DRIVE AND DOCS
//2. VERIFY STUDENT USER IS OWNER OF DOC
const verifyDocOwnership = async (req,res)=>{
    const {documentId, userEmail} = req.body;
    // first must verify YOUR service account so gives your app permission
    // to read google drive/docs 
    const auth = await authenticateGoogle(); //should return an authenticasted Oauth2 email user

    try{
        const isOwner = await isUserOwnerOfDoc(documentId,userEmail,auth);
        res.json({
            success: isOwner,
            output: isOwner ? 'You are the owner of this document' : '❌ You are not the owner of this document'
        });    
}catch(err){
        console.error('Error verifying document ownership', err)
    }
};

// | Days Late     | Penalty             |
// | ------------- | ------------------- |
// | 0 (on time)   | No penalty          |
// | 1 day late    | -10%                |
// | 2–3 days late | -15%                |
// | 4–5 days late | -20%                |
// | 6+ days late  | -25% max (hard cap) |
// | 14+ days late | Please see me       |

const calculateLateScore = (submissionDate, dueDateString, score)=>{
    //const submissionDate = parseISO(submissionDateString);
    const dueDate = parseISO(dueDateString);
    const diffTime = submissionDate-dueDate;
    const diffDays = Math.ceil(diffTime/(1000*60*60*24)); 
    if (diffDays > 0 && score!==0){ //if submission is late and not a 0 
        //1 day late 
        if(diffDays===1){
            return score * .9;
        }else if(diffDays>=2 && diffDays<=3){
            return score * .85
        }else if(diffDays>=4 && diffDays<=5){
            return score * .8;
        }else if(diffDays>5){
            return score * .75;
        }
    }else{ // negative difference, submission is on time/early
        //this will return on time 100% and submissions that are 0's 
        return score;
    } 
};

const scoreSubmission = async (url, path, assignmentTitle, submissionType,submittedAt,dueDate)=>{ //clone student's repo pasted into submission portal
        //confirm that both the submission type and url verify that it is a googledoc
        console.log('-----Score Submission---------');
        try{
                        //GOOGLE DOC SUBMISSION
            //confirm the link is a google doc
            if(url.includes('docs.google.com') && submissionType === 'googledoc'){
              
                const docIdMatch = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/); //extract the docId
                if (!docIdMatch) {
                    throw new Error('Invalid Google Docs URL format');
                }
                const documentId = docIdMatch[1];
                console.log('Checking Google Doc with ID:', documentId);

                //CALL PYTHON ROUTE /CHECK-DOC-TITLE 
                try{
                    console.log(`LOOK HERE--->${process.env.SERVER_URL}/python/check-doc-title?documentId=${documentId}&assignmentName=${encodeURIComponent(assignmentTitle)}`);
                    const titleResponse = await axios.get(`${process.env.SERVER_URL}/python/check-doc-title?documentId=${documentId}&assignmentName=${encodeURIComponent(assignmentTitle)}`);
                    const {isCorrectDoc, docTitle} = titleResponse.data;
                    if(!isCorrectDoc){
                        return {
                            score: 0,
                            output: `❌ Document title "${docTitle}" does not match current assignment "${assignmentTitle.substring(0,4)}"`
                        }
                    }
                }catch(err){
                    console.error('Error calling /check-doc-title', err.message);
                    return{
                        score:0,
                        output:`❌ Error checking document title: ${err.message}`
                    }
                }

                let response;
                
                try{
                    //IF CORRECT, CALL PYTHON ROUTES /CHECK-DOC
                    response = await axios.post(`${process.env.SERVER_URL}/python/check-doc`,{
                    documentId:documentId
                });
                }catch(err){
                    console.error('Error calling /check-doc');
                    return {
                        score:0,
                        output: `❌ Error checking document content: ${err.message}`
                    }
                }
                //RECEIVE FROM REQUEST PYTHON ROUTE REQUEST
                const{filled, foundPlaceholders} = response.data;
                let score = 0;
                const output = filled ? 'Document completed successfully! ✅':
                                        `Document incomplete.❌`;
                if(filled){
                    score = 100; //automatic 100
                    score=calculateLateScore(submittedAt, dueDate,score);
                }
                console.log('score googledoc',score);
                return {
                    score: score,
                    output: output
                };
                
                

            //GITHUB SUBMISSION
            }else if(url.includes('github.com') && submissionType === 'github'){
                try{
                    ///DETEREMINE IF TITLE IN GITHUB URL MATCHES ASSIGNMENT NAME 
                    //Example : U1T1-printlnVsPrint --> [U1T1]
                    const assignmentPrefixMatch = assignmentTitle.match(/u\d+[pt]\d+/i);
                    const assignmentTitlePrefix = assignmentPrefixMatch ? assignmentPrefixMatch[0] : '';
                    if(assignmentPrefix ===''){
                        return {
                            score:0,
                            output: `❌ Assignment Prefix is empty `
                        }; 
                    } 
                    if(assignmentPrefix.toLowerCase()!==assignmentTitlePrefix.toLowerCase()){
                        return {
                            score:0,
                            output: `❌ Repository name prefix ${assignmentTitlePrefix} does not match assignment prefix ${assignmentPrefix}`
                        };
                    }
                    await cloneRepo(url,path); //returns a promise since cloneRepo is async function
                }catch(cloneError){
                    console.error("Error cloning repo:",cloneError);
                    throw cloneError;
                }
                //returns the score and output 
                try{
                    let results = await gradeJavaSubmission(path);
                    console.log('look here->>>', submittedAt);
                    let finalScore=calculateLateScore(submittedAt, dueDate,results.score);
                    results = {
                        ...results, //keep original results (output)
                        score:finalScore
                    }
                    return results;
                }catch(err){
                    console.error("Error grading submission:", err);
                    return {
                        score: 0,
                        output: `❌ Failed to grade submission: ${err.message}`
                    };
                }
            }else{
                //wasn't github or googledoc
                return {
                    score:0,
                    output:`❌ Invalid submission type or URL format`
                };
            }    
        }catch(err){
            console.error('Unexpected error in scoreSubmission:', error);
            return {
                score: 0,
                output: `❌ System error: ${error.message}`
            };
        }

};

const createSubmission = async (req,res)=>{
    try{
        let result = {score:-100, output:''};
       //console.log(`Request from handleSubmission -> ${req.body}`);
        let {url, assignmentId,userId, assignmentTitle, submissionType, dueDate} = req.body;
        const path = `./uploads/${Date.now()}`; //where repo will be cloned to locally

        const submittedAt = new Date(); //create the submission date

  
        result = await scoreSubmission(url,path,assignmentTitle, submissionType, submittedAt, dueDate);
    

        let language = submissionType === 'github'? 'java' : 'none';

        const newSub = await prisma.submission.create({
            data: {
                url,
                language,
                score: result.score,
                assignmentId,
                userId,
                submittedAt:new Date()
            }
        
        });
        //return both the submission data AND output
        res.json({
            ...newSub,
            output:result.output // add output to response
        });
        //this res.json() will return something like this 
        //   assignmentI:8
        //   languageL"java"
        //   score:50,
        //   output:.././

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to create submission' });
    }
};

const updateSubmission = async(req,res)=>{
    try{
        const {id} = req.params; //ID pulled from the parameters 
        const {url, assignmentId, userId, submissionType, assignmentTitle, dueDate} = req.body
        //console.log('Look here', id, req.body);
        const path = `./uploads/${Date.now()}`; //where repo will be cloned to locally
        let result = {score:-100, output:''};
        const submissionDate = new Date();

        try{
            result = await scoreSubmission(url,path,assignmentTitle, submissionType, submissionDate, dueDate);
        }catch(err){
            result = {
                score: 0,
                output: `❌ Scoring failed: ${err.message}`
            }
        }
        const updated = await prisma.submission.update({
            where: {id:Number(id)},
            data: {url, assignmentId, userId, score: result.score, submittedAt: new Date()}
        });

        res.json({
            ...updated, //using ... so the object isn't returned but all of the contents within the object is returned 
            output:result.output //add output to response
        });
        
        
    }catch(err){
        console.error('PUT /submission error',err);
        res.status(400).json({error: 'Failed to update submission'});
    }
    
};


const getSubmission = async(req,res)=>{
    const {id} = req.params;

    try{
        //find the submission by id
        const submission = await prisma.submission.findUnique({
            where:{ id:Number(id)}
        });
        if(!submission){
            return res.status(404)({error:'Submission not found'});
        }
        res.json(submission);
    }catch(err){
        res.status(500).json({error: 'Server error'});
    }
};


const getAllSubmissions = async (req,res)=>{
    try{
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
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Failed to fetch'})
    }
};


module.exports = {
    verifyGithubOwnership,
    getAllSubmissions,
    verifyDocOwnership,
    createSubmission,
    getSubmission,
    updateSubmission
};





// const createSubmission = (req,res)=>{
//     const {name,assignment, score} = req.body;

//     const newSub = {
//         id:submissions.length+1,
//         name,
//         assignment,
//         score
//     };

//     //submissions.push(newSub);
//     res.status(201).json(newSub);
// };