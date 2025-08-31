# AI-Powered Collaborative Knowledge Hub

A full-stack MERN application that enables teams to create, manage, and search knowledge documents with AI-powered features using Google's Gemini AI.

## Features

### Core Features
- **Authentication**: Email/password with JWT, user/admin roles
- **Document Management**: CRUD operations with automatic versioning
- **AI Integration**: 
  - Automatic document summarization
  - Intelligent tag generation
  - Semantic search using embeddings
  - Q&A over document collection
- **Search**: Text-based and AI-powered semantic search
- **Role-based Access**: Admins can edit/delete any document, users only their own

### Advanced Features
- **Version History**: Track all document changes with timestamps
- **Team Activity Feed**: Show recent document updates
- **Tag Filtering**: Chip-style tag filters for easy navigation
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google Gemini AI** for AI features
- **bcryptjs** for password hashing

### Frontend
- **React** 18 with functional components and hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```env
MONGODB_URI=mongodb://localhost:27017/knowledge-hub
JWT_SECRET=your-super-secret-jwt-key-here
GEMINI_API_KEY=your-gemini-api-key-here
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

### Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your backend `.env` file

## Project Structure

```
knowledge-hub/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Document.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── documents.js
│   │   ├── search.js
│   │   └── ai.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   └── geminiService.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── client/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── contexts/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── AddEditDocument.js
    │   │   ├── SearchPage.js
    │   │   └── DocumentView.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .env.example
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Documents
- `GET /api/documents` - Get all documents (paginated)
- `GET /api/documents/:id` - Get single document
- `POST /api/documents` - Create document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/versions` - Get document versions
- `GET /api/documents/activity` - Get recent activity

### Search
- `GET /api/search/text` - Text-based search
- `POST /api/search/semantic` - Semantic search

### AI Features
- `POST /api/ai/summarize` - Generate summary
- `POST /api/ai/tags` - Generate tags
- `POST /api/ai/question` - Q&A over documents

## Usage

1. **Register/Login**: Create an account or sign in
2. **Create Documents**: Add new knowledge documents with title and content
3. **AI Features**: Use AI to automatically generate summaries and tags
4. **Search**: Use text search or semantic search to find relevant documents
5. **Team Q&A**: Ask questions and get AI-powered answers based on your document collection
6. **Version Control**: View document history and changes over time
7. **Collaboration**: See team activity and recent document updates

## Development

### Running in Development
- Backend: `npm run dev` (uses nodemon for auto-restart)
- Frontend: `npm start` (uses React dev server)

### Building for Production
- Frontend: `npm run build` (creates optimized production build)

## Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is correct
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Update `REACT_APP_API_URL` to your production backend URL
2. Build the project: `npm run build`
3. Deploy to platforms like Vercel, Netlify, or serve with Express

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- Role-based authorization

## AI Features Powered by Gemini

1. **Document Summarization**: Automatically generates concise summaries
2. **Tag Generation**: Creates relevant tags based on content
3. **Semantic Search**: Uses embeddings for context-aware search
4. **Q&A System**: Answers questions using document collection as context

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request