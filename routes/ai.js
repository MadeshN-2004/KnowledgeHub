const express = require('express');
const Document = require('../models/Document');
const { auth } = require('../middleware/auth');
const { 
  generateSummary,
  generateTags,
  answerQuestion,
  generateEmbedding 
} = require('../services/geminiService');

const router = express.Router();

// Generate summary
router.post('/summarize', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const summary = await generateSummary(content);
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate summary' });
  }
});

// Generate tags
router.post('/tags', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const tags = await generateTags(content);
    res.json({ tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate tags' });
  }
});

// Update document with AI-generated summary
router.put('/documents/:id/summary', auth, async (req, res) => {
  try {
    const { summary } = req.body;
    
    if (!summary) {
      return res.status(400).json({ message: 'Summary is required' });
    }

    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check authorization - same logic as your frontend canEdit function
    if (document.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this document' });
    }

    document.summary = summary;
    document.updatedAt = new Date();
    await document.save();
    
    // Populate the response
    await document.populate('createdBy', 'name email');

    res.json({ message: 'Summary updated successfully', document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update document with AI-generated tags
router.put('/documents/:id/tags', auth, async (req, res) => {
  try {
    const { tags } = req.body;
    
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags array is required' });
    }

    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check authorization
    if (document.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this document' });
    }

    // Merge new tags with existing ones, avoiding duplicates
    const existingTags = document.tags || [];
    const newTags = tags.filter(tag => !existingTags.includes(tag));
    document.tags = [...existingTags, ...newTags];
    document.updatedAt = new Date();
    
    await document.save();
    
    // Populate the response
    await document.populate('createdBy', 'name email');

    res.json({ message: 'Tags updated successfully', document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Q&A
router.post('/question', auth, async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Get all documents for context
    const documents = await Document.find()
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 });

    const answer = await answerQuestion(question, documents);
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to answer question' });
  }
});

module.exports = router;