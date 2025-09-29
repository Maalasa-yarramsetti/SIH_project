import React from 'react';
import { FolderLock } from 'lucide-react';

const PrivateFolder = () => (
    <div className="bg-white p-8 rounded-lg border">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FolderLock className="h-6 w-6 mr-2" />
            Private Folder
        </h2>
        <div className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center bg-red-50">
            <FolderLock className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-lg mb-2">Upload Private Manuscripts</p>
            <p className="text-sm text-gray-600 mb-4">Secure storage - visible to admin only</p>
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                Upload Private Files
            </button>
        </div>
    </div>
);

export default PrivateFolder;
