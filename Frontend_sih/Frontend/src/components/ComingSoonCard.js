import React from 'react';
import { FaPlus } from 'react-icons/fa';
import './ComingSoonCard.css';

const ComingSoonCard = () => {
    return (
        <div className="coming-soon-card">
            <div className="icon-container">
                <FaPlus />
            </div>
            <h3>More Monasteries Coming Soon</h3>
            <p>Our team is working to bring you more digital experiences from across Sikkim.</p>
        </div>
    );
};

export default ComingSoonCard;