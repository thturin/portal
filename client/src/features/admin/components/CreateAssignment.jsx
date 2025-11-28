import axios from 'axios';
import { useState, useEffect } from 'react';


//WHEN CREATING A NEW ASSIGNMENT, ALSO CREATE A NEW, EMPTY LAB


const CreateAssignment = ({ onAssignmentCreate }) => {
    const apiUrl = process.env.REACT_APP_API_HOST;
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [type, setType] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        //CREATE NEW ASSIGNMENT AND BLANK LAB
        try {
            //CREATE A NEW ASSIGNMENT
            const assignment = await axios.post(`${apiUrl}/assignments`, {
                title,
                dueDate,
                type
            });
            let lab;

            try {
                lab = await axios.post(`${process.env.REACT_APP_API_LAB_HOST}/lab/upsert-lab`, {
                    title,
                    blocks: [],
                    assignmentId: Number(assignment.data.id)
                });

                await axios.put(`${apiUrl}/assignments/${assignment.data.id}`, {
                    labId: Number(lab.data.id)
                });
            } catch (err) {
                console.error('Error trying to upsert lab to api (lab upsert) or updating assignment', err.message);
            }
            setSuccess('Assignment Created');
            setTitle('');//clear the title and due date after POST
            setDueDate('');
       
            const updatedAssignment = {
                ...assignment.data,
                labId: lab.data?.id
            };

            if(onAssignmentCreate) onAssignmentCreate(updatedAssignment);

        } catch (err) {
            setError(err.message || 'Failed to create assignment');
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
            <h3 style={{ textAlign: 'center', marginTop: 0 }}>Create New Assignment</h3>

            <form onSubmit={handleSubmit}>
                {/* ✅ Title Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold'
                    }}>
                        Assignment Title:
                    </label>
                    <input
                        type="text"
                        placeholder="Enter assignment title (e.g., Java Basics)"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                {/* ✅ Due Date Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold'
                    }}>
                        Due Date:
                    </label>
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                {/* ✅ Submission Type Field */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold'
                    }}>
                        Submission Type:
                    </label>
                    <select
                        name="type"
                        value={type}
                        onChange={e => setType(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    >
                        <option value="">Select type</option>
                        <option value="github">GitHub Repository</option>
                        <option value="lab">Lab</option>
                    </select>
                </div>

                {/* ✅ Submit Button */}
                <button type="submit" style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px'
                }}>
                    Create
                </button>

                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}

            </form>
        </div>
    );
};

export default CreateAssignment;