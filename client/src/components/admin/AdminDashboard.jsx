import axios from 'axios';
import { useEffect, useState } from 'react';
import CreateAssignmentForm from './CreateAssignment';
import EditAssignment from './EditAssignment';
import Navbar from '../shared/Navbar';
import AssignmentMenu from './AssignmentMenu';
import SubmissionList from './SubmissionList';
import JupiterExportButton from './JupiterExportButton';
import SectionSelection from './SectionSelection';


const AdminDashboard = ({ user, onLogout }) => {
    //for lab-builder
    const [blocks, setBlocks] = useState([]);
    const [labTitle, setLabTitle] = useState('');

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

            {currentTab === 'review' && (
                <>
    {/* JUPITER EXPORT BUTTON */}
                    <JupiterExportButton
                        selectedAssignmentId={selectedAssignmentId}
                        filteredSubsLength={filteredSubs.length}
                        selectedSection={selectedSection}
                    />
    {/* DROP DOWN MENU FOR SECTION */}
                    <SectionSelection 
                        setSelectedSection={setSelectedSection}
                        selectedSection={selectedSection}
                        sections={sections}
                    />

                    <SubmissionList
                        filteredSubs={filteredSubs}
                        selectedAssignmentObj={selectedAssignmentObj}
                        editedScores={editedScores}
                        setEditedScores={setEditedScores}
                        setHasChanges={setHasChanges}
                        hasChanges={hasChanges}
                        setSubmissions={setSubmissions}
                    />
                </>
            )}

            {currentTab === 'create' && (
                <div style={{ padding: '20px' }}>
                    <AssignmentMenu
                        setSelectedAssignmentId={setSelectedAssignmentId}
                        selectedAssignmentId={selectedAssignmentId}
                        assignments={assignments}
                        setAssignments={setAssignments}
                        selectedSection={selectedSection}
                        setSelectedSection={setSelectedSection}
                        sections={sections}
                        selectedAssignmentObj={selectedAssignmentObj}
                    />


                    <div style={{
                        marginTop: '20px',
                        padding: '20px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <h3>Lab Builder</h3>
                        <iframe
                            src="http://localhost:13001/builder" // Change to your actual LabBuilder URL
                            title="Lab Builder"
                            width="100%"
                            height="600px"
                            style={{ border: 'none' }}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                    </div>
                </div>
            )}

            {currentTab === 'manage' && (

                <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3>Lab Builder</h3>
                    <iframe
                        src="http://localhost:13001/preview" // Change to your actual LabBuilder URL
                        title="Lab Builder"
                        width="100%"
                        height="600px"
                        style={{ border: 'none' }}
                        sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                </div>
            )}


        </div>
    );
}

export default AdminDashboard;