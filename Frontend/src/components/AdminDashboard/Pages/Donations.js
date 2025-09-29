import React from 'react';
import { DollarSign } from 'lucide-react';

// Mock data to simulate real information
const mockData = {
  totalDonations: 45750,
  monthlyDonations: 8900,
};

const recentDonations = [
    { id: 1, donor: 'Anonymous Donor', date: '2024-09-22', amount: 250 },
    { id: 2, donor: 'Jane Cooper', date: '2024-09-21', amount: 100 },
    { id: 3, donor: 'Tenzin Gyatso', date: '2024-09-21', amount: 501 },
    { id: 4, donor: 'Anonymous Donor', date: '2024-09-20', amount: 50 },
    { id: 5, donor: 'Michael Johnson', date: '2024-09-19', amount: 150 },
];

const Donations = () => (
    <div className="bg-white p-8 rounded-lg border">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
            <DollarSign className="h-6 w-6 mr-3 text-green-600" />
            Donation Overview
        </h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-medium text-green-800 mb-2">Total Donations</h3>
                <p className="text-3xl font-bold text-green-600">${mockData.totalDonations.toLocaleString()}</p>
                <p className="text-sm text-green-700 mt-1">All time</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-800 mb-2">This Month</h3>
                <p className="text-3xl font-bold text-blue-600">${mockData.monthlyDonations.toLocaleString()}</p>
                <p className="text-sm text-blue-700 mt-1">+12% from last month</p>
            </div>
        </div>
        
        {/* Recent Donations List */}
        <div>
            <h3 className="text-lg font-medium mb-4">Recent Donations</h3>
            <div className="space-y-2">
                {recentDonations.map((donation) => (
                    <div key={donation.id} className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 border-b last:border-b-0">
                        <div>
                            <p className="font-medium">{donation.donor}</p>
                            <p className="text-sm text-gray-600">{donation.date}</p>
                        </div>
                        <p className="text-lg font-semibold text-green-600">${donation.amount.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default Donations;

