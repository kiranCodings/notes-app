const Note = require('../models/Note');
const axios = require('axios');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// Utility function to strip HTML tags
const stripHtmlTags = (str) => (str ? str.toString().replace(/<[^>]*>/g, '') : '');

// Analyze Sentiment
const analyzeSentiment = async (content) => {
  try {
    const cleanedContent = stripHtmlTags(content);
    const result = sentiment.analyze(cleanedContent);

    // Determine sentiment based on score
    const sentimentScore = result.score;
    let sentimentLabel;

    if (sentimentScore > 0) {
      sentimentLabel = 'Positive';
    } else if (sentimentScore < 0) {
      sentimentLabel = 'Negative';
    } else {
      sentimentLabel = 'Neutral';
    }

    return sentimentLabel;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return 'Neutral';
  }
};

// Summarize Note
const summarizeNote = async (content) => {
  try {
    const cleanedContent = stripHtmlTags(content);

    const { data } = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        inputs: `Generate a concise summary under 15 words: ${cleanedContent}`,
        parameters: {
          max_length: 15,
          min_length: 5,
          length_penalty: 4.0,
          temperature: 0.3,
          no_repeat_ngram_size: 2,
          num_beams: 4
        }
      },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );

    const summary = data[0].summary_text?.replace(/^(generate|summarize|summary).*?:/i, '').trim() || 'Summary unavailable';
    return summary;
  } catch (error) {
    console.error('Error summarizing note:', error);
    return 'Summary unavailable';
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createNote = async (req, res) => {
  const { title, content, categories } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required to create a note' });
  }

  try {
    const sentimentLabel = await analyzeSentiment(content);
    const summary = await summarizeNote(content);
    const note = await Note.create({
      user: req.user.id,
      title,
      content,
      categories,
      sentiment: sentimentLabel || 'Neutral',
      summary
    });
    res.status(201).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, categories } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required to update a note' });
  }

  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const sentimentLabel = await analyzeSentiment(content);
    const summary = await summarizeNote(content);
    note.title = title;
    note.content = content;
    note.categories = categories || [];
    note.sentiment = sentimentLabel || 'Neutral';
    note.summary = summary;
    await note.save();

    res.json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await Note.deleteOne({ _id: id });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote, analyzeSentiment, summarizeNote };
