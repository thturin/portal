import React from 'react';
import Button from '../../../shared/Button';
import {useEffect } from 'react';

const AdminNavButtons = ({ onSelect, assignmentTitle, assignmentId, assignmentType}) => {
    let viewDisabled = false;
    let submissionsDisabled = false;
    if(assignmentId === -1){
        viewDisabled = true;
        submissionsDisabled = true;
    }

    if(assignmentType === 'code'){
        viewDisabled = true;
    }



    return (
         <>                  
         {/* //(OnSelect wrapped in function prevents function from executing immediately. Only on click */}
            <Button 
                color="secondary" 
                onClick={() => onSelect('review')}
                style={submissionsDisabled ? { opacity: 0.5 } : undefined}
                disabled={submissionsDisabled}
            >
            👁️ Submissions 
            </Button>
            <Button 
                color="secondary" 
                onClick={() => onSelect('manage')}
                style={viewDisabled ? { opacity: 0.5 } : undefined} 
                disabled={viewDisabled}       
            >
            ✅ Manage/Preview 
            </Button>
            <Button 
                color="primary" 
                onClick={() => onSelect('create')}
            >
            🔨 Create/Edit
            </Button>
                      {/* Fake button for assignment title */}
            <Button color="default" style={{ cursor: 'default', pointerEvents: 'none', marginLeft: '8px', opacity: 0.7 }}>
                📄 {assignmentTitle || "No Assignment Selected"}
            </Button>
        </>
    );
};

export default AdminNavButtons;