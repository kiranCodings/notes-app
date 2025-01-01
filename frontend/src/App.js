import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NotesList from './components/Notes/NotesList';
import { useAuth } from './context/AuthContext';
import ViewNote from './components/Notes/NoteView';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/notes" element={<PrivateRoute><NotesList /></PrivateRoute>} />
      <Route path="/notes/:id" element={<PrivateRoute><ViewNote /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
