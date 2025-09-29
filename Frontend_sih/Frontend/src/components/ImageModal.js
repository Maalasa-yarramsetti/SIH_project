import React from 'react';
import './ImageModal.css';

const ImageModal = ({ imageUrl, onClose }) => {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Enlarged view" />
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
            </div>
        </div>
    );
};

export default ImageModal;