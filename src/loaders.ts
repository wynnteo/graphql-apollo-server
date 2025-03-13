// src/loaders.ts
import DataLoader from 'dataloader';
import { User, Post } from './database.js';

export const createUserLoader = () =>
  new DataLoader<string, any>(async (userIds: readonly string[]) => {
    const users = await User.find({ _id: { $in: userIds } });
    return userIds.map(id => users.find(user => user._id.toString() === id));
  });

export const createPostLoader = () =>
  new DataLoader<{ userId: string; limit: number; offset: number }, any>(
    async (keys: readonly { userId: string; limit: number; offset: number }[]) => {
      const userIds = keys.map(key => key.userId);
      const posts = await Post.find({ author: { $in: userIds } });
      return keys.map(({ userId, limit, offset }) =>
        posts.filter(post => post.author.toString() === userId).slice(offset, offset + limit)
      );
    }
  );
