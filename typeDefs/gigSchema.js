import gql from 'graphql-tag';

const gigSchema = gql`

scalar Upload

type Gig {
    id: ID
    title: String
    description: String
    user: User
    price :String!
    image:String
    reviews: Review
    category:String
    createdAt:String
    updatedAt:String
  }

input CreateGigInput{
    title: String!
    description: String!
    category:String!
    price:String!
    file:Upload 
}

input UpdateGigInput{
    title: String
    description: String
    category:String
    price:String
    file:Upload
}

type Response {
    status: Boolean
    message: String!
}
type Query{
    gig(id: ID!): Gig!
    gigs:[Gig!]!
    gigByCategory(category:String!):[Gig!]!
}

type Mutation{
    createGig(input:CreateGigInput):Gig! 
    updateGig(id: ID!,input: UpdateGigInput): Gig! 
    deleteGig(id: ID!): Response 
}

`;
export default gigSchema;