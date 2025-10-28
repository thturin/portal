import React from 'react';


const SubmissionList = ({
    selectedAssignmentObj,
    filteredSubs,
    setEditedScores,
    editedScores,
    setHasChanges,
    hasChanges,
    setSubmissions
}) => (
    <>
        {/* SUBMISSION LIST */}

            <h3 style={{ textAlign: 'center', marginTop: 0 }}>
                Submissions for Assignment: {selectedAssignmentObj ? selectedAssignmentObj.title : ''}
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '4px' }}>Section ID/Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '4px' }}>User ID</th>
                        <th style={{ border: '1px solid #ccc', padding: '4px' }}>User Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '4px' }}>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSubs.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ color: 'red', textAlign: 'center', padding: '8px' }}>
                                No Submissions
                            </td>
                        </tr>
                    ) : (
                        filteredSubs.map(sub => (
                            <tr key={sub.id}>
                                <td style={{ border: '1px solid #ccc', padding: '4px' }}>{sub.user.sectionId} {sub.user?.section?.name || ''}</td>
                                <td style={{ border: '1px solid #ccc', padding: '4px' }}>{sub.userId}</td>
                                <td style={{ border: '1px solid #ccc', padding: '4px' }}>{sub.user?.name ? sub.user.name : 'no user'}</td>
                                <td style={{ border: '1px solid #ccc', padding: '4px' }}>
                                    <input
                                        type="number"
                                        value={editedScores[sub.id] !== undefined ? editedScores[sub.id] : sub.score}
                                        onChange={(e) => {
                                            setEditedScores(prev => ({
                                                ...prev,
                                                [sub.id]: Number(e.target.value)
                                            }));
                                            setHasChanges(true);
                                        }}
                                        style={{
                                            width: '60px',
                                            padding: '2px',
                                            border: '1px solid #ccc',
                                            borderRadius: '3px'
                                        }}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {/* UPDATE BUTTON */}
            {hasChanges && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '10px'
                }}>
                    <button
                        onClick={async () => {
                            try {
                                //create a promise for each submission that is in the edited list
                                await Promise.all(
                                    Object.entries(editedScores).map(([submissionId, score]) =>
                                        axios.post(`${process.env.REACT_APP_API_URL}/submissions/update-grade`, {
                                            submissionId: Number(submissionId),
                                            score: Number(score)
                                        })
                                    )
                                );
                                setHasChanges(false); //no more changes
                                //update local state map the previous submissions to the editedScores 
                                setSubmissions(prev => {
                                    return prev.map(submission => ({
                                        ...submission,
                                        score: editedScores[submission.id] ?? submission.score //nullish returns right side if left is null
                                    }))
                                })
                            } catch (error) {
                                console.error('Failed to update grades:', error);
                            }
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                    >
                        Update Grades
                    </button>
                </div>
            )}

        

    </>
);


export default SubmissionList;