import React from 'react';
import { Users } from 'lucide-react';

const Engagement = () => (
    <div className="bg-white p-8 rounded-lg border">
        <h2 className="text-xl font-semibold mb-6">User Engagement</h2>
        <div className="text-center text-gray-500">
            <Users className="h-16 w-16 mx-auto mb-4" />
            <p>User engagement analytics coming soon.</p>
        </div>
    </div>
);

export default Engagement;
