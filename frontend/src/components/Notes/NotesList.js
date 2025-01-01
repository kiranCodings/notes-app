import React, { useEffect, useState } from 'react';
import { fetchNotes, deleteNote } from '../../api';
import NoteEditor from './NoteEditor';
import NoteView from './NoteView';
import './Notes.css';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const { data } = await fetchNotes();
        setNotes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setLoading(false);
      }
    };

    fetchAllNotes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const getSentimentEmoji = (sentiment = 'Neutral') => {
    switch (sentiment) {
      case 'Positive':
        return '😊';
      case 'Negative':
        return '😢';
      default:
        return '😐';
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
      <div className="notes-container">
        <div className="notes-header">
          <h2>My Notes</h2>
          <button onClick={() => setEditingNote({})} className="add-button">
            <span className="plus-icon">+</span> New Note
          </button>
        </div>

        {/* Editor Overlay */}
        {editingNote && (
          <div className="editor-overlay">
            <NoteEditor
              note={editingNote}
              setEditingNote={setEditingNote}
              setNotes={setNotes}
            />
          </div>
        )}

        {/* View Modal */}
        {viewingNote && (
          <NoteView note={viewingNote} closeView={() => setViewingNote(null)} />
        )}

        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note._id} className="note-card">
              {note.categories && note.categories.length > 0 && (
                <div className="category-chips">
                  {note.categories.slice(0, 2).map((category, index) => (
                    <span key={index} className="category-chip">
                      {category}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="note-title">{note.title}</h3>
              <p className="note-content">{note.summary}</p>
              <div className={`sentiment-badge ${note.sentiment?.toLowerCase() || 'neutral'}`}>
                {getSentimentEmoji(note.sentiment)} {note.sentiment || 'Neutral'}
              </div>
              <div className="note-actions">
                <button
                  onClick={() => setViewingNote(note)}
                  className="action-button view-button"
                >
                  🖥 View
                </button>
                <button
                  onClick={() => setEditingNote(note)}
                  className="action-button edit-button"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="action-button delete-button"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotesList;
