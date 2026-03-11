require('dotenv').config();

console.log('🔍 Environment Test:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('PORT:', process.env.PORT || '5000 (default)');

// Test Gemini API
if (process.env.GEMINI_API_KEY) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  
  const testGemini = async () => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const result = await model.generateContent('Say hello');
      const response = await result.response;
      console.log('🤖 Gemini API Test: ✅ Working');
      console.log('Response:', response.text().substring(0, 50) + '...');
    } catch (error) {
      console.log('🤖 Gemini API Test: ❌ Failed');
      console.error('Error:', error.message);
    }
  };
  
  testGemini();
}