import React from "react";
import "./NoteView.css";

const NoteView = ({ note, closeView }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{note.title}</h3>
          <button className="modal-close" onClick={closeView}>&times;</button>
                  </div>

        <div className="modal-content">
          <div
            className="content-wrapper"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          <div className="meta-row">
          {note.categories && note.categories.length > 0 && (
  <div className="category-chips">
    {note.categories.map((category, index) => (
      <span key={index} className="category-chip">
        <span className="category-icon">🏷</span>
        {category}
      </span>
    ))}
  </div>
)}

            <div className="timestamp">
              <span className="meta-icon">🕒</span>
              {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteView;
