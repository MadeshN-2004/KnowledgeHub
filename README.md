# KnowledgeHub - AI-Powered Collaborative Knowledge Management System

A full-stack web application for managing and organizing knowledge with AI-powered features including auto-summarization, intelligent tagging, semantic search, and Q&A capabilities.

## 🚀 Features

### Core Features
- **User Authentication** - Secure JWT-based authentication with role-based access control
- **Document Management** - Create, read, update, and delete knowledge documents
- **Version Control** - Automatic versioning of all document changes
- **Search Functionality** - Text-based and AI-powered semantic search
- **Tagging System** - Organize documents with custom tags
- **Activity Dashboard** - Track recent document updates and activities

### AI-Powered Features
- **Auto-Summarization** - Generate concise summaries using Google Gemini AI
- **Smart Tagging** - AI suggests relevant tags based on content
- **Semantic Search** - Find documents by meaning, not just keywords
- **Q&A System** - Ask questions and get answers from your knowledge base
- **Vector Embeddings** - Advanced document similarity matching

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Google Gemini AI** - AI features
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Context API** - State management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Google Gemini API Key

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/MadeshN-2004/KnowledgeHub.git
cd KnowledgeHub
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/knowledge_hub
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd client/client
npm install
```

### 4. Get Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Create a new API key
4. Add it to your `.env` file

## 🚀 Running the Application

### Start MongoDB
Make sure MongoDB is running on your system.

### Start Backend Server
```bash
cd server
npm start
```
Server will run on http://localhost:5000

### Start Frontend
```bash
cd client/client
npm start
```
Frontend will run on http://localhost:3000

## 📁 Project Structure

```
KnowledgeHub/
├── server/
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Document.js          # Document schema with versioning
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── documents.js         # Document CRUD routes
│   │   ├── search.js            # Search routes
│   │   └── ai.js                # AI feature routes
│   ├── services/
│   │   └── geminiService.js     # Gemini AI integration
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Main server file
│
└── client/client/
    ├── public/
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── contexts/            # React context providers
    │   ├── pages/               # Page components
    │   ├── services/            # API services
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Documents
- `GET /api/documents` - Get all documents (paginated)
- `GET /api/documents/:id` - Get single document
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/versions` - Get document version history
- `GET /api/documents/activity` - Get recent activity

### Search
- `GET /api/search/text?q=query&tags=tag1,tag2` - Text search
- `POST /api/search/semantic` - Semantic search

### AI Features
- `POST /api/ai/summarize` - Generate summary
- `POST /api/ai/tags` - Generate tags
- `POST /api/ai/question` - Ask question
- `PUT /api/ai/documents/:id/summary` - Update document summary
- `PUT /api/ai/documents/:id/tags` - Update document tags

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Helmet.js for HTTP headers security
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- Role-based access control

## 👥 User Roles

- **User** - Can create, edit, and delete own documents
- **Admin** - Can manage all documents and users

## 🎯 Key Features Explained

### Version Control
Every document change is automatically saved as a new version. Users can view the complete history of changes.

### Semantic Search
Uses AI embeddings to find documents by meaning rather than exact keyword matches. Powered by cosine similarity calculations.

### Auto-Summarization
Automatically generates 2-3 sentence summaries of documents using Google Gemini AI.

### Smart Tagging
AI analyzes document content and suggests 3-5 relevant tags automatically.

### Q&A System
Ask natural language questions and get answers based on your entire knowledge base.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Gemini API Errors
- Verify API key is valid
- Check API key hasn't been leaked/blocked
- Ensure you have API access in your region

### Port Already in Use
- Kill existing process: `taskkill /F /IM node.exe` (Windows)
- Or change PORT in `.env`

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/knowledge_hub |
| JWT_SECRET | Secret for JWT signing | your_secret_key |
| GEMINI_API_KEY | Google Gemini API key | AIzaSy... |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| NODE_ENV | Environment | development |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Madesh N**
- GitHub: [@MadeshN-2004](https://github.com/MadeshN-2004)

## 🙏 Acknowledgments

- Google Gemini AI for AI capabilities
- MongoDB for database
- React and Express communities

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ by Madesh N
