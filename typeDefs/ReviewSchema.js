import gql from 'graphql-tag';

const ReviewSchema = gql`

type Review {
    id: ID
    content: String
    star: Stars
    user: User
    gig: Gig
    createdAt:String
    updatedAt:String
  }

enum Stars{
    1
    2
    3
    4
    5
}
input CreateReviewInput{
    gig:String!
    content: String!
    star: Stars
}

type Response {
    status: Boolean
    message: String!
}
type Query{
    Reviews(gig:String!):[Review!]!
}

type Mutation{
    createReview(input: CreateReviewInput):Review! 
    updateReview(id: ID!, input: CreateReviewInput): Review! 
    deleteReview(id: ID!): Response 
}

`;
export default ReviewSchema;