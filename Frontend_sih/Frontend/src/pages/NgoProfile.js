import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle, FaEdit, FaTimes, FaSave } from 'react-icons/fa';
import './NgoProfile.css';

const NgoProfile = () => {
    const { user, updateUserState } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editableProfile, setEditableProfile] = useState({
        username: '', email: '', number: '', ngoName: ''
    });

    useEffect(() => {
        if (user) {
            setEditableProfile({
                username: user.username || '',
                email: user.email || '',
                number: user.number || '',
                ngoName: user.ngoName || ''
            });
        }
    }, [user]);
    
    const handleProfileChange = (e) => {
        setEditableProfile({ ...editableProfile, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = () => {
        updateUserState({ ...user, ...editableProfile });
        setIsEditModalOpen(false);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <>
            <div className="ngo-profile-page">
                <div className="profile-header">
                    <FaUserCircle size={100} className="profile-avatar"/>
                    <div className="profile-info">
                        <h2>{user.ngoName || user.username}</h2>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
                        <p><strong>Phone:</strong> {user.number || 'Not provided'}</p>
                        <button className="edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>
                            <FaEdit /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <div className="profile-modal-overlay">
                    <div className="profile-modal">
                        <div className="modal-header">
                            <h2>Edit NGO Profile</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="close-btn"><FaTimes /></button>
                        </div>
                        <div className="form-group">
                            <label>NGO Name</label>
                            <input type="text" name="ngoName" value={editableProfile.ngoName} onChange={handleProfileChange} />
                        </div>
                        <div className="form-group">
                            <label>Contact Person (Username)</label>
                            <input type="text" name="username" value={editableProfile.username} onChange={handleProfileChange} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={editableProfile.email} onChange={handleProfileChange} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" name="number" value={editableProfile.number} onChange={handleProfileChange} />
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleSaveProfile} className="save-btn"><FaSave /> Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NgoProfile;