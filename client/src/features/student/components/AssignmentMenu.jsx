import React from 'react';
import { useEffect, useState } from 'react';
import { formatDate, isPastDue } from '../../../utils/dateUtils';

const AssignmentMenu = ({
    setSelectedAssignmentId,
    selectedAssignmentId,
    assignments,
    assignmentType
}) => {

    return (<>
        <div style={{
            maxWidth: '600px',
            margin: '20px auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
        }}>
            <h3 style={{ textAlign: 'center', marginTop: 0 }}>Select Assignment</h3>

            {/* DROP DOWN MENU FOR ASSIGNMENTS */}
            <div style={{ marginBottom: '15px' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold'
                }}>
                    Assignment:
                </label>
                <select
                    value={selectedAssignmentId} //value that gets passed is not the text but assignment id
                    onChange={e => {
                        //handleAssignmentChange(e.target.value);
                        setSelectedAssignmentId(e.target.value);
                    }}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                >
                    <option value="">Select an Assignment</option>
                    {/* filter by assignmentType */}
                    {assignments.filter(a=>{
                        if(!assignmentType) return true;
                        return a.type === assignmentType;
                    // then map assignment options
                    }).map(ass => (
                        <option key={ass.id} 
                                value={ass.id}
                                style={{ color: isPastDue(ass.dueDate) ? 'red' : 'black' }}
                        >
                            {ass.title}- Due Date: {formatDate(ass.dueDate, 1)} {formatDate(ass.dueDate, 2)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    </>);
}

export default AssignmentMenu;