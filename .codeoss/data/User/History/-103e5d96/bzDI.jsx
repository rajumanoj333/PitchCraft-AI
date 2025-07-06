// src/components/PitchEditor.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { getProject, saveProject } from '../services/apiService';
import SlidePreview from './SlidePreview';
import CollaborationPanel from './CollaborationPanel';

const PitchEditor = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      const projectData = await getProject(projectId, user.access_token);
      setProject(projectData);
    };

    fetchProject();
    
    // Real-time collaboration setup
    const subscription = supabase
      .from(`projects:id=eq.${projectId}`)
      .on('UPDATE', payload => {
        if (payload.new.updated_by !== user.id) {
          setProject(payload.new.pitch_data);
        }
      })
      .subscribe();

    return () => supabase.removeSubscription(subscription);
  }, [projectId, user]);

  const handleSlideChange = (index, content) => {
    const updatedSlides = [...project.slides];
    updatedSlides[index] = { ...updatedSlides[index], content };
    
    setProject({ ...project, slides: updatedSlides });
    saveProject(projectId, { slides: updatedSlides }, user.access_token);
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Slide List */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        {project.slides.map((slide, index) => (
          <div 
            key={index}
            className={`p-4 mb-2 rounded-lg cursor-pointer ${
              index === activeSlide ? 'bg-blue-100 border-blue-500 border-2' : 'bg-white'
            }`}
            onClick={() => setActiveSlide(index)}
          >
            <h3 className="font-bold">{slide.title}</h3>
          </div>
        ))}
      </div>
      
      {/* Slide Editor */}
      <div className="w-2/4 p-6">
        <SlidePreview 
          slide={project.slides[activeSlide]} 
          onChange={(content) => handleSlideChange(activeSlide, content)}
        />
      </div>
      
      {/* Collaboration Panel */}
      <div className="w-1/4 border-l p-4">
        <CollaborationPanel 
          projectId={projectId} 
          userId={user.id} 
          collaborators={collaborators} 
        />
        
        <ExportOptions projectId={projectId} token={user.access_token} />
      </div>
    </div>
  );
};

export default PitchEditor;