# GraphQL API with Apollo Server & Node.js

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A production-ready GraphQL API built with Apollo Server, Node.js, and MongoDB. Features authentication, real-time subscriptions, and optimized queries with DataLoader.

## ✨ Features

- **JWT Authentication**: Secure endpoints with token-based authentication.
- **Real-Time Subscriptions**: Deliver live updates via WebSocket.
- **Optimized Queries**: Solve the N+1 problem using DataLoader.
- **Role-Based Access Control**: Restrict actions to admins or authenticated users.
- **Docker Support**: Ready for deployment in containerized environments.

## 🛠 Technologies Used ## 

- **Apollo Server**: GraphQL server implementation
- **MongoDB**: NoSQL database
- **DataLoader**: Batch and cache database queries
- **JSON Web Tokens (JWT)**: Authentication
- **Docker**: Containerization


## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB instance (local or cloud)
- Basic understanding of GraphQL

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/graphql-apollo-tutorial.git
   cd graphql-apollo-tutorial
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a .env file in the root directory:
   ```bash
   JWT_SECRET=your_secure_secret_here
   MONGO_URI=mongodb://localhost:27017/graphql_db
   ```

### Running the Server

**Development**
   ```bash
   npm run dev
   ```

Server starts at http://localhost:4000/graphql.

**Production**
   ```bash
   npm run build
   npm start
   ```



