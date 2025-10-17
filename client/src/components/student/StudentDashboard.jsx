import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import UserSubmitAssignment from './StudentSubmitAssignment.jsx';
import LatePolicyInfo from './LatePolicyInfo.jsx';
import Navbar from '../shared/Navbar.jsx';

const UserDashboard = ({ user, onLogout }) => {
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

            {/* ✨ Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                color: 'white',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '32px',
                            fontWeight: '700',
                            marginBottom: '8px'
                        }}>
                            Welcome back, {user.name}! 👋
                        </h1>
                        <p style={{
                            margin: 0,
                            fontSize: '16px',
                            opacity: 0.8
                        }}>
                            Ready to submit and work on your assignments?
                        </p>
                    </div>
                </div>
            </div>

            {/* ✨ Main Content Layout */}
            <div style={{
                display: 'flex',
                flexGrow: 1,
                gap: '32px',
                alignItems: 'stretch',
                minHeight: '60vh',
                width: '100%',
            }}>

                {selection === 'submit' && user &&
                    <UserSubmitAssignment
                        user={user}
                        submissions={submissions}
                        setSubmissions={setSubmissions}
                        assignments={assignments}
                    />
                }

                {selection === ''}

                {selection === 'late' && user && <LatePolicyInfo />}
            </div>
        </div>
    );
};

export default UserDashboard;