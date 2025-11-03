import React from 'react';

const StudentSubmitLab = (userId, username, submissions, setSubmissions,assignments) => {
    return (
        <div className="user-lab-work">
                    {/* ASSIGNMENT OPTION  */}
                <AssignmentMenu 
                    setSelectedAssignmentId={setSelectedAssignmentId}
                    selectedAssignmentId={selectedAssignmentId}
                    assignments={assignments}
                    assignmentType={assignmentType}
                />
            

        </div>
    );
};

export default StudentSubmitLab;