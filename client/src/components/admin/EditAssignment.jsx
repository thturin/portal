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
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/assignments/${selectedAssignmentObj.id}`, {
                title,
                dueDate,
                type
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
            <h3 style={{ textAlign: 'center', marginTop: 0 }}>Assignment Details</h3>

            <div style={{ marginBottom: '10px' }}>
                <input
                    type="string"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setHasChanges(true);
                    }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <input
                    type="date"
                    value={new Date(dueDate).toISOString().split('T')[0]}
                    onChange={(e) => {
                        setDueDate(e.target.value)
                        setHasChanges(true);
                    }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        setHasChanges(true);
                    }}
                    style={{
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                >
                    <option value="lab">Lab</option>
                    <option value="code">Code</option>
                </select>
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