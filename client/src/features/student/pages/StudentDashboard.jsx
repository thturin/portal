import axios from 'axios';
import { useEffect, useState } from 'react';
import StudentSubmitGithub from '../components/StudentSubmitGithub.jsx';
import StudentSubmissionList from '../components/StudentSubmissionList.jsx';
import LatePolicyInfo from '../components/LatePolicyInfo.jsx';
import Navbar from '../../../shared/Navbar.jsx';

const StudentDashboard = ({ user, onLogout }) => {
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selection, setSelection] = useState(); //work, submit, late or create, a, create l , test

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_HOST}/submissions`).then(res => {
            const userSubs = res.data.filter(sub => sub.userId === user.id);
            setSubmissions(userSubs);
        });

        axios.get(`${process.env.REACT_APP_API_HOST}/assignments`).then(res => {
            setAssignments(res.data);
        });
    }, [user.id]);

    const updateSubmissions = (childData) => {
        setSubmissions(prev =>
            [
                ...prev.filter(sub => String(sub.assignmentId) !== String(childData.assignmentId)),
                childData
            ]
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            height: '100vh',
            backgroundColor: '#f8fafc',
            padding: '24px'
        }}>
            {/* ✨ Navbar at the top */}
            <Navbar user={user} onSelect={setSelection} onLogout={onLogout} />

            {/* ✨ Main Content Layout */}
            <div style={{
                display: 'flex',
                flexGrow: 1,
                gap: '32px',
                alignItems: 'stretch',
                minHeight: '60vh',
                width: '100%',
            }}>

                {selection === 'github' && user && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',    // center horizontally
                        alignItems: 'flex-start',
                        width: '100%',
                        padding: '16px 0'
                    }}>
                        <div style={{ width: '100%', maxWidth: 900 }}>
                            <StudentSubmitGithub
                                user={user}
                                onNewSubmission={updateSubmissions}
                                submissions={submissions}
                            />
                        </div>
                    </div>
                )}

                {selection === 'lab' }

                {selection === 'view' && user && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',    // center horizontally
                        alignItems: 'flex-start',
                        width: '100%',
                        padding: '16px 0'
                    }}>
                        <div style={{ width: '100%', maxWidth: 900 }}>
                            <StudentSubmissionList
                                submissions={submissions}
                                assignments={assignments}
                            />
                        </div>
                    </div>
                )}

                {selection === 'late' && user && <LatePolicyInfo />}
            </div>
        </div>
    );
};

export default StudentDashboard;