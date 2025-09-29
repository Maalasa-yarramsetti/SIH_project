import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './FullScreenARView.css';

const FullScreenARView = ({ monastery, onClose }) => {
    const modelPath = `/models/${monastery.modelFile}`;

    return (
        <div className="fullscreen-ar-view">
            <button className="ar-back-button" onClick={onClose}>
                <FaArrowLeft /> Back to Explore
            </button>
            <model-viewer
                src={modelPath}
                alt={`A 3D model of ${monastery.name}`}
                ar
                ar-modes="webxr scene-viewer quick-look"
                environment-image="neutral"
                camera-controls
                auto-rotate
                style={{ width: '100%', height: '100%' }}>
            </model-viewer>
        </div>
    );
};

export default FullScreenARView;