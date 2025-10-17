import React from 'react';


const AssignmentDetails = ({selectedAssignmentObj}) => (
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
            <strong>Title:</strong> {selectedAssignmentObj.title}
        </div>

        <div style={{ marginBottom: '10px' }}>
            <strong>Due Date:</strong> {new Date(selectedAssignmentObj.dueDate).toLocaleDateString()}
        </div>

        <div style={{ marginBottom: '10px' }}>
            <strong>Submission Type:</strong> {selectedAssignmentObj.type || selectedAssignmentObj.submissionType}
        </div>
    </div>
)

export default AssignmentDetails;