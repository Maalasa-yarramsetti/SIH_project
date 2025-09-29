import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCoins, FaEdit, FaTimes, FaSave } from 'react-icons/fa';
// --- FIX: Use named imports with curly braces here ---
import { mockMonasteries } from './Explore';
import { allArchives } from './Archives';
import './Profile.css';
import { useLocale } from '../../contexts/LocaleContext';

const Profile = () => {
    const { user, logout, updateUserState } = useAuth();
    const { t } = useLocale();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editableProfile, setEditableProfile] = useState({
        username: '', email: '', number: ''
    });

    useEffect(() => {
        if (user) {
            setEditableProfile({
                username: user.username,
                email: user.email || '',
                number: user.number || ''
            });
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const handleProfileChange = (e) => {
        setEditableProfile({ ...editableProfile, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = () => {
        updateUserState({ ...user, ...editableProfile });
        setIsEditModalOpen(false);
    };

    const favoriteMonasteryDetails = user?.favorites?.monasteries.map(id => 
        mockMonasteries.find(m => m.id === id)
    ).filter(Boolean);

    const favoriteArchiveDetails = user?.favorites?.archives.map(id => 
        allArchives.find(a => a.id === id)
    ).filter(Boolean);

    if (!user) {
        return <div>{t('profile.loading')}</div>;
    }

    return (
        <>
            <div className="profile-page">
                <div className="profile-header">
                    <div className="avatar-wrap">
                        <div className="avatar-circle">{(user.username || 'U').charAt(0).toUpperCase()}</div>
                    </div>
                    <div className="profile-info">
                        <h2>{user.username}</h2>
                        <p>{t('profile.email')}: {user.email || 'Not provided'}</p>
                        <p>{t('profile.phone')}: {user.number || 'Not provided'}</p>
                    </div>
                    <div className="profile-cta">
                        <button className="edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>
                            <FaEdit /> {t('profile.editProfile')}
                        </button>
                    </div>
                </div>

                <div className="profile-section panel favorites-section wide-scroll">
                    <h3>{t('profile.myFavorites')}</h3>
                    <div className="favorites-lists">
                        <div>
                            <h4>{t('profile.monasteries')} ({favoriteMonasteryDetails.length})</h4>
                            <ul>
                                {favoriteMonasteryDetails.map(m => <li key={m.id}>{m.name}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4>{t('profile.archives')} ({favoriteArchiveDetails.length})</h4>
                            <ul>
                                {favoriteArchiveDetails.map(a => <li key={a.id}>{a.title}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="quick-row">
                    <button className="coins-btn small" aria-label={t('profile.myCoins')}>
                        <FaCoins /> <span>{t('profile.myCoins')}</span>
                        <span className="coins-count">{user.coins}</span>
                    </button>
                    <button onClick={handleLogout} className="logout-btn small" aria-label={t('profile.logout')}>{t('profile.logout')}</button>
                </div>
            </div>

            {isEditModalOpen && (
                <div className="profile-modal-overlay">
                    <div className="profile-modal">
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="close-btn"><FaTimes /></button>
                        </div>
                        <div className="form-group">
                            <label>Username</label>
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

export default Profile;