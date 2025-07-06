import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) console.error('Error fetching projects:', error);
      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
    
    // Real-time updates
    const subscription = supabase
      .from('projects')
      .on('*', payload => {
        if (payload.eventType === 'INSERT' && payload.new.user_id === user.id) {
          setProjects(prev => [payload.new, ...prev]);
        }
      })
      .subscribe();
    
    return () => supabase.removeSubscription(subscription);
  }, [user]);

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Pitch Projects</h1>
      
      {projects.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No projects created yet</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create First Pitch
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2 truncate">{project.idea}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {project.content}
              </p>
              <div className="flex space-x-2">
                <a 
                  href={`/editor/${project.id}`} 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit Pitch
                </a>
                <a 
                  href={`/api/export/pdf/${project.id}`} 
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Export PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;