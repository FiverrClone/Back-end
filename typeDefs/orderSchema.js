import gql from 'graphql-tag';

const orderSchema = gql`

type Order {
    id: ID
    customer: User
    freelancer: User 
    price: Float
    gig: Gig
    status: OrderStatus
    createdAt:String
    updatedAt:String
  }
enum OrderStatus {
  PENDING,# The order has been created but not yet accepted by the freelancer.
  IN_PROGRESS,# The order has been accepted by the freelancer and is in progress.
  COMPLETED,# The order has been completed by the freelancer.
  CANCELLED,# The order has been cancelled by the client
  DECLINED,# The order has been cancelled by the freelancer
},

input CreateOrderInput{
    gig:String!
    freelancer: String!
    customer: String!
    price:Float!
}

type Query{
    ordersbyCustomer(customer:String!):[Order]!
    ordersbyFreelancer(freelancer:String!):[Order]!
    orderbyId(id:ID!):Order!
}

type Mutation{
    createOrder(input: CreateOrderInput):Order! 
}

`;
export default orderSchema;