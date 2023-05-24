import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { startStandaloneServer } from '@apollo/server/standalone';
import * as dotenv from 'dotenv';
import http from 'http';
import database from './config/database.js';
import typeDefs from './typeDefs/typeDefs.js';
import resolvers from './resolvers/resolvers.js';
import context from './context/context.js';
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";

dotenv.config();


// const server = new ApolloServer({
//   typeDefs: typeDefs,
//   resolvers: resolvers,
//   includeStacktraceInErrorResponses: false, 
//   introspection:true
// });

// database.connect();

// await startStandaloneServer(server, {
//   listen: { port: process.env.PORT },
//   context: context,
// })
// .then(({url})=>{
// console.log(`🚀 🚀 Server listening on port: ${url}`);
// });

// async function startServer(){
//   const app = express();
//   app.use(graphqlUploadExpress());
//   const apolloServer= new ApolloServer({
//     typeDefs,
//     resolvers,
//     includeStacktraceInErrorResponses: false,
//     introspection:true
//   });
  
//   await apolloServer.start()
//   apolloServer.applyMiddleware({app,path: '/graphql'});
  
//   database.connect();

//   const port=process.env.PORT;
//   app.listen(port, () => {
//       console.log(`🚀 🚀 Server listening on port: ${port}...`);
//       console.log(`Graphql EndPoint Path: ${apolloServer.graphqlPath}`);
//     });
//   } 
//   startServer();
const app = express();
const httpServer = http.createServer(app);
app.use(graphqlUploadExpress());
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  includeStacktraceInErrorResponses: false, 
  introspection:true
});
await server.start();
database.connect();
app.use(
  '/',
  cors(),
  bodyParser.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: context,
  }),
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);