const express = require('express');
const { body, validationResult } = require('express-validator');
const Document = require('../models/Document');
const { auth, adminAuth } = require('../middleware/auth');
const { generateEmbedding } = require('../services/geminiService');

const router = express.Router();

// Get all documents with pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const documents = await Document.find()
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Document.countDocuments();

    res.json({
      documents,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent activity
router.get('/activity', auth, async (req, res) => {
  try {
    const recentDocs = await Document.find()
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title createdBy updatedAt');

    res.json(recentDocs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single document
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create document
router.post('/', [auth, [
  body('title').trim().isLength({ min: 1 }),
  body('content').trim().isLength({ min: 1 })
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags = [] } = req.body;

    const document = new Document({
      title,
      content,
      tags,
      createdBy: req.user._id
    });

    // Generate embedding for semantic search
    try {
      document.embedding = await generateEmbedding(content);
    } catch (embeddingError) {
      console.error('Embedding generation failed:', embeddingError);
    }

    await document.save();
    await document.populate('createdBy', 'name email');

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update document
router.put('/:id', [auth, [
  body('title').trim().isLength({ min: 1 }),
  body('content').trim().isLength({ min: 1 })
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check authorization
    if (document.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, tags, summary } = req.body;

    document.title = title;
    document.content = content;
    document.tags = tags || [];
    if (summary) document.summary = summary;

    // Generate new embedding
    try {
      document.embedding = await generateEmbedding(content);
    } catch (embeddingError) {
      console.error('Embedding generation failed:', embeddingError);
    }

    await document.save();
    await document.populate('createdBy', 'name email');

    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check authorization
    if (document.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get document versions
router.get('/:id/versions', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document.versions.sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;