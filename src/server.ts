// src/server.ts
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import http from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { readFileSync } from 'fs';
import path from 'path';
import { resolvers } from './resolvers.js';
import { createContext } from './context.js';
import dotenv from 'dotenv';
import connectDB from './db.js';

dotenv.config();

// Read the GraphQL schema from file.
const typeDefs = readFileSync(path.join(process.cwd(), 'src', 'schema.graphql'), 'utf-8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Connect to MongoDB.
connectDB();

const app = express();
const httpServer = http.createServer(app);

// Set up the WebSocket server for subscriptions.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
});
useServer({ schema, context: createContext }, wsServer);

// Create Apollo Server instance.
const server = new ApolloServer({ schema });

(async () => {
  await server.start();
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, { context: createContext })
  );
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}/graphql`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
})();
