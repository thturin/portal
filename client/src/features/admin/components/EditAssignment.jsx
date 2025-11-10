import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';


const EditAssignment = ({ selectedAssignmentObj }) => {
    const [hasChanges, setHasChanges] = useState(false);
    const [title, setTitle] = useState(selectedAssignmentObj.title);
    const [dueDate, setDueDate] = useState(selectedAssignmentObj.dueDate);
    const [type, setType] = useState(selectedAssignmentObj.type);

    useEffect(()=>{
        setTitle(selectedAssignmentObj.title);
        setDueDate(selectedAssignmentObj.dueDate);
        setType(selectedAssignmentObj.type);
        setHasChanges(false);
    },[selectedAssignmentObj]); //when selection changes, update field in assignment details
    const handleUpdate = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_HOST}/assignments/${selectedAssignmentObj.id}`, {
                title,
                dueDate
            });
            if(response.data){
                setHasChanges(false);
            }
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
                >
       
                
                </input>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <p>Assignment Type: {selectedAssignmentObj.type}</p>
            </div>


            {/* UPDATE BUTTON */}
            {hasChanges && (
                <div style={{
                    display: 'flex',
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
                )
            }
        </div>
    );
};

export default EditAssignment;