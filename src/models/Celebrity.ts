import mongoose, { Schema } from 'mongoose';

export const CelebritySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Celebrity name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  profession: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: [true, 'Celebrity bio is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Celebrity image is required']
  },
  coverImageUrl: {
    type: String
  },
  socialMedia: {
    instagram: String,
    twitter: String,
    tiktok: String,
    youtube: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  bronze: {
    type: Number,
    default: 99
  },
  silver: {
    type: Number,
    default: 199
  },
  gold: {
    type: Number,
    default: 499
  },
  platinum: {
    type: Number,
    default: 999
  },
  event: {
    type: Number,
    default: 299
  },
  // Subscription options
  monthly: {
    type: Number,
    default: 9.99
  },
  quarterly: {
    type: Number,
    default: 24.99
  },
  annual: {
    type: Number,
    default: 89.99
  }
}, {
  timestamps: true
});


export default mongoose.models.Celebrity || mongoose.model('Celebrity', CelebritySchema);
