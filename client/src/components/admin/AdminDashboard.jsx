import axios from 'axios';
import { useEffect, useState } from 'react';
import CreateAssignmentForm from './CreateAssignment';
import EditAssignmentForm from './EditAssignment';
import Navbar from '../shared/Navbar';
import AssignmentDetails from './AssignmentDetails';
import AssignmentMenu from './AssignmentMenu';

const AdminDashboard = ({ user, onLogout }) => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [editedScores, setEditedScores] = useState({});
    const [hasChanges, setHasChanges] = useState(false);


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/assignments`).then(res => setAssignments(res.data));
        axios.get(`${process.env.REACT_APP_API_URL}/submissions`).then(res => setSubmissions(res.data));
        axios.get(`${process.env.REACT_APP_API_URL}/sections`).then(res => setSections(res.data));
    }, []);

    useEffect(() => {
        console.log(submissions);
    }, [submissions]);

    const filteredSubs = submissions.filter(
        sub => {
            if (!selectedAssignmentId) return false;
            if (!selectedSection) {
                return sub.assignmentId === Number(selectedAssignmentId);
            } else {
                return sub.assignmentId === Number(selectedAssignmentId) && sub.user?.sectionId === Number(selectedSection);
            }
        }
    );

    const selectedAssignmentObj = assignments.find(
        ass => ass.id === Number(selectedAssignmentId)
    );

    return (
        <div>
            <Navbar user={user}
                onSelect={(selection) => { console.log('button clicked', selection) }}
                onLogout={onLogout}
            />
            <h2> Welcome ADMIN, {user.name}</h2>
            {/* <LogoutButton onLogout={onLogout}/> */}

            {/* SELECT ASSIGNMENT AND SUBMISSIONS SECTION - MOVED TO TOP */}
            <AssignmentMenu
                selectedAssignmentId={selectedAssignmentId}
                setSelectedAssignmentId={setSelectedAssignmentId}
                setSelectedSection={setSelectedSection}
                assignments={assignments}
                sections={sections}
            />


                {/* JUPITER EXPORT BUTTON */}
                <button
                disabled={!selectedAssignmentId || filteredSubs.length === 0 || !selectedSection}
                onClick={async () => {
                    window.location.href = `${process.env.REACT_APP_API_URL}/admin/exportAssignment?assignmentId=${selectedAssignmentId}${selectedSection ? `&sectionId=${selectedSection}` : ''}`;
                }}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px'
                }}
            >
                JUPITER EXPORT
            </button>

            {/* DISPLAY SELECTED ASSIGNMENT (DUE DATE, TITLE, TYPE ) */}
            {selectedAssignmentObj && (<AssignmentDetails selectedAssignmentObj={selectedAssignmentObj} />)}


            {/* SUBMISSION LIST */}
            <div style={{
                maxWidth: '600px',
                margin: '20px auto',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9'
            }}>
                <h3 style={{ textAlign: 'center', marginTop: 0 }}>
                    Submissions for Assignment: {selectedAssignmentObj ? selectedAssignmentObj.title : ''}
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Section ID/Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px' }}>User ID</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px' }}>User Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px' }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubs.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ color: 'red', textAlign: 'center', padding: '8px' }}>
                                    No Submissions
                                </td>
                            </tr>
                        ) : (
                            filteredSubs.map(sub => (
                                <tr key={sub.id}>
                                    <td style={{ border: '1px solid #ccc', padding: '4px' }}>{sub.user.sectionId} {sub.user?.section?.name || ''}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '4px' }}>{sub.userId}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '4px' }}>{sub.user?.name ? sub.user.name : 'no user'}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '4px' }}>
                                        <input
                                            type="number"
                                            value={editedScores[sub.id] !== undefined ? editedScores[sub.id] : sub.score}
                                            onChange={(e) => {
                                                setEditedScores(prev => ({
                                                    ...prev,
                                                    [sub.id]: Number(e.target.value)
                                                }));
                                                setHasChanges(true);
                                            }}
                                            style={{
                                                width: '60px',
                                                padding: '2px',
                                                border: '1px solid #ccc',
                                                borderRadius: '3px'
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {/* UPDATE BUTTON */}
                {hasChanges && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '10px'
                    }}>
                        <button
                            onClick={async () => {
                                try {
                                    //create a promise for each submission that is in the edited list
                                    await Promise.all(
                                        Object.entries(editedScores).map(([submissionId, score]) =>
                                            axios.post(`${process.env.REACT_APP_API_URL}/submissions/update-grade`, {
                                                submissionId: Number(submissionId),
                                                score: Number(score)
                                            })
                                        )
                                    );
                                    setHasChanges(false); //no more changes
                                    //update local state map the previous submissions to the editedScores 
                                    setSubmissions(prev => {
                                        return prev.map(submission => ({
                                            ...submission,
                                            score: editedScores[submission.id] ?? submission.score //nullish returns right side if left is null
                                        }))
                                    })
                                } catch (error) {
                                    console.error('Failed to update grades:', error);
                                }
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        >
                            Update Grades
                        </button>
                    </div>
                )}

            </div>


            <EditAssignmentForm assignment={selectedAssignmentObj} updateAssignments={
                updatedAssignment => { //function passed in child component
                    setAssignments(
                        oldAssignments =>
                            oldAssignments.map(
                                assignment => assignment.id === updatedAssignment.id ? updatedAssignment : assignment
                            )
                    )
                }
            } />

            {/* CREATE AND EDIT ASSIGNMENT FORMS - MOVED TO BOTTOM */}
            <CreateAssignmentForm updateAssignments={
                childData => setAssignments(oldAssignments => [...oldAssignments, childData])
            } />



            <h3>Assignments</h3>
        </div>
    );
}

export default AdminDashboard;