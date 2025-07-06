import React from 'react';

const Dashboard = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Pitch Projects</h1>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500 mb-4">No projects created yet</p>
        <a 
          href="/" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create First Pitch
        </a>
      </div>
    </div>
  );
};

export default Dashboard;