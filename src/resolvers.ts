// src/resolvers.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Post } from './database.js';
import { pubsub } from './pubsub.js';
import { PubSub } from 'graphql-subscriptions';
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const resolvers = {
  Query: {
    getUser: async (_: any, { id }: { id: string }) => {
      return User.findById(id);
    },
    getPosts: async (_: any, { limit, offset }: { limit: number; offset: number }) => {
      return Post.find().skip(offset).limit(limit);
    }
  },
  Mutation: {
    // Register mutation to create a new user account.
    register: async (_: any, { input }: { input: { name: string; email: string; password: string } }) => {
      const { name, email, password } = input;
      // Check if user already exists.
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');
      
      // Hash the password before saving.
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      const savedUser = await newUser.save();
      
      // Sign a JWT.
      const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, SECRET_KEY, { expiresIn: '1h' });
      return { token, user: savedUser };
    },
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const userFound = await User.findOne({ email });
      if (!userFound) throw new Error('User not found');
      
      const valid = await bcrypt.compare(password, userFound.password);
      if (!valid) throw new Error('Invalid password');
      
      const token = jwt.sign({ userId: userFound._id, role: userFound.role }, SECRET_KEY, { expiresIn: '1h' });
      return { token, user: userFound };
    },
    createPost: async (_: any, { input }: { input: { title: string; content: string; authorId: string } }, context: { user: any }) => {
      // Ensure the request is authenticated.
      if (!context.user) throw new Error('Unauthorized!');
      
      // Use the authenticated user's ID as the author.
      const newPost = new Post({ ...input, author: context.user.userId });
      const savedPost = await newPost.save();
      
      // Publish the new post event.
      pubsub.publish('POST_ADDED', { postAdded: savedPost });
      return savedPost;
    },
    deletePost: async (_: any, { id }: { id: string }, context: { user: any }) => {
      // Ensure the request is authenticated and the user has ADMIN role.
      if (!context.user || context.user.role !== 'ADMIN') throw new Error('Unauthorized!');
      const result = await Post.deleteOne({ _id: id });
      return result.deletedCount === 1;
    }
  },
  User: {
    posts: async (user: any, { limit, offset }: { limit: number; offset: number }) => {
      return Post.find({ author: user._id }).skip(offset).limit(limit);
    }
  },
  Subscription: {
    postAdded: {
      subscribe: () => (pubsub as PubSub<any>).asyncIterableIterator('POST_ADDED'), 
    }
  }
};
