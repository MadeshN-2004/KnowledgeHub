const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const searchRoutes = require('./routes/search');
const aiRoutes = require('./routes/ai');

// Import Gemini test functions
const { testConnection, listModels } = require('./services/geminiService');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Test Gemini API connection on startup
  console.log('\n🔍 Testing Gemini API connection...');
  try {
    const isWorking = await testConnection();
    if (isWorking) {
      console.log('✅ Gemini API connection successful');
      // Optionally list available models
      
    } else {
      console.log('❌ Gemini API connection failed');
    }
  } catch (error) {
    console.log('❌ Gemini API test error:', error.message);
    console.log('💡 Check your GEMINI_API_KEY in .env file');
  }
  
  console.log('\n📱 Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:3000');
  console.log('🔗 Server ready at: http://localhost:' + PORT);
});