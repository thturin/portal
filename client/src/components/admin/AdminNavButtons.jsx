import React from 'react';
import Button from '../shared/Button';

const AdminNavButtons = ({ onSelect }) => {
    return (
         <>                  
         {/* //(OnSelect wrapped in function prevents function from executing immediately. Only on click */}
            <Button color="secondary" onClick={() => onSelect('review')}>
            👁️ Review 
            </Button>
            <Button color="secondary" onClick={() => onSelect('manage')}>
            ✅ Manage 
            </Button>
            <Button color="primary" onClick={() => onSelect('create')}>
            🔨 Create/Edit
            </Button>
        </>
    );
};

export default AdminNavButtons;