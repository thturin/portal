import React from 'react';
import Button from '../../../shared/Button';

const StudentNavButtons = ({ onSelect }) => {
    return (
         <>                  
         {/* //(OnSelect wrapped in function prevents function from executing immediately. Only on click */}
            <Button color="secondary" onClick={() => onSelect('github')}>
            😸 Github 
            </Button>
            <Button color="secondary" onClick={() => onSelect('lab')}>
            🧪 Lab 
            </Button>
            <Button color="primary" onClick={() => onSelect('view')}>
            👀 View
            </Button>
            <Button color="secondary" onClick={() => onSelect('late')}>
            ⏰ Late Policy
            </Button>
        </>
    );
};

export default StudentNavButtons;