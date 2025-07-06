import React from 'react';
import { useParams } from 'react-router-dom';
import CollaborationPanel from './CollaborationPanel';

const PitchEditor = () => {
  const { projectId } = useParams();
  
  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Pitch Editor</h2>
        <p>Project ID: {projectId}</p>
      </div>
      
      <div className="w-2/4 p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 h-full">
          <h2 className="text-2xl font-bold mb-4">Slide Content</h2>
          <div className="border rounded-lg p-4 min-h-[400px]">
            Edit your slide content here...
          </div>
        </div>
      </div>
      
      <div className="w-1/4 border-l p-4">
        <CollaborationPanel projectId={projectId} />
      </div>
    </div>
  );
};

export default PitchEditor;