import gql from 'graphql-tag';

const userSchema = gql`
type User{
    id: ID
    firstname: String
    lastname: String
    username: String
    email: String
    password: String
    gender: String
    birthday: String
    role: Roles
    gigs:[Gig]
    token: String

}
enum Roles{
    FREELANCER
    CUSTOMER
}

type Response {
    status: Boolean
    message: String!
  }

input RegisterInput {   

    firstname: String!
    lastname: String!
    username: String!
    email: String!
    password: String!
    gender: String!
    birthday: String!
    role: Roles!

}

input LoginInput{
    email:String!
    password:String!
}

input UpdateInput {   

    firstname: String
    lastname: String
    username: String
    email: String
    password: String
    gender: String
    birthday: String
    role: Roles

}



type Query{
    user(id: ID!): User!
    users:[User!]!
}

type Mutation{
    registerUser(registerInput:RegisterInput!):User!
    loginUser(loginInput:LoginInput):User!
    updateUser(input: UpdateInput): User!
    deleteUser: Response
}
`;
export default userSchema;