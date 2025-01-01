const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    categories: { type: [String], default: [] },
    sentiment: { type: String, default: 'Neutral' }, // Add sentiment field
    summary: { type: String, default: '' } // Add summary field
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
