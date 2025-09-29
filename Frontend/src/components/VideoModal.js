import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './VideoModal.css';

const VideoModal = ({ videoUrl, onClose }) => {
    return (
        <div className="video-modal-backdrop" onClick={onClose}>
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="video-modal-close" onClick={onClose}><FaTimes /></button>
                <video src={videoUrl} controls autoPlay muted loop playsInline />
            </div>
        </div>
    );
};

export default VideoModal;