import React from 'react';


const Navbar = ({ user, onSelect, onLogout }) => {
    const isAdmin = user.role === 'admin';

    return (
        <nav style={{
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            padding: '16px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '0 0 16px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
            <div style={{ fontWeight: '700', color: 'white', fontSize: '20px' }}>
                Student Portal
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
                {isAdmin ? (
                    <>
                        <button
                            style={{
                                background: '#fff',
                                color: '#764ba2',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 20px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                            onClick={() => onSelect('manage')}
                        >
                            Manage Assignments
                        </button>
                        <button
                            style={{
                                background: '#fff',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 20px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                            onClick={() => onSelect('viewSubmissions')}
                        >
                            View Submissions
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            style={{
                                background: '#fff',
                                color: '#764ba2',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 20px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                            onClick={() => onSelect('submit')}
                        >
                            Submit Assignment
                        </button>
                        <button
                            style={{
                                background: '#fff',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 20px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                            onClick={() => onSelect('work')}
                        >
                            Work on Assignment
                        </button>
                        {/* Late Policy Button */}
                        <button
                            style={{
                                background: '#fff',
                                color: '#f59e42',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 20px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                            onClick={() => onSelect('late')}
                        >
                            Late Policy
                        </button>
                    </>
                )}
                <button
                    style={{
                        background: '#fff',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 20px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;