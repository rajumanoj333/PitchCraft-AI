import React, { useState } from 'react';

const CollaborationPanel = () => {
  const [collaborators] = useState(['user1@example.com', 'user2@example.com']);
  
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-bold mb-3">Collaborators</h3>
      <div className="mb-4">
        {collaborators.map((email, index) => (
          <div key={index} className="flex items-center py-2 border-b border-gray-200">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-2" />
            <span className="text-sm">{email}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationPanel;