import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from '../../../shared/Navbar';
import AdminAssignmentMenu from '../components/AdminAssignmentMenu';
import SubmissionList from '../components/SubmissionList';
import JupiterExportButton from '../components/JupiterExportButton';
import SectionSelection from '../components/SectionSelection';
import LabBuilder from '../../lab/components/LabBuilder';
import LabPreview from '../../lab/components/LabPreview';


const AdminDashboard = ({ user, onLogout }) => {
    //for lab-builder/preview
    const [blocks, setBlocks] = useState([]);
    const [title, setTitle] = useState('');


    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(-1);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [editedScores, setEditedScores] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [currentTab, setCurrentTab] = useState('');




    const selectedAssignmentObj = assignments.find(  //this will execute on any render
        ass => ass.id === Number(selectedAssignmentId)
    );

        
    useEffect(()=>{
        console.log('LAB ID IN ADMIN DASHBOARD->',selectedAssignmentObj?.labId);
    },[selectedAssignmentObj]);

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
        axios.get(`${process.env.REACT_APP_API_HOST}/assignments`).then(res => setAssignments(res.data));
        axios.get(`${process.env.REACT_APP_API_HOST}/submissions`).then(res => setSubmissions(res.data));
        axios.get(`${process.env.REACT_APP_API_HOST}/sections`).then(res => setSections(res.data));
    }, []);

    //you are curredntly working on updating the assignmetn
    const onAssignmentUpdate = (updatedAssignment)=>{
        //gt previous assignments->map it and compare each assignment id to updatedAssignment Id. change that assignment when found
        setAssignments(prev => prev.map(ass => {
            return ass.id === updatedAssignment.id ? updatedAssignment : ass;
        }));

    }

    const onAssignmentCreate = (newAssignment)=>{
        //default to the newly created assignment as the slelectedAssignmentId
        setSelectedAssignmentId(newAssignment.id);
        setAssignments(prev=>[...prev,newAssignment]);
    }

    const onAssignmentDelete = (deleteAssignment)=>{
        //filter out assignments and submissiuons the old assignment
        setAssignments(prev=> prev.filter(ass=>ass.id!==deleteAssignment.id));
        setSubmissions(prev=>prev.filter(ass=>ass.assignmentId!==deleteAssignment.id));
    }

    const handleTabSelect = (tab) => {
        setCurrentTab(tab);
    }

    return (
        <div>
            <Navbar user={user}
                onSelect={handleTabSelect}
                onLogout={onLogout}
                assignmentTitle={selectedAssignmentObj?.title}
                assignmentType={selectedAssignmentObj?.type}
                assignmentId={selectedAssignmentId}
            />
            <div style={{ marginTop: '80px' }}>  {/* Add space below navbar */}


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
                        <AdminAssignmentMenu
                            setSelectedAssignmentId={setSelectedAssignmentId}
                            selectedAssignmentId={selectedAssignmentId}
                            assignments={assignments}
                            setAssignments={setAssignments}
                            selectedAssignmentObj={selectedAssignmentObj}
                            setTitle={setTitle}
                            onAssignmentUpdate={onAssignmentUpdate}
                            onAssignmentDelete={onAssignmentDelete}
                            onAssignmentCreate={onAssignmentCreate}
                        />
                        {selectedAssignmentObj?.type === 'lab' && (
                            <LabBuilder
                                blocks={blocks}
                                setBlocks={setBlocks}
                                title={title}
                                setTitle={setTitle}
                                assignmentId={selectedAssignmentId}
                            />)
                        }
                    </div>
                )}

                {currentTab === 'manage' && (

                    <LabPreview
                        blocks={blocks}
                        setBlocks={setBlocks}
                        title={title}
                        setTitle={setTitle}
                        assignmentId={selectedAssignmentId}
                        setAssignmentId={setSelectedAssignmentId}
                        mode='admin'
                        userId={user.id}
                        username={user.username}
                        labId={selectedAssignmentObj.labId}
                    />
                    //</div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;