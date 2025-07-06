import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Dashboard from './components/Dashboard';
import IdeaForm from './components/IdeaForm';
import PitchEditor from './components/PitchEditor';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<IdeaForm />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/editor/:projectId" element={
          <PrivateRoute><PitchEditor /></PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;