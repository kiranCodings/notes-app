import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (formData) => API.post('/api/auth/login', formData);
export const register = (formData) => API.post('/api/auth/register', formData);
export const fetchNotes = () => API.get('/api/notes');
export const createNote = (noteData) => API.post('/api/notes', noteData);
export const updateNote = (id, noteData) => API.put(`/api/notes/${id}`, noteData);
export const deleteNote = (id) => API.delete(`/api/notes/${id}`);
