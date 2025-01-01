import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000' });

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const fetchNotes = (userId) => API.get(`/notes/${userId}`);
export const createNote = (data) => API.post('/notes', data);
