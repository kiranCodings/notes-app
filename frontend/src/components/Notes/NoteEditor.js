import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createNote, updateNote } from '../../api';
import { motion } from 'framer-motion';
import './NoteEditor.css';

const NoteEditor = ({ note, setEditingNote, setNotes }) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    categories: note?.categories || [], // Only categories array
  });
  const [categoryInput, setCategoryInput] = useState('');
  const [isSaving, setSaving] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    setCharacterCount(formData.content.replace(/<[^>]*>/g, '').length);
  }, [formData.content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = note._id
        ? await updateNote(note._id, formData)
        : await createNote(formData);
      setNotes((prev) =>
        note._id ? prev.map((n) => (n._id === note._id ? data : n)) : [...prev, data]
      );
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = (e) => {
    if (e.key === 'Enter' && categoryInput.trim()) {
      e.preventDefault();
      if (!formData.categories.includes(categoryInput.trim())) {
        setFormData({
          ...formData,
          categories: [...formData.categories, categoryInput.trim()],
        });
      }
      setCategoryInput('');
    }
  };

  const removeCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((category) => category !== categoryToRemove),
    });
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <motion.div
      className="editor-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="editor-modal"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <div className="editor-header">
          <h2>{note._id ? 'Edit Note' : 'Create Note'}</h2>
          <div className="editor-controls">
            <span className="character-count">{characterCount} characters</span>
            <button
              className="close-button"
              onClick={() => setEditingNote(null)}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Note Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="title-input"
              required
            />
          </div>

          <div className="form-group metadata-section">
            <div className="categories-container">
              <input
                type="text"
                placeholder="Add categories (press Enter)"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={handleAddCategory}
                className="category-input"
              />
              <div className="tags-list categories-list">
                {formData.categories.map((category) => (
                  <span key={category} className="tag category-tag">
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="remove-tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="editor-wrapper">
            <ReactQuill
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              modules={modules}
              theme="snow"
              placeholder="Write your note here..."
              className="custom-quill"
            />
          </div>

          <div className="editor-footer">
            <div className="editor-status">
              {isSaving && <span className="saving-indicator">Saving...</span>}
            </div>
            <div className="button-group">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setEditingNote(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-button"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : note._id ? 'Save Changes' : 'Create Note'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NoteEditor;
