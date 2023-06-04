import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import { getUserFromJWT } from '../helpers/auth.js';
// import  {GraphQLUpload,graphqlUploadExpress} from 'graphql-upload';

const context = async ({ req ,res }) => {
  if (req.headers.authorization) {
  // get the user token from the headers
  const token = req.headers.authorization.split(' ')[1] || '';

  // try to retrieve a user with the token
  const user = await getUserFromJWT(token);
  // add the user and models to the context
  return { models,user,req,res}
}else return{ models,req,res};
};

export default context;