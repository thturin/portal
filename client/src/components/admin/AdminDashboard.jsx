import axios from 'axios';
import { useEffect, useState } from 'react';
import CreateAssignmentForm from './CreateAssignment';
import EditAssignmentForm from './EditAssignment';
import Navbar from '../shared/Navbar';
import AssignmentDetails from './AssignmentDetails';
import AssignmentMenu from './AssignmentMenu';
import SubmissionList from './SubmissionList';

const AdminDashboard = ({ user, onLogout }) => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [editedScores, setEditedScores] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [currentTab, setCurrentTab] = useState('');


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

    const handleTabSelect = (tab) => {
        console.log(`current tab is ${currentTab}`);
        setCurrentTab(tab);
    }

    return (
        <div>
            <Navbar user={user}
                onSelect={handleTabSelect}
                onLogout={onLogout}
            />
            <h2> Welcome ADMIN, {user.name}</h2>

            {currentTab === 'view' && (
                <>
                    {/* SELECT ASSIGNMENT AND SUBMISSIONS SECTION - MOVED TO TOP */}
                    <AssignmentMenu
                        setSelectedAssignmentId={setSelectedAssignmentId}
                        selectedAssignmentId={selectedAssignmentId}
                        assignments={assignments}
                        selectedSection={selectedSection}
                        setSelectedSection={setSelectedSection}
                        sections={sections}
                        filteredSubsLength={filteredSubs.length}
                    />

                    {/* DISPLAY SELECTED ASSIGNMENT (DUE DATE, TITLE, TYPE ) */}
                    {selectedAssignmentObj && (<AssignmentDetails selectedAssignmentObj={selectedAssignmentObj} />)}

                    <SubmissionList
                        filteredSubs={filteredSubs}
                        selectedAssignmentObj={selectedAssignmentObj}
                        editedScores={editedScores}
                        setEditedScores={setEditedScores}
                        setHasChanges={setHasChanges}
                        hasChanges={hasChanges}
                        setSubmissions={setSubmissions}
                    />
                    <EditAssignmentForm
                        assignment={selectedAssignmentObj}
                        updateAssignments={
                            updatedAssignment => { //function passed in child component
                                setAssignments(
                                    oldAssignments =>
                                        oldAssignments.map(
                                            assignment => assignment.id === updatedAssignment.id ? updatedAssignment : assignment
                                        )
                                )
                            }
                        }
                    />
                </>
            )}

            {currentTab === 'create' && (
                <CreateAssignmentForm updateAssignments={
                    childData => setAssignments(oldAssignments => [...oldAssignments, childData])
                } />
            )}
        </div>
    );
}

export default AdminDashboard;