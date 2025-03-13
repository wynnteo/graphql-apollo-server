// src/models/Post.ts
import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const Post = model('Post', PostSchema);
