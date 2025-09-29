import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, Upload, FolderLock, Star, Users, Calendar, DollarSign, 
  Bell, ChevronDown, Check, X, Eye, FileText, Menu, LogOut 
} from 'lucide-react';
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // FIXED: Changed default to 'proposals' instead of 'overview'
  const [activeSection, setActiveSection] = useState('proposals');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.username || "Admin Profile",
    email: user?.email || "admin@example.com",
    number: user?.number || "+91 9876543210",
    picture: null
  });

  const handleProfileChange = (e) => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfile(prev => ({ ...prev, picture: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const [proposals, setProposals] = useState([
    { id: 1, ngoName: "Heritage Foundation", eventTitle: "Cultural Heritage Workshop", description: "Educational workshop on preserving ancient manuscripts and cultural artifacts", date: "2024-01-15", duration: "3 days", expectedParticipants: 50, budget: "$2,500", status: "pending" },
    { id: 2, ngoName: "Digital Preservation Society", eventTitle: "Manuscript Digitization Training", description: "Training session for monks on digital preservation techniques", date: "2024-01-10", duration: "2 days", expectedParticipants: 30, budget: "$1,800", status: "pending" },
    { id: 3, ngoName: "Community Outreach Network", eventTitle: "Meditation & Mindfulness Retreat", description: "Weekend retreat focusing on traditional meditation practices", date: "2024-01-08", duration: "2 days", expectedParticipants: 75, budget: "$3,200", status: "accepted" }
  ]);

  const handleProposalAction = (proposalId, action) => {
    let updatedProposals = proposals.map(p => p.id === proposalId ? { ...p, status: action } : p);
    setProposals(updatedProposals);
  };

  const mockData = {
    monastery: "Tashilhunpo Monastery",
    totalDonations: 45750,
    monthlyDonations: 8900,
    totalManuscripts: 1247,
    privateManuscripts: 89,
    totalReviews: 156,
    avgRating: 4.8,
    activeMembers: 234,
    recentEvents: 12
  };

  // FIXED: Updated sidebar items - removed 'overview', renamed sections
  const sidebarItems = [
    { id: 'proposals', label: 'Event Proposals', icon: Calendar },
    { id: 'archives', label: 'Upload Archives', icon: Upload },
    { id: 'private', label: 'Private Folder', icon: FolderLock },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'engagement', label: 'User Engagement', icon: Users },
    { id: 'donations', label: 'Donations', icon: DollarSign }
  ];

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New proposal submitted: Cultural Heritage Workshop", read: false },
    { id: 2, message: "Monthly donation report available", read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotif = { id: Date.now(), message: `Random notification #${Math.floor(Math.random() * 100)}`, read: false };
      setNotifications(prev => [newNotif, ...prev]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  };

  const [uploadedManuscripts, setUploadedManuscripts] = useState([]);
  const [uploadedPrivateFiles, setUploadedPrivateFiles] = useState([]);

  const handleManuscriptDrop = (e) => { e.preventDefault(); setUploadedManuscripts(prev => [...prev, ...Array.from(e.dataTransfer.files)]); };
  const handlePrivateDrop = (e) => { e.preventDefault(); setUploadedPrivateFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); };
  const preventDefault = (e) => e.preventDefault();

  const SidebarNav = () => (
    <nav className="sidebar-nav">
      {sidebarItems.map(item => {
        const Icon = item.icon;
        return (
          <button key={item.id} onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }} className={`sidebar-button ${activeSection === item.id ? 'active' : ''}`}>
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  const renderContent = () => {
    switch (activeSection) {
      // FIXED: Renamed 'manuscripts' to 'archives'
      case 'archives':
        return (
          <div className="content-section">
            <h2 className="content-title">Upload Archives</h2>
            <div className="upload-box" onDrop={handleManuscriptDrop} onDragOver={preventDefault} onDragEnter={preventDefault} onDragLeave={preventDefault}>
              <Upload size={48} color="#6c757d" />
              <p>Upload archive files</p>
              <span>Drag and drop files or click to browse</span>
              <input type="file" id="manuscriptUpload" multiple style={{ display: 'none' }} onChange={(e) => setUploadedManuscripts(prev => [...prev, ...Array.from(e.target.files)])} />
              <button className="upload-button" onClick={() => document.getElementById('manuscriptUpload').click()}>Select Files</button>
            </div>
            <p className="upload-total">Total archives uploaded: <strong>{mockData.totalManuscripts + uploadedManuscripts.length}</strong></p>
            {uploadedManuscripts.length > 0 && (
              <ul className="uploaded-files-list">{uploadedManuscripts.map((f, idx) => <li key={idx}>{f.name}</li>)}</ul>
            )}
          </div>
        );
      
      // FIXED: Enhanced private section with manuscript gallery
      case 'private':
        return (
          <div className="content-section">
            <h2 className="content-title">Private Folder</h2>
            <div className="upload-box private" onDrop={handlePrivateDrop} onDragOver={preventDefault} onDragEnter={preventDefault} onDragLeave={preventDefault}>
              <FolderLock size={48} color="#dc3545" />
              <p>Upload Private Manuscripts</p>
              <span>Secure storage - visible to admin only</span>
              <input type="file" id="privateUpload" multiple style={{ display: 'none' }} onChange={(e) => setUploadedPrivateFiles(prev => [...prev, ...Array.from(e.target.files)])} />
              <button className="upload-button private-button" onClick={() => document.getElementById('privateUpload').click()}>Upload Private Files</button>
            </div>
            
            {/* ADDED: Private Manuscript Collection Gallery */}
            <div className="private-collection">
              <h3 className="collection-title">Private Manuscript Collection</h3>
              <div className="manuscript-gallery">
                <div className="manuscript-card amber">
                  <div className="manuscript-preview">
                    <FileText size={40} />
                    <p className="manuscript-title">Ancient Prayer Text</p>
                    <p className="manuscript-date">12th Century</p>
                  </div>
                  <div className="manuscript-info">
                    <p className="manuscript-name">Sacred Mantras Collection</p>
                    <p className="access-label">Restricted Access</p>
                  </div>
                </div>
                
                <div className="manuscript-card blue">
                  <div className="manuscript-preview">
                    <FileText size={40} />
                    <p className="manuscript-title">Ritual Manuscript</p>
                    <p className="manuscript-date">14th Century</p>
                  </div>
                  <div className="manuscript-info">
                    <p className="manuscript-name">Ceremonial Procedures</p>
                    <p className="access-label">Restricted Access</p>
                  </div>
                </div>
                
                <div className="manuscript-card purple">
                  <div className="manuscript-preview">
                    <FileText size={40} />
                    <p className="manuscript-title">Sacred Geometry</p>
                    <p className="manuscript-date">15th Century</p>
                  </div>
                  <div className="manuscript-info">
                    <p className="manuscript-name">Tantric Diagrams</p>
                    <p className="access-label">Restricted Access</p>
                  </div>
                </div>
                
                <div className="manuscript-card green">
                  <div className="manuscript-preview">
                    <FileText size={40} />
                    <p className="manuscript-title">Meditation Guide</p>
                    <p className="manuscript-date">13th Century</p>
                  </div>
                  <div className="manuscript-info">
                    <p className="manuscript-name">Advanced Practices</p>
                    <p className="access-label">Restricted Access</p>
                  </div>
                </div>
                
                <div className="manuscript-card red">
                  <div className="manuscript-preview">
                    <FileText size={40} />
                    <p className="manuscript-title">Secret Teachings</p>
                    <p className="manuscript-date">11th Century</p>
                  </div>
                  <div className="manuscript-info">
                    <p className="manuscript-name">Esoteric Knowledge</p>
                    <p className="access-label">Restricted Access</p>
                  </div>
                </div>
                
                <div className="manuscript-card yellow">
                  <div className="manuscript-preview">
                    <FileText size={40} />
                    <p className="manuscript-title">Historical Records</p>
                    <p className="manuscript-date">16th Century</p>
                  </div>
                  <div className="manuscript-info">
                    <p className="manuscript-name">Monastery Chronicles</p>
                    <p className="access-label">Restricted Access</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="security-notice">
              <p><strong>🔒 Admin Only Access</strong></p>
              <p>These manuscripts are not visible to public users and require special permissions to view.</p>
              <p className="upload-total">Private collection: <strong>{mockData.privateManuscripts + uploadedPrivateFiles.length} manuscripts</strong></p>
            </div>
            
            {uploadedPrivateFiles.length > 0 && (
              <ul className="uploaded-files-list">{uploadedPrivateFiles.map((f, idx) => <li key={idx}>{f.name}</li>)}</ul>
            )}
          </div>
        );
      
      case 'reviews': 
        return (
          <div className="content-section">
            <h2 className="content-title">Monastery Reviews</h2>
            <div className="reviews-summary">
              <Star size={24} color="#ffc107" />
              <strong>{mockData.avgRating}</strong>
              <span>({mockData.totalReviews} reviews)</span>
            </div>
            <div className="reviews-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="review-card">
                  <div className="review-avatar"><User size={24} /></div>
                  <div className="review-content">
                    <div className="review-header">
                      <strong>Visitor {i}</strong>
                      <div className="review-stars">{[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#ffc107" stroke="none" />)}</div>
                    </div>
                    <p>Amazing experience visiting this monastery. The digital archive is incredible and well-preserved.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'engagement': 
        return (
          <div className="content-section">
            <h2 className="content-title">User Engagement</h2>
            <div className="engagement-grid">
              <div className="engagement-card">
                <Users size={40} color="#007bff" />
                <p className="engagement-value">{mockData.activeMembers}</p>
                <p>Active Members</p>
              </div>
              <div className="engagement-card">
                <Calendar size={40} color="#28a745" />
                <p className="engagement-value">{mockData.recentEvents}</p>
                <p>Events This Month</p>
              </div>
              <div className="engagement-card">
                <Eye size={40} color="#6f42c1" />
                <p className="engagement-value">2,847</p>
                <p>Page Views</p>
              </div>
            </div>
          </div>
        );
      
      case 'proposals': 
        return (
          <div className="proposals-container">
            <div className="proposals-header">
              <h2 className="content-title">Event Proposals</h2>
              <select className="proposals-sort">
                <option>Sort by Date</option>
                <option>Sort by NGO</option>
                <option>Sort by Status</option>
              </select>
            </div>
            {proposals.map(p => (
              <div key={p.id} className="proposal-card">
                <div className="proposal-header">
                  <div>
                    <h3>{p.eventTitle}</h3>
                    <p className="ngo-name">{p.ngoName}</p>
                  </div>
                  <span className={`proposal-status status-${p.status}`}>{p.status}</span>
                </div>
                <p className="proposal-description">{p.description}</p>
                <div className="proposal-details-grid">
                  <div><p>Date</p><strong>{p.date}</strong></div>
                  <div><p>Duration</p><strong>{p.duration}</strong></div>
                  <div><p>Participants</p><strong>{p.expectedParticipants}</strong></div>
                  <div><p>Budget</p><strong>{p.budget}</strong></div>
                </div>
                {p.status === 'pending' && (
                  <div className="proposal-actions">
                    <button onClick={() => handleProposalAction(p.id, 'accepted')} className="action-button accept-button">
                      <Check size={16} /> Accept
                    </button>
                    <button onClick={() => handleProposalAction(p.id, 'rejected')} className="action-button reject-button">
                      <X size={16} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'donations': 
        return (
          <div className="content-section">
            <h2 className="content-title">Donation Overview</h2>
            <div className="donations-summary-grid">
              <div className="donation-card total">
                <h3>Total Donations</h3>
                <p>${mockData.totalDonations.toLocaleString()}</p>
                <span>All time</span>
              </div>
              <div className="donation-card monthly">
                <h3>This Month</h3>
                <p>${mockData.monthlyDonations.toLocaleString()}</p>
                <span>+12% from last month</span>
              </div>
            </div>
            <div className="recent-donations">
              <h3>Recent Donations</h3>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="donation-item">
                  <div>
                    <p className="donor-name">Anonymous Donor {i}</p>
                    <p className="donation-date">2024-01-{15 + i}</p>
                  </div>
                  <p className="donation-amount">${(Math.random() * 1000 + 100).toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div className="content-section"><p>Select a section from the sidebar.</p></div>;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="sidebar desktop-sidebar">
        <h2 className="dashboard-logo">Monastery360</h2>
        <SidebarNav />
      </aside>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <aside className={`sidebar mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 className="dashboard-logo">Monastery360</h2>
        <SidebarNav />
      </aside>
      <div className="main-content-wrapper">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="mobile-menu-button" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <h1 className="header-title">{sidebarItems.find(item => item.id === activeSection)?.label}</h1>
          </div>
          <div className="header-right">
            <div className="notification-icon" onClick={() => setShowNotifications(prev => !prev)}>
              <Bell size={24} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              {showNotifications && (
                <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <span>Notifications</span>
                    <button onClick={markAllAsRead}>Mark all as read</button>
                  </div>
                  <ul>
                    {notifications.map(n => 
                      <li key={n.id} className={n.read ? 'read' : 'unread'}>{n.message}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="profile-section" onClick={() => setShowProfileEditor(true)}>
              <div className="profile-avatar">
                {profile.picture ? 
                  <img src={profile.picture} alt="avatar" className="avatar-img"/> : 
                  <User size={20} color="white" />
                }
              </div>
              <span className="profile-name">{profile.name}</span>
              <ChevronDown size={16}/>
            </div>
          </div>
        </header>
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
      {showProfileEditor && (
        <div className="profile-modal-overlay" onClick={() => setShowProfileEditor(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <label>
              Change Picture
              <input type="file" onChange={handlePictureChange} />
            </label>
            <label>
              Name
              <input type="text" name="name" value={profile.name} onChange={handleProfileChange} />
            </label>
            <label>
              Email
              <input type="email" name="email" value={profile.email} onChange={handleProfileChange} />
            </label>
            <label>
              Number
              <input type="text" name="number" value={profile.number} onChange={handleProfileChange} />
            </label>
            <div className="modal-actions">
              <button className="save-btn" onClick={() => setShowProfileEditor(false)}>
                <Check size={16}/> Save
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={16}/> Logout
              </button>
              <button className="cancel-btn" onClick={() => setShowProfileEditor(false)}>
                <X size={16}/> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;