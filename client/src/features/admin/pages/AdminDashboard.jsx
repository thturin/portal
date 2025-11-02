import axios from 'axios';
import { useRef, useEffect, useState } from 'react';
import Navbar from '../../../shared/Navbar';
import AssignmentMenu from '../components/AssignmentMenu';
import SubmissionList from '../components/SubmissionList';
import JupiterExportButton from '../components/JupiterExportButton';
import SectionSelection from '../components/SectionSelection';
import LabBuilder from '../../lab/components/LabBuilder';
import LabPreview from '../../lab/components/LabPreview';


const AdminDashboard = ({ user, onLogout }) => {
    //for lab-builder/preview
    const [blocks, setBlocks] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedLabId, setSelectedLabId] = useState(null);

    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [editedScores, setEditedScores] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [currentTab, setCurrentTab] = useState('');

    const selectedAssignmentObj = assignments.find(  //this will execute on any render
        ass => ass.id === Number(selectedAssignmentId)
    );

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

    //fetch assignmenbts, submissions, and sections
    useEffect(() => {
        console.log('fetching assignments, submissions on mount');
        axios.get(`${process.env.REACT_APP_API_HOST}/assignments`).then(res => setAssignments(res.data));
        axios.get(`${process.env.REACT_APP_API_HOST}/submissions`).then(res => setSubmissions(res.data));
        axios.get(`${process.env.REACT_APP_API_HOST}/sections`).then(res => setSections(res.data));
    }, []);

    //when user selects assignment, find the labId from selected assignment obj
    useEffect(()=>{
        if(selectedAssignmentObj){
            setSelectedLabId(selectedAssignmentObj.labId);
        }

    },[selectedAssignmentObj]);

    const handleTabSelect = (tab) => {
        console.log(`current tab is ${currentTab}`);
        setCurrentTab(tab);
    }

    return (
        <div>
            <Navbar user={user}
                onSelect={handleTabSelect}
                onLogout={onLogout}
                assignmentTitle={selectedAssignmentObj?.title}
            />
            <h2> Welcome ADMIN, {user.name}</h2>

            {currentTab === 'review' && (
                <>
                    <div style={{
                        maxWidth: '600px',
                        margin: '20px auto',
                        padding: '20px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9'
                    }}>
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
                    </div>
                </>
            )}

            {currentTab === 'create' && (
                <div style={{ padding: '20px' }}>
                    <AssignmentMenu
                        setSelectedAssignmentId={setSelectedAssignmentId}
                        selectedAssignmentId={selectedAssignmentId}
                        assignments={assignments}
                        setAssignments={setAssignments}
                        selectedAssignmentObj={selectedAssignmentObj}
                        setTitle={setTitle}
                    />


                    {/* <div style={{
                        marginTop: '20px',
                        padding: '20px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9'
                    }}> */}
                        <LabBuilder
                            blocks={blocks}
                            setBlocks={setBlocks}
                            title={title}
                            setTitle={setTitle}
                            assignmentId={selectedAssignmentId}
                            setAssignmentId={setSelectedAssignmentId}
                            id={selectedLabId}
                            setId={setSelectedLabId}
                        />
                    {/* </div> */}
                </div>
            )}

            {currentTab === 'manage' && (

                // <div style={{
                //     marginTop: '20px',
                //     padding: '20px',
                //     border: '1px solid #ddd',
                //     borderRadius: '8px',
                //     backgroundColor: '#f9f9f9'
                // }}>

                    <LabPreview
                        blocks={blocks}
                        setBlocks={setBlocks}
                        title={title}
                        setTitle={setTitle}
                        id={selectedLabId}
                        setId={setSelectedAssignmentId}
                    />
                //</div>
            )}


        </div>
    );
}

export default AdminDashboard;