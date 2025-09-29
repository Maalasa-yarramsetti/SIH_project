import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Heart, ArrowRight, Twitter, Instagram, Facebook, X, Eye, BookOpen, Users } from 'lucide-react';
import './ContactUs.css';

// --- Reusable Modal Component ---
const ContactModal = ({ isOpen, onClose, contact, handleContactChange, handleContactSubmit }) => {
    if (!isOpen) return null;

    return (
        <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className="modal-content"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="modal-header">
                    <h3>Send us a Message</h3>
                    <button onClick={onClose} className="close-button" aria-label="Close modal"><X size={24} /></button>
                </div>
                <form className="contact-form" onSubmit={handleContactSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input type="text" id="name" name="name" required value={contact.name} onChange={handleContactChange} placeholder="John Doe"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Your Email</label>
                        <input type="email" id="email" name="email" required value={contact.email} onChange={handleContactChange} placeholder="john.doe@example.com"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Your Message</label>
                        <textarea id="message" name="message" rows="5" required value={contact.message} onChange={handleContactChange} placeholder="Write your message here..."></textarea>
                    </div>
                    <button type="submit" className="send-button">Send Message</button>
                </form>
            </motion.div>
        </motion.div>
    );
};


// Dummy data for monasteries
const monasteries = [
  { id: 'rumtek', name: 'Rumtek Monastery' },
  { id: 'pemayangtse', name: 'Pemayangtse Monastery' },
  { id: 'tashiding', name: 'Tashiding Monastery' },
  { id: 'phensang', name: 'Phensang Monastery' },
  { id: 'dubdi', name: 'Dubdi Monastery' },
];

const ContactUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donation, setDonation] = useState({ monastery: monasteries[0].id, amount: '' });
  const [contact, setContact] = useState({ name: '', email: '', message: '' });

  const handleDonationChange = (e) => {
    const { name, value } = e.target;
    setDonation(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    if (!donation.amount || donation.amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    console.log(`Redirecting for donation of ₹${donation.amount} to ${donation.monastery}`);
    alert(`Thank you! You would now be redirected to a secure payment page.`);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contact);
    alert('Thank you for your message! We will get back to you soon.');
    setContact({ name: '', email: '', message: '' });
    setIsModalOpen(false); // Close modal on submit
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  // Effect to prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => document.body.style.overflow = 'unset';
  }, [isModalOpen]);


  return (
    <>
      <div className="contact-us-container">
          <motion.div 
              className="contact-us-page"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={{ duration: 0.5 }}
          >
              <header className="contact-header">
                  <h1>Connect & Contribute</h1>
                  <p>Preserving the spiritual and cultural heritage of Sikkimese monasteries for future generations.</p>
              </header>
              
              {/* --- Mission Section --- */}
              <section className="mission-section">
                  <h2>Our Mission</h2>
                  <p>
                  Monastery 360 is a non-profit initiative dedicated to the digital preservation and global showcasing of Sikkim's monastic heritage through immersive 360° virtual tours, detailed archival data, and community engagement.
                  </p>
              </section>

              {/* --- NEW Impact Section --- */}
              <section className="impact-section">
                <h2>Our Impact</h2>
                <div className="impact-grid">
                  <div className="impact-card">
                    <Eye size={32} className="impact-icon" />
                    <span className="impact-number">500,000+</span>
                    <span className="impact-label">Virtual Visits</span>
                  </div>
                  <div className="impact-card">
                    <BookOpen size={32} className="impact-icon" />
                    <span className="impact-number">10,000+</span>
                    <span className="impact-label">Archived Manuscripts</span>
                  </div>
                  <div className="impact-card">
                    <Users size={32} className="impact-icon" />
                    <span className="impact-number">50+</span>
                    <span className="impact-label">Communities Engaged</span>
                  </div>
                </div>
              </section>
              
              {/* --- Donation Section --- */}
              <section className="donation-section">
                  <div className="donation-content">
                      <Heart className="donation-icon" size={40} />
                      <h2>Support a Monastery</h2>
                      <p>Your contribution directly supports the maintenance, preservation, and community programs of these sacred sites.</p>
                      <form className="donation-form" onSubmit={handleDonationSubmit}>
                          <div className="form-group">
                              <label htmlFor="monastery">Choose a Monastery</label>
                              <select id="monastery" name="monastery" value={donation.monastery} onChange={handleDonationChange}>
                                  {monasteries.map(m => (
                                      <option key={m.id} value={m.id}>{m.name}</option>
                                  ))}
                              </select>
                          </div>
                          <div className="form-group">
                              <label htmlFor="amount">Enter Amount (INR)</label>
                              <input 
                                  type="number" 
                                  id="amount" 
                                  name="amount"
                                  placeholder="e.g., 501" 
                                  value={donation.amount}
                                  onChange={handleDonationChange}
                                  min="10"
                              />
                          </div>
                          <button type="submit" className="donate-button">
                              Donate Now <ArrowRight size={20} />
                          </button>
                      </form>
                  </div>
              </section>
          </motion.div>

          {/* --- Unified Footer --- */}
          <footer className="site-footer">
              <div className="footer-content">
                  <div className="footer-cta">
                    <h2>Get In Touch</h2>
                    <p>Have a question or a suggestion? We'd love to hear from you.</p>
                    <button className="open-modal-button" onClick={() => setIsModalOpen(true)}>Send us a Message</button>
                  </div>
                  <hr className="footer-divider" />
                  <div className="footer-bottom">
                      <div className="footer-contact-details">
                          <div className="info-item"><MapPin size={16} /><span>Gangtok, Sikkim, India</span></div>
                          <div className="info-item"><Mail size={16} /><span>connect@monastery360.org</span></div>
                          <div className="info-item"><Phone size={16} /><span>+91 98765 43210</span></div>
                      </div>
                      <div className="social-links">
                          <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                          <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                          <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                      </div>
                      <p className="copyright">&copy; 2025 Monastery 360. All Rights Reserved.</p>
                  </div>
              </div>
          </footer>
      </div>

      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={contact}
        handleContactChange={handleContactChange}
        handleContactSubmit={handleContactSubmit}
      />
    </>
  );
};

export default ContactUs;

