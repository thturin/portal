import { useEffect, useState } from 'react';
import SubmitForm from './StudentSubmitGithub';

const StudentSubmitAssignment = ({ user, submissions, setSubmissions, assignments }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch',
                minHeight: '100vh',
                width: '100vw',
                background: '#f8fafc',
                padding: '32px 0'
            }}
        >
            <div style={{
                flex: 1,
                maxWidth: '700px',
                minWidth: '400px',
                margin: '0 auto'
            }}>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                    <div style={{
                        flex: '1',
                        minWidth: '400px'
                    }}>
                        {/* ✨ Submit Form Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            marginBottom: '32px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <SubmitForm
                                onNewSubmission={childData => setSubmissions(
                                    oldSubmissions => [
                                        ...oldSubmissions.filter(sub => String(sub.assignmentId) !== String(childData.assignmentId)),
                                        childData
                                    ]
                                )}
                                user={user}
                                submissions={submissions || []}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentSubmitAssignment;