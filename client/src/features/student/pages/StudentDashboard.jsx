import axios from 'axios';
import { useEffect, useState } from 'react';
import StudentSubmitGithub from '../components/StudentSubmitGithub.jsx';
import StudentSubmissionList from '../components/StudentSubmissionList.jsx';
import LatePolicyInfo from '../components/LatePolicyInfo.jsx';
import Navbar from '../../../shared/Navbar.jsx';
import LabPreview from '../../lab/components/LabPreview.jsx';
import StudentAssignmentMenu from '../components/StudentAssignmentMenu.jsx';

const StudentDashboard = ({ user, onLogout }) => {
    //for lab preview
    const [blocks, setBlocks] = useState([]);
    const [title, setTitle] = useState('');

    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [assignmentTitle,setAssignmentTitle] = useState('');
    const [selection, setSelection] = useState(); //work, submit, late or create, a, create l , test
    const [selectedAssignmentId, setSelectedAssignmentId] = useState();
    const [assignmentType, setAssignmentType] = useState('');

    //GET ALL ASSIGNMENTS AND SUBMISSIONS
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_HOST}/submissions`).then(res => {
            const userSubs = res.data.filter(sub => sub.userId === user.id);
            setSubmissions(userSubs);
        });

        axios.get(`${process.env.REACT_APP_API_HOST}/assignments`).then(res => {
            setAssignments(res.data);
        });
    }, [user.id]);

    // useEffect(()=>{
    //     if(selectedAssignmentObj) setAssignmentTitle(selectedAssignmentObj.title);
    // },[selectedAssignmentId]);

    //FIND SELECTED ASSIGNMENT OBJECT 
    const selectedAssignmentObj = assignments.find(a => a.id === Number(selectedAssignmentId));

    //UPDATE SUBMISSIONS
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
            <Navbar 
                user={user} 
                onSelect={setSelection} 
                onLogout={onLogout} 
                assignmentTitle={selectedAssignmentObj?.title}  
                assignmentType={selectedAssignmentObj?.type ?? ''}
            />

            {/* ✨ Main Content Layout */}
            <div style={{
                display: 'flex',
                flexGrow: 1,
                gap: '32px',
                alignItems: 'stretch',
                minHeight: '60vh',
                width: '100%',
                marginTop: '24px', // added space between navbar and content
            }}>

                {selection === 'github' && user && (
                        <div style={{ width: '100%', maxWidth: 900 }}>
                            <StudentSubmitGithub
                                username={user.username}
                                userId={user.userId}
                                onNewSubmission={updateSubmissions}
                                submissions={submissions}
                            />
                        </div>

                )}

                {selection === 'lab' && user && (
                    //  blocks, setBlocks, title, setTitle, id, setId, mode = 'student', userId, username 
                    <LabPreview
                        blocks={blocks}
                        setBlocks={setBlocks}
                        title={title}
                        setTitle={setTitle}
                        assignmentId={selectedAssignmentId}
                        userId={user.userId}
                        username={user.username}

                    />
                )}

                {selection === 'view' && user && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',    // center horizontally
                        alignItems: 'flex-start',
                        width: '100%',
                        padding: '16px 0'
                    }}>
                        <div style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <StudentAssignmentMenu
                                setSelectedAssignmentId={setSelectedAssignmentId}
                                selectedAssignmentId={selectedAssignmentId}
                                assignments={assignments}
                                setAssignmentType={setAssignmentType}
                            />

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