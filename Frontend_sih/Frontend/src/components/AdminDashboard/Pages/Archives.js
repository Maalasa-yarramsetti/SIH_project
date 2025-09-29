import React from 'react';
import { Upload } from 'lucide-react';

const Archives = () => (
  <div className="bg-white p-8 rounded-lg border">
    <h2 className="text-xl font-semibold mb-6">Upload Archives</h2>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-lg mb-2">Upload archive files</p>
      <p className="text-sm text-gray-600 mb-4">Drag and drop files or click to browse</p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Select Files
      </button>
    </div>
  </div>
);

export default Archives;
