const express = require('express');
const Document = require('../models/Document');
const { auth } = require('../middleware/auth');
const { generateEmbedding, cosineSimilarity } = require('../services/geminiService');

const router = express.Router();

// Text search
router.get('/text', auth, async (req, res) => {
  try {
    const { q, tags } = req.query;
    
    let query = {};
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { summary: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const documents = await Document.find(query)
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 });

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Semantic search
router.post('/semantic', auth, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(query);
    
    // Get all documents with embeddings
    const documents = await Document.find({ embedding: { $exists: true, $ne: [] } })
      .populate('createdBy', 'name email');

    // Calculate similarity scores
    const documentsWithScores = documents.map(doc => ({
      ...doc.toObject(),
      similarity: cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    // Sort by similarity and return top results
    const results = documentsWithScores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Semantic search failed' });
  }
});

module.exports = router;