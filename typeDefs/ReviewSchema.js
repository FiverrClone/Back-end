import gql from 'graphql-tag';

const reviewSchema = gql`

type Review {
    id: ID
    content: String
    rating:Int 
    user: User
    gig: Gig
    createdAt:String
    updatedAt:String
  }


input CreateReviewInput{
    gig:String!
    content: String!
    rating: Int
}

type Response {
    status: Boolean
    message: String!
}
type Query{
    reviewsbyGig(gig:String!):[Review!]!
}

type Mutation{
    createReview(input: CreateReviewInput):Review! 
    deleteReview(id: ID!): Response 
}

`;
export default reviewSchema;