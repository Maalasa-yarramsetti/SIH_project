import React from 'react';
import { FaDownload, FaHeart, FaRegHeart, FaEye, FaVolumeUp } from 'react-icons/fa';
// import { speak } from '../services/SpeechService'; // Not used in this component
import { useAuth } from '../contexts/AuthContext'; // <-- IMPORT AUTH HOOK
import './ArchiveItemCard.css';

export const ArchiveItemCard = ({ item, onView }) => {
    const { user, toggleArchiveFavorite } = useAuth(); // <-- USE AUTH HOOK

    // Check if this archive is in the user's favorites list
    const isFavorite = user?.favorites?.archives.includes(item.id);

    const handleDownload = (e) => { /* ... */ };
    const handleSpeak = (e) => { /* ... */ };

    const toggleFavorite = (e) => {
        e.stopPropagation();
        toggleArchiveFavorite(item.id); // <-- USE GLOBAL FUNCTION
    };

    return (
        <div className="archive-card">
            <div className="archive-card-image-container" onClick={() => onView(item.image)}>
                <img src={item.image} alt={item.title} className="archive-card-img" />
                <div className="view-overlay"><FaEye /> View</div>
            </div>
            <div className="archive-card-body">
                <div>
                    <p className="archive-card-location">{item.monastery}</p>
                    <h4>{item.title}</h4>
                    <p className="archive-card-desc">{item.description}</p>
                </div>
                <div className="archive-card-actions">
                    <button onClick={handleDownload} title="Download"><FaDownload /></button>
                    <button onClick={handleSpeak} title="Read Aloud"><FaVolumeUp /></button>
                    <button onClick={toggleFavorite} title="Favorite">
                        {isFavorite ? <FaHeart style={{color: '#e74c3c'}}/> : <FaRegHeart />}
                    </button>
                </div>
            </div>
        </div>
    );
};