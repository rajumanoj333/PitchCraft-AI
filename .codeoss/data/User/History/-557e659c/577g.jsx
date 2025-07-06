import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const CollaborationPanel = ({ projectId }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollaborators = async () => {
      const { data, error } = await supabase
        .from('project_collaborators')
        .select('email')
        .eq('project_id', projectId);
      
      if (error) console.error('Error fetching collaborators:', error);
      setCollaborators(data?.map(c => c.email) || []);
    };

    fetchCollaborators();
    
    // Real-time presence tracking
    const channel = supabase.channel(`collab:${projectId}`);
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setCollaborators(Object.keys(state).map(key => state[key][0].email));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ email: supabase.auth.user().email });
        }
      });
    
    return () => {
      channel.unsubscribe();
    };
  }, [projectId]);

  const addCollaborator = async () => {
    if (!newEmail) return;
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase
        .from('project_collaborators')
        .insert([{ project_id: projectId, email: newEmail }]);
      
      if (error) throw error;
      
      setCollaborators(prev => [...prev, newEmail]);
      setNewEmail('');
    } catch (err) {
      setError('Failed to add collaborator: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
      
      <div className="flex">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter email"
          className="flex-1 p-2 border rounded-l text-sm"
          disabled={loading}
        />
        <button
          onClick={addCollaborator}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-2 rounded-r text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
      
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default CollaborationPanel;