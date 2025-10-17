import React from 'react';

const Button = ({ children, color, onClick }) => {
    const colors = {
        primary: '#764ba2',
        secondary: '#667eea',
        warning: '#f59e42',
        danger: '#ef4444'
    };

    return (
        <button
            style={{
                background: '#fff',
                color: colors[color],
                border: 'none',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;