import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Compass, User, Plus, LogOut, Check, X, Upload } from 'lucide-react';
import Explore from './user/Explore';
import NgoProfile from './NgoProfile';
import './NgoDashboard.css';

// --- Proposal Modal Component ---
const ProposalModal = ({ monasteryName, onClose, onSubmit }) => {
    const [proposalText, setProposalText] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onSubmit({ monastery: monasteryName, text: proposalText }); onClose(); };
    return (
        <div className="ngo-modal-overlay" onClick={onClose}>
            <div className="ngo-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Propose Event at {monasteryName}</h2>
                <form onSubmit={handleSubmit}>
                    <textarea 
                        rows="8" 
                        placeholder="Write your event proposal here. Include details like event type, estimated budget, and potential dates..."
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                        required
                    />
                    <div className="ngo-modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}><X size={16}/> Cancel</button>
                        <button type="submit" className="submit-btn"><Check size={16}/> Submit Proposal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Upload Modal Component (with both Drag-Drop and Select Files) ---
const UploadModal = ({ onClose, onSubmit }) => {
    const [files, setFiles] = useState([]);
    const [monasteryName, setMonasteryName] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };
    const preventDefault = (e) => e.preventDefault();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (files.length > 0 && monasteryName) { 
            onSubmit({ monastery: monasteryName, files }); 
            onClose(); 
        } else { 
            alert('Please provide a monastery name and select at least one file.'); 
        }
    };

    return (
        <div className="ngo-modal-overlay" onClick={onClose}>
            <div className="ngo-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Upload Past Event Media</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Monastery Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter the monastery where the event took place" 
                            value={monasteryName}
                            onChange={(e) => setMonasteryName(e.target.value)}
                            required 
                        />
                    </div>
                    {/* --- THIS IS THE COMBINED UPLOAD AREA --- */}
                    <div 
                        className="upload-box" 
                        onDrop={handleFileDrop} 
                        onDragOver={preventDefault}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <Upload size={48} color="#6c757d" />
                        <p>Drag & drop files here, or click to browse</p>
                        <input 
                            type="file" 
                            multiple 
                            ref={fileInputRef} 
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>
                    {files.length > 0 && (
                        <ul className="uploaded-files-list">
                            {files.map((file, index) => <li key={index}>{file.name}</li>)}
                        </ul>
                    )}
                    <div className="ngo-modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}><X size={16}/> Cancel</button>
                        <button type="submit" className="submit-btn"><Upload size={16}/> Upload Media</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const NgoDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProposalModal, setShowProposalModal] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const notification = localStorage.getItem(`ngoNotification_${user?.username}`);
      if (notification) { 
          alert(`Notification: ${notification}`); 
          localStorage.removeItem(`ngoNotification_${user?.username}`); 
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);
  
  const handleLogout = () => { logout(); navigate('/auth'); };
  const handleProposeEvent = (monasteryName) => setShowProposalModal(monasteryName);
  
  const handleProposalSubmit = (proposal) => {
    console.log('New Proposal Submitted:', proposal);
    alert(`Your proposal for an event at ${proposal.monastery} has been submitted!`);
  };

  const handleUploadSubmit = (uploadData) => {
    console.log('New Media Uploaded:', uploadData);
    alert(`${uploadData.files.length} file(s) for ${uploadData.monastery} uploaded. This will now appear in the user's "Past Events" section.`);
  };

  return (
    <div className="ngo-dashboard-container">
        {showProposalModal && <ProposalModal monasteryName={showProposalModal} onClose={() => setShowProposalModal(null)} onSubmit={handleProposalSubmit} />}
        {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} onSubmit={handleUploadSubmit} />}
        
        <aside className="ngo-sidebar">
            <h3>NGO Panel</h3>
            <NavLink to="/ngo/explore" className="ngo-nav-link"><Compass /> Explore Monasteries</NavLink>
            <NavLink to="/ngo/profile" className="ngo-nav-link"><User /> My Profile</NavLink>
            <button onClick={handleLogout} className="ngo-logout-btn"><LogOut/> Logout</button>
        </aside>
        <main className="ngo-main-content">
            <Routes>
                <Route path="explore" element={<Explore isNgoView={true} onProposeEvent={handleProposeEvent} />} />
                <Route path="profile" element={<NgoProfile />} />
            </Routes>
        </main>
        
        <button className="fab" title="Upload Past Event Media" onClick={() => setShowUploadModal(true)}>
            <Plus />
        </button>
    </div>
  );
};

export default NgoDashboard;