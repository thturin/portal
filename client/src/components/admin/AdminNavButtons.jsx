import React from 'react';
import Button from '../shared/Button';

const AdminNavButtons = ({ onSelect }) => {
    return (
         <>                  
         {/* //(OnSelect wrapped in function prevents function from executing immediately. Only on click */}
            <Button color="primary" onClick={() => onSelect('review')}>
            👁️ Review 
            </Button>
            <Button color="secondary" onClick={() => onSelect('manage')}>
            ✅ Manage 
            </Button>
            <Button color="secondary" onClick={() => onSelect('create')}>
            🔨 Create
            </Button>
        </>
    );
};

export default AdminNavButtons;