import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaHeart, FaRegHeart, FaVolumeUp } from 'react-icons/fa';
import { speak } from '../services/SpeechService';
import ImageSlider from './ImageSlider';
import VideoModal from './VideoModal';
import ModelViewerModal from './ModelViewerModal';
import Panorama360Modal from './Panorama360Modal';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';
import './MonasteryCard.css';

export const MonasteryCard = ({ monastery, isDetailPage = false, onArViewClick, onProposeEvent, isNgoView = false, onCardClick }) => { 
  const { user, toggleMonasteryFavorite } = useAuth();
  const { t } = useLocale();
  const isFavorite = user?.favorites?.monasteries.includes(monastery.id);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isModelViewerOpen, setIsModelViewerOpen] = useState(false);
  const [isPanorama360Open, setIsPanorama360Open] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!isDetailPage && !isNgoView) {
        navigate(`/user/explore/${monastery.id}`);
    }
  };
  
  const stopPropagation = (e) => e.stopPropagation();
  const toggleFavorite = (e) => { stopPropagation(e); toggleMonasteryFavorite(monastery.id); };
  const handleNarration = (e) => { stopPropagation(e); speak(`${monastery.name}. Located in ${monastery.location}. ${monastery.shortDescription}`); };
  const openArView = (e) => { stopPropagation(e); if (monastery.modelFile) { setIsModelViewerOpen(true); } else { alert('AR Model for this monastery is not available yet.'); } };
  const openVideoModal = (e) => { stopPropagation(e); setIsVideoModalOpen(true); };
  const openPanorama360 = (e) => { 
    stopPropagation(e); 
    if (monastery.image && monastery.image[0]) { 
      setIsPanorama360Open(true); 
    } else { 
      alert('360° panorama for this monastery is not available yet.'); 
    } 
  };

  const handleProposeClick = (e) => {
    stopPropagation(e);
    if(onProposeEvent) {
      onProposeEvent(monastery.name);
    }
  };

  return (
    <>
      {isVideoModalOpen && monastery.timelapseUrl && <VideoModal videoUrl={monastery.timelapseUrl} onClose={() => setIsVideoModalOpen(false)} />}
      {isModelViewerOpen && <ModelViewerModal modelFile={monastery.modelFile} onClose={() => setIsModelViewerOpen(false)} />}
      {isPanorama360Open && <Panorama360Modal isOpen={isPanorama360Open} onClose={() => setIsPanorama360Open(false)} image={monastery.image[0]} monasteryName={monastery.name} />}
      <div className={`monastery-card ${!isDetailPage && !isNgoView ? 'clickable' : ''}`} onClick={handleCardClick}>
        <div className="card-image">
          {isDetailPage && monastery.image && monastery.image.length > 1 ? (
            <ImageSlider images={monastery.image} altText={monastery.name} />
          ) : (
            <img src={monastery.image ? monastery.image[0] : ''} alt={monastery.name} />
          )}
        </div>
        <div className="card-content">
          <div className="card-header">
            <h3>{monastery.name}</h3>
            <div className="rating-favorite-container">
              <div className="card-rating"><FaStar className="star-icon" /> {monastery.rating}</div>
              <button onClick={toggleFavorite} className="icon-btn favorite-btn" title={t('profile.myFavorites')}>{isFavorite ? <FaHeart className="heart-filled" /> : <FaRegHeart />}</button>
            </div>
          </div>
          <p className="card-location"><FaMapMarkerAlt /> {monastery.location}</p>
          <p className="card-description">{monastery.shortDescription}</p>
          <div className="card-footer">
            <div className="action-buttons">
              <button className="card-btn" onClick={openPanorama360}>360° Tour</button>
              <button onClick={openArView} className="card-btn">AR View</button>
              {monastery.timelapseUrl && <button onClick={openVideoModal} className="card-btn">Timelapse</button>}
              {!isDetailPage && !isNgoView && (
                 <button onClick={handleCardClick} className="card-btn secondary">More Details</button>
              )}
              {isNgoView && (
                <button onClick={handleProposeClick} className="card-btn propose-btn">Propose Event</button>
              )}
            </div>
            <div className="card-icons">
               <button onClick={handleNarration} className="icon-btn" title="Read Aloud"><FaVolumeUp /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};