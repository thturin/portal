import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';


const EditAssignment = ({setSelectedAssignmentId, selectedAssignmentObj, onAssignmentDelete, onAssignmentUpdate }) => {
    const [hasChanges, setHasChanges] = useState(false);
    const [title, setTitle] = useState(selectedAssignmentObj.title);
    const [dueDate, setDueDate] = useState(selectedAssignmentObj.dueDate);
    const [type, setType] = useState(selectedAssignmentObj.type);
    const [showExplanations, setShowExplanations] = useState(selectedAssignmentObj.showExplanations);
    const [isDraft, setIsDraft] = useState(selectedAssignmentObj.isDraft);

    useEffect(() => {
        setTitle(selectedAssignmentObj.title);
        setDueDate(selectedAssignmentObj.dueDate);
        setType(selectedAssignmentObj.type);
        setShowExplanations(selectedAssignmentObj.showExplanations);
        setIsDraft(selectedAssignmentObj.isDraft);
        setHasChanges(false);
    }, [selectedAssignmentObj]); //when selection changes, update field in assignment details

    const handleDelete = async()=>{
        try{
            const response = await axios.delete(`${process.env.REACT_APP_API_HOST}/assignments/delete-assignment/${selectedAssignmentObj.id}`);
            console.log('Assignment Deleted!');
            setSelectedAssignmentId(-1);
            if(onAssignmentDelete) onAssignmentDelete(response.data);
        }catch(err){
            console.error('Error in deleteAssignment',err.message);
        }
    }

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_HOST}/assignments/${selectedAssignmentObj.id}`, {
                title,
                dueDate,
                showExplanations,
                isDraft
            });
            if (response.data) {
                setHasChanges(false);
            }
            if(onAssignmentUpdate) onAssignmentUpdate(response.data);
        } catch (err) {
            console.error('error in AssignmentDetails handleUpdate->', err);
        }
    };

    return (
        <div style={{
            maxWidth: '600px',
            margin: '20px auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
        }}>
            <h3 style={{ textAlign: 'center', marginTop: 0 }}>Edit Assignment Details</h3>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
                <input
                    type="text"  // Changed from "string" to "text"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setHasChanges(true);
                    }}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Due Date:</label>
                <input
                    type="date"
                    value={new Date(dueDate).toISOString().split('T')[0]}
                    onChange={(e) => {
                        setDueDate(e.target.value)
                        setHasChanges(true);
                    }}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                />
            </div>

        {/* SHOW ASSIGNMENT TYPE  */}
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Assignment Type: </label>
                <p>{selectedAssignmentObj.type}</p>
            </div>

        {/* SHOW EXPLANATIONS CHECK BOX */}
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Show Explanations to students:</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={showExplanations}
                        onChange={(e) => { setShowExplanations(e.target.checked); setHasChanges(true); }}
                    />
                    <span style={{ fontSize: '14px' }}>{showExplanations ? 'Explanations visible' : 'Click to show explanations'}</span>
                </label>
            </div>

            {/* SHOW IS DRAFT */}
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Show Assignment to students:</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={!isDraft}
                        onChange={(e) => { setIsDraft(e.target.checked); setHasChanges(true); }}
                    />
                    <span style={{ fontSize: '14px' }}>{isDraft ? 'Click to publish' : 'Published'}</span>
                </label>
            </div>


            {/* UPDATE BUTTON */}
            {hasChanges && (
                <div style={{
                    display: 'left',
                    justifyContent: 'flex-end',
                    marginTop: '10px'
                }}>
                    <button
                        onClick={handleUpdate}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Update Assignment
                    </button>
                </div>
            )}
                       <br></br>

            {/* 
            DELETE BUTTON  */}
            <div style={{
                display: 'center',
                justifyContent: 'flex-end',
                marginTop: '10px'
            }}>
                <button
                    onClick={handleDelete}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#c7173aff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Delete Assignment
                </button>

            </div>
        </div>
    );
};

export default EditAssignment;