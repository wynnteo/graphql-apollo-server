// src/context.ts
import jwt from 'jsonwebtoken'; 
import { createUserLoader, createPostLoader } from './loaders.js';
import { pubsub } from './pubsub.js';
import dotenv from 'dotenv';
import { User, Post } from './database.js';

dotenv.config();

const { verify } = jwt;

export const createContext = async ({ req }: { req: any }) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
  let user = null;
  try {
    user = verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    console.error(error)
    // Token invalid or missing.
  }

  return {
    user,
    db: { User, Post },
    loaders: {
      userLoader: createUserLoader(),
      postLoader: createPostLoader()
    },
    pubsub
  };
};
