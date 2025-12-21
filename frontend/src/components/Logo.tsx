import React from 'react';

const Logo: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
    const sizes = {
        small: { width: '32px', height: '32px', fontSize: '14px' },
        medium: { width: '48px', height: '48px', fontSize: '20px' },
        large: { width: '64px', height: '64px', fontSize: '28px' }
    };

    const style = sizes[size];

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: style.width,
                height: style.height,
                background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                borderRadius: '8px',
                fontWeight: 'bold',
                color: '#000',
                fontSize: style.fontSize,
                letterSpacing: '-1px'
            }}
        >
            ₹
        </div>
    );
};

export default Logo;
