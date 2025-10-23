import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import StudentSubmitAssignment from './StudentSubmitAssignment.jsx';
import LatePolicyInfo from './LatePolicyInfo.jsx';
import Navbar from '../shared/Navbar.jsx';

const StudentDashboard = ({ user, onLogout }) => {
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selection, setSelection] = useState(); //work, submit, late or create, a, create l , test

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/submissions`).then(res => {
            const userSubs = res.data.filter(sub => sub.userId === user.id);
            setSubmissions(userSubs);
        });

        axios.get(`${process.env.REACT_APP_API_URL}/assignments`).then(res => {
            setAssignments(res.data);
        });
    }, [user.id]);



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

                {selection === 'github' && user &&
                    <StudentSubmitAssignment
                        user={user}
                        submissions={submissions}
                        setSubmissions={setSubmissions}
                        assignments={assignments}
                    />
                }

                {selection === 'lab' }

                {selection === 'late' && user && <LatePolicyInfo />}
            </div>
        </div>
    );
};

export default StudentDashboard;