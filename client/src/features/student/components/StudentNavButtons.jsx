import React from 'react';
import Button from '../../../shared/Button';

const StudentNavButtons = ({ onSelect, assignmentTitle, assignmentType }) => {
    const githubDisabled = assignmentType === 'lab';
    const labDisabled = assignmentType === 'github';

    return (
        <>
            <Button
              color="secondary"
              onClick={() => onSelect('github')}
              disabled={githubDisabled}
              style={githubDisabled ? { opacity: 0.5 } : undefined}
            >
              😸 Github
            </Button>

            <Button
              color="secondary"
              onClick={() => onSelect('lab')}
              disabled={labDisabled}
              style={labDisabled ? { opacity: 0.5 } : undefined}
            >
              🧪 Lab
            </Button>

            <Button color="primary" onClick={() => onSelect('view')}>
              👀 View
            </Button>

            <Button color="secondary" onClick={() => onSelect('late')}>
              ⏰ Late Policy
            </Button>

            <Button color="default" style={{ cursor: 'default', pointerEvents: 'none', marginLeft: '8px', opacity: 0.7 }}>
                📄 {assignmentTitle || "No Assignment Selected"}
            </Button>
        </>
    );
};

export default StudentNavButtons;