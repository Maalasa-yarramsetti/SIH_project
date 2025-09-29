import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './ModelViewerModal.css';

const ModelViewerModal = ({ modelFile, onClose }) => {
    const modelPath = `/models/${modelFile}`;
    const iosSrc = modelFile.endsWith('.glb') ? modelFile.replace('.glb', '.usdz') : modelFile;

    return (
        <div className="model-viewer-backdrop" onClick={onClose}>
            <button className="model-viewer-close" onClick={onClose}><FaTimes /></button>
            <div className="model-viewer-content" onClick={(e) => e.stopPropagation()}>
                <model-viewer
                    src={modelPath}
                    ios-src={`/models/${iosSrc}`}
                    alt="A 3D model of the monastery"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    ar-placement="floor"
                    ar-scale="fixed"
                    xr-environment
                    environment-image="neutral"
                    camera-controls
                    camera-orbit="0deg 75deg auto"
                    camera-target="0m 0m 0m"
                    style={{ width: '100%', height: '100%' }}>
                </model-viewer>
            </div>
        </div>
    );
};

export default ModelViewerModal;