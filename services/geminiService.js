const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummary = async (content) => {
  try {
    // Updated model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Please provide a concise summary of the following document content in 2-3 sentences:

${content}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Summary generation error:', error);
    throw new Error('Failed to generate summary');
  }
};

const generateTags = async (content) => {
  try {
    // Updated model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Analyze the following document content and generate 3-5 relevant tags. Return only the tags separated by commas, no additional text:

${content}

Tags:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tagsText = response.text().trim();
    
    return tagsText.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  } catch (error) {
    console.error('Tag generation error:', error);
    throw new Error('Failed to generate tags');
  }
};

const generateEmbedding = async (text) => {
  try {
    // Updated embedding model name
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
    // Updated model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Create context from documents
    const context = documents.map(doc => 
      `Title: ${doc.title}\nContent: ${doc.content}\nTags: ${doc.tags.join(', ')}\n---`
    ).join('\n');

    const prompt = `Based on the following knowledge base documents, please answer the question. If the answer cannot be found in the documents, please say so.

Knowledge Base:
${context}

Question: ${question}

Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Q&A error:', error);
    throw new Error('Failed to answer question');
  }
};

// Test function to verify API connection
const testConnection = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hello, test message');
    console.log('✅ Gemini API working:', result.response.text());
    return true;
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
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