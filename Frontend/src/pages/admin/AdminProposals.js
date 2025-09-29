import React, { useState } from 'react';
import './AdminProposals.css';

// MOCK DATA
const initialProposals = [
    { id: 1, ngoName: 'Himalayan Heritage Foundation', event: 'Cultural Fest 2025', date: '2025-10-22', status: 'pending' },
    { id: 2, ngoName: 'Sikkim Arts Council', event: 'Meditation Workshop', date: '2025-11-05', status: 'pending' }
];

const AdminProposals = () => {
    const [proposals, setProposals] = useState(initialProposals);

    const handleStatusChange = (id, newStatus) => {
        setProposals(proposals.map(p => 
            p.id === id ? { ...p, status: newStatus } : p
        ));
        // In a real app, this would be an API call to the backend.
        alert(`Proposal ${id} has been ${newStatus}.`);
    };

    return (
        <div className="proposals-page">
            <h1>Event Proposals</h1>
            <div className="proposal-list">
                {proposals.map(proposal => (
                    <div key={proposal.id} className={`proposal-card status-${proposal.status}`}>
                        <h3>{proposal.event}</h3>
                        <p><strong>From:</strong> {proposal.ngoName}</p>
                        <p><strong>Proposed Date:</strong> {proposal.date}</p>
                        <p><strong>Status:</strong> <span className="status-badge">{proposal.status}</span></p>
                        {proposal.status === 'pending' && (
                            <div className="proposal-actions">
                                <button onClick={() => handleStatusChange(proposal.id, 'accepted')} className="btn-accept">Accept</button>
                                <button onClick={() => handleStatusChange(proposal.id, 'rejected')} className="btn-reject">Reject</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProposals;