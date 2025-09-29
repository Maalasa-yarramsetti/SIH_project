import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import './WalkthroughIcon.css';

const WalkthroughIcon = ({ text }) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div 
            className="walkthrough-container" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            <div className="walkthrough-button">
                <FaInfoCircle />
            </div>
            {isHovering && (
                <div className="walkthrough-popup">
                    {text}
                </div>
            )}
        </div>
    );
};

export default WalkthroughIcon;