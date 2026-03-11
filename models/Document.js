const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  summary: String,
  versionNumber: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  summary: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  versions: [versionSchema],
  currentVersion: {
    type: Number,
    default: 1
  },
  embedding: {
    type: [Number],
    default: []
  }
}, {
  timestamps: true
});

// Create version before saving
documentSchema.pre('save', function(next) {
  if (this.isNew || this.isModified(['title', 'content', 'tags', 'summary'])) {
    this.versions.push({
      title: this.title,
      content: this.content,
      tags: this.tags,
      summary: this.summary,
      versionNumber: this.currentVersion,
      createdAt: new Date()
    });
    if (!this.isNew) {
      this.currentVersion += 1;
    }
  }
  next();
});

module.exports = mongoose.model('Document', documentSchema);