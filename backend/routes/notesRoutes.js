const express = require('express');
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/notesController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for notes
router.get('/', protect, getNotes);               // Get all notes
router.post('/', protect, createNote);            // Create a new note
router.put('/:id', protect, updateNote);          // Update a specific note
router.delete('/:id', protect, deleteNote);      // Delete a specific note



  


module.exports = router;
