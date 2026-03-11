const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const API_KEY = process.env.GEMINI_API_KEY;

const generateSummary = async (content) => {
  try {
    const prompt = `Please provide a concise summary of the following document content in 2-3 sentences:\n\n${content}\n\nSummary:`;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    
    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Summary generation error:', error.response?.data || error.message);
    throw new Error('Failed to generate summary');
  }
};

const generateTags = async (content) => {
  try {
    const prompt = `Analyze the following document content and generate 3-5 relevant tags. Return only the tags separated by commas, no additional text:\n\n${content}\n\nTags:`;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    
    const tagsText = response.data.candidates[0].content.parts[0].text.trim();
    return tagsText.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  } catch (error) {
    console.error('Tag generation error:', error.response?.data || error.message);
    throw new Error('Failed to generate tags');
  }
};

const generateEmbedding = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Embedding generation error:', error);
    // Return empty array if embedding fails
    return [];
  }
};

const answerQuestion = async (question, documents) => {
  try {
    const context = documents.map(doc => 
      `Title: ${doc.title}\nContent: ${doc.content}\nTags: ${doc.tags.join(', ')}\n---`
    ).join('\n');

    const prompt = `Based on the following knowledge base documents, please answer the question. If the answer cannot be found in the documents, please say so.\n\nKnowledge Base:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    
    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Q&A error:', error.response?.data || error.message);
    throw new Error('Failed to answer question');
  }
};

const testConnection = async () => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('⚠️  Gemini API key not configured - AI features will be disabled');
      return false;
    }
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: 'Hello' }] }]
      }
    );
    
    console.log('✅ Gemini API connection successful');
    return true;
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.response?.data || error.message);
    console.log('⚠️  AI features will be disabled. App will work without AI functionality.');
    return false;
  }
};

// Note: listModels not available in this version of the library

// Cosine similarity function
const cosineSimilarity = (a, b) => {
  if (!a || !b || a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

module.exports = {
  generateSummary,
  generateTags,
  generateEmbedding,
  answerQuestion,
  cosineSimilarity,
  testConnection
};