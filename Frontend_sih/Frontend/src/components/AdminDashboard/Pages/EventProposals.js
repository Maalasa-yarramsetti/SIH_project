import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const EventProposals = () => {
    const [proposals, setProposals] = useState([
        {
          id: 1,
          ngoName: "Heritage Foundation",
          eventTitle: "Cultural Heritage Workshop",
          description: "Educational workshop on preserving ancient manuscripts and cultural artifacts",
          date: "2024-01-15",
          duration: "3 days",
          expectedParticipants: 50,
          budget: "$2,500",
          status: "pending"
        },
        {
          id: 2,
          ngoName: "Digital Preservation Society",
          eventTitle: "Manuscript Digitization Training",
          description: "Training session for monks on digital preservation techniques",
          date: "2024-01-10",
          duration: "2 days",
          expectedParticipants: 30,
          budget: "$1,800",
          status: "pending"
        },
        {
          id: 3,
          ngoName: "Community Outreach Network",
          eventTitle: "Meditation & Mindfulness Retreat",
          description: "Weekend retreat focusing on traditional meditation practices",
          date: "2024-01-08",
          duration: "2 days",
          expectedParticipants: 75,
          budget: "$3,200",
          status: "accepted"
        }
      ]);
    
      const handleProposalAction = (proposalId, action) => {
        setProposals(prev => prev.map(proposal => 
          proposal.id === proposalId 
            ? { ...proposal, status: action }
            : proposal
        ));
        console.log(`NGO notified: Proposal ${proposalId} ${action}`);
      };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Event Proposals</h2>
        <select className="border rounded-lg px-3 py-2">
          <option>Sort by Date</option>
          <option>Sort by NGO</option>
          <option>Sort by Status</option>
        </select>
      </div>
      <div className="grid gap-6">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{proposal.eventTitle}</h3>
                <p className="text-blue-600 font-medium">{proposal.ngoName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {proposal.status}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{proposal.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">{proposal.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Duration</p>
                <p className="font-medium">{proposal.duration}</p>
              </div>
              <div>
                <p className="text-gray-500">Participants</p>
                <p className="font-medium">{proposal.expectedParticipants}</p>
              </div>
              <div>
                <p className="text-gray-500">Budget</p>
                <p className="font-medium">{proposal.budget}</p>
              </div>
            </div>
            {proposal.status === 'pending' && (
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleProposalAction(proposal.id, 'accepted')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept
                </button>
                <button 
                  onClick={() => handleProposalAction(proposal.id, 'rejected')}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventProposals;

