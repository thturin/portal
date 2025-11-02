import React from 'react';
import Button from '../../../shared/Button';

const AdminNavButtons = ({ onSelect, assignmentTitle}) => {
    return (
         <>                  
         {/* //(OnSelect wrapped in function prevents function from executing immediately. Only on click */}
            <Button color="secondary" onClick={() => onSelect('review')}>
            👁️ Submissions 
            </Button>
            <Button color="secondary" onClick={() => onSelect('manage')}>
            ✅ Manage/Preview 
            </Button>
            <Button color="primary" onClick={() => onSelect('create')}>
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