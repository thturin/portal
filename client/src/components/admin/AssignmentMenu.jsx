import React from 'react';


const AssignmentMenu = ({
    setSelectedAssignmentId,
    selectedAssignmentId,
    assignments,
    setSelectedSection,
    sections }) => (
    <>
        <h3 style={{ textAlign: 'center', marginTop: 0 }}>Select Assignment</h3>

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
                    value={selectedAssignmentId}
                    onChange={e => setSelectedAssignmentId(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                >
                    <option value="">Select an Assignment</option>
                    {assignments.map(ass => (
                        <option key={ass.id} value={ass.id}>
                            {ass.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* DROP DOWN MENU FOR SECTION */}
            <div style={{ marginBottom: '15px' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold'
                }}>
                    Section:
                </label>
                <select
                    value={selectedSection}
                    onChange={e => setSelectedSection(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                >
                    <option value="">All Sections</option>
                    {sections.map(sec => (
                        <option key={sec.id} value={sec.id}>
                            {sec.name}
                        </option>
                    ))}
                </select>
            </div>

        </div>
    </>
)


export default AssignmentMenu;