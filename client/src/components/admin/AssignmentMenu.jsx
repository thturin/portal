import React from 'react';
import { useEffect, useState } from 'react';
import CreateAssignment from './CreateAssignment';
import EditAssignment from './EditAssignment';

const AssignmentMenu = ({
    setSelectedAssignmentId,
    selectedAssignmentId,
    assignments,
    setAssignments,
    setSelectedSection,
    selectedSection,
    sections,
    selectedAssignmentObj
}) => {
    const [showCreateAssignment, setShowCreateAssignment] = useState(false);
    const handleAssignmentChange = (val) => {
        if (val === "__new__") {
            setShowCreateAssignment(true);
        } else {
            setShowCreateAssignment(false);
        }
    }

    return (<>
        <div style={{
            maxWidth: '600px',
            margin: '20px auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
        }}>
            <h3 style={{ textAlign: 'center', marginTop: 0 }}>Select or Create Assignment</h3>

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
                        handleAssignmentChange(e.target.value);
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
                    <option value="__new__">➕ Create New Assignment</option>
                    {assignments.map(ass => (
                        <option key={ass.id} value={ass.id}>
                            {ass.title}
                        </option>
                    ))}
                </select>
            </div>

            {showCreateAssignment && <CreateAssignment
                updateAssignments={childData => setAssignments(oldAssignments => [...oldAssignments, childData])} />}

{/* DISPLAY SELECTED ASSIGNMENT (DUE DATE, TITLE, TYPE ) */}
            {selectedAssignmentObj && (<EditAssignment selectedAssignmentObj={selectedAssignmentObj} />)}

        </div>
    </>);
}

export default AssignmentMenu;