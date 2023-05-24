import gql from 'graphql-tag';
// import { gql } from 'apollo-server-express';


const gigSchema = gql`

scalar Upload

type Gig {
    id: ID
    title: String
    description: String
    user: User
    image:String
    # comments: [Comment]
    createdAt:String
    updatedAt:String
  }

# input CreateGigInput{
#     title: String!
#     description: String!
# }

input UpdateGigInput{
    title: String
    description: String
}

type Response {
    status: Boolean
    message: String!
}
type Query{
    gig(id: ID!): Gig!
    gigs:[Gig!]!
}

type Mutation{
    createGig(file:Upload!,title: String!,description: String!):Gig!
    updateGig(id: ID!, input: UpdateGigInput): Gig!
    deleteGig(id: ID!): Response
}

`;
export default gigSchema;