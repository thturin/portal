import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDate, isPastDue } from '../../utils/dateUtils';
import Spinner from '../shared/Spinner';

const apiUrl = process.env.REACT_APP_API_URL;
//set global axios defaults

//MAKE SURE AXIOS IS SEENDING SESSION COOKIES TO BACKEND
axios.defaults.withCredentials = true;

const StudentSubmitGithub = ({ onNewSubmission, user, submissions }) => {

    const [url, setUrl] = useState('');
    const [assignmentId, setAssignmentId] = useState(''); //the current assignment
    const [assignment, setAssignment] = useState(null);
    const [assignments, setAssignments] = useState([]); //assignment list 
    const [score, setScore] = useState(null);
    const [error, setError] = useState('');
    const [submissionExists, setSubmissionExists] = useState(false);
    const [gradleOutput, setGradleOutput] = useState(''); //gradle test output
    const [verificationFeedback, setVerificationFeedback] = useState(''); //show googledoc feedback
    const [isSubmitting, setIsSubmitting] = useState(false);


    //FETCH ASSIGNMENTES
    useEffect(() => { //useEffect() code to run after the component renders
        //useEffect let your perform actions (side effects) in your componenet, such as fetching api data
        async function fetchAssignments() {
            console.log('-------FETCHING ASSIGNMENTS----------');
            try {
                const res = await axios.get(`${apiUrl}/assignments`);
                setAssignments(res.data);
            } catch (err) {
                setError('Failed to load assignments');
            }
        }
        fetchAssignments();
    }, []); //happens on the mount [] are the dependencies which means the function will run only when those dependencies change

    const verifyGithubOwnership = async (url, githubUsername){
        const res = await axios.post(`${apiUrl}/verify-github-ownership`, {
            url: url,
            githubUsername: user.githubUsername
        });
        return res.data
    };

    const updateSubmission = async (existingSubmission, data) => {
        const res = await axios.put(`${apiUrl}/submissions/${existingSubmission.id}`, data);
        return res.data;
    }

    const createSubmission = async (data) => {
        const res = await axios.post(`${apiUrl}/submit`, data);
        return res.data;
    }



    const handleSubmit = async (e) => {
        setSubmissionExists(false);
        e.preventDefault();
        setScore(null);
        setError('');
        setGradleOutput('');
        setVerificationFeedback('');
        setIsSubmitting(true);

        try {
            //VERIFY USER OWNERSHIP FOR GITHUB 
            try {
                const verifyRes = await verifyGithubOwnership(url, user.githubUsername);
                setVerificationFeedback(verifyRes.data.output);
                if (!verifyRes.data.success) return; //if promise is successfull but verification failed, return
            } catch (err) {
                setError('Failed to verify github user')
                return;
            }

            //CHECK FOR EXISTING SUBMISSION
            const existingSubmission = submissions.find(
                sub => String(sub.assignmentId) === String(assignmentId)
            );
            const data = {
                url,
                assignmentId,
                userId: user.id,
                submissionType: 'github',
                assignmentTitle: assignment.title,
                dueDate: existingSubmission ? assignment.dueDate : new Date(assignment.dueDate).toISOString()
            };
            //---------UPDATE SUBMISSION------------
            let result;
            if (existingSubmission) { //go to the ssubmission and update it
                setSubmissionExists(true);
                result = await updateSubmission(existingSubmission, data);
            } else {
                //-=-----CREATE NEW SUBMISSION-------
                result = await createSubmission(data);
            }
            setScore(res.data.score);
            setGradleOutput(res.data.output);
            //if property was passed in by component call in parent component, send the res.data as the value of pproperty
            if (onNewSubmission) onNewSubmission(res.data);
        } catch (err) {
            console.error(err);
            //if err.response exists -> if error.response.data exists, check the .error message
            setError(err.response?.data?.error || 'Submission Failed');
            setGradleOutput(err.response?.data?.output || '');
        } finally {
            setIsSubmitting(false); //for spinner 
        }
    };

    ///PLACEHOLDER FOR URL LINK 
    let placeholder = 'https://github.com/username/repo name';

    return (
        <div className="submit-form">
            <h3>Submit a Github Repository</h3>
            <form onSubmit={handleSubmit}>

                {/* ASSIGNMENT OPTION  */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Select Assignment:
                    </label>
                    <select
                        value={assignmentId}
                        //prevents the number casting to turn Number("") not 0 but empty
                        onChange={e => setAssignmentId(e.target.value === "" ? "" : Number(e.target.value))}
                        required
                        style={{
                            width: '250px', padding: '8px', marginRight: '10px'
                        }}
                    >
                        <option value=""> Select Assignment</option>
                        {assignments.map(ass => ( //print out each assignment that exists as option
                            <option
                                key={ass.id}
                                value={ass.id}
                                style={{ color: isPastDue(ass.dueDate) ? 'red' : 'black' }}
                            >
                                {ass.title} - Due Date: {formatDate(ass.dueDate, 1)} {formatDate(ass.dueDate, 2)}
                            </option>
                        ))}
                    </select>
                </div>

                {/*  LINK BOX */}
                <label>
                    GitHub Repository URL
                </label>

                <input
                    type="url"
                    placeholder={placeholder}
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value.trim());
                    }}
                    required style={{ width: '400px', padding: '8px' }}
                />

                {/* SUBMIT BUTTON */}
                <button type="submit"
                    style={{
                        marginLeft: '10px',
                        opacity: isSubmitting ? 0.6 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner /> Running Tests...
                        </>
                    ) : (
                        'Submit'
                    )}
                </button>

                <span style={{ color: 'green', marginLeft: '12px', verticalAlign: 'middle' }}>
                    {submissionExists ? "Resubmitted"
                        : (!error && "")
                    }
                </span>
            </form>

            {/* Loading indicator for gradle tests */}
            {isSubmitting && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#f0f8ff',
                    border: '1px solid #b0d4f1',
                    borderRadius: '4px',
                    textAlign: 'center'
                }}>
                    <Spinner />
                    <strong>Running Gradle Tests...</strong>
                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                        This may take 30-60 seconds. Please wait...
                    </div>
                </div>
            )}

            {/* SET VERIFICATION FEEDBACK */}
            {verificationFeedback && (
                <div style={{ marginTop: '15px', color: verificationFeedback.includes('not the owner') ? 'red' : 'green' }}>
                    {verificationFeedback}
                </div>
            )}
            {/*  OUTPUT SCORE AFTER SUBMISSION */}
            {score !== null && (
                <p style={{ marginTop: '20px' }}>✅ Submission graded! Score: <strong>{score}</strong></p>
            )}

            {/* SHOW GRADLE TEST OUTPUT */}
            {gradleOutput && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Test Output:</h4>
                    <pre style={{
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '15px',
                        whiteSpace: 'pre-wrap',
                        overflow: 'auto',
                        maxHeight: '400px',
                        fontSize: '12px',
                        fontFamily: 'Courier New, monospace'
                    }}>
                        {gradleOutput}
                    </pre>
                </div>
            )}

            {/* //if there was an error */}
            {error && (
                <p style={{ marginTop: '20px', color: 'red' }}>❌ {error}</p>
            )}
        </div>
    );
};

export default StudentSubmitGithub;