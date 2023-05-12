import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import * as dotenv from 'dotenv';
import database from './config/database.js';
import typeDefs from './typeDefs/typeDefs.js';
import resolvers from './resolvers/resolvers.js';
import context from './context/context.js';

dotenv.config();

// “merging” types and resolvers
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  includeStacktraceInErrorResponses: false, //to exclude stackTrace parameter from error messages
  introspection: true,
});

database.connect();

await startStandaloneServer(server, {
  listen: { port: process.env.PORT },
  context: context,
})
.then(({url})=>{
console.log(`🚀 🚀 Server listening on port: ${url}`);
});