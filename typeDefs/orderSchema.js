import gql from 'graphql-tag';

const orderSchema = gql`

type Order {
    id: ID
    title:String
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


type Query{
    orders:[Order]!
    orderbyId(id:ID!):Order!
}

type Mutation{
    createOrder(gigId:String!):Order! 
    updateOrderStatus(id: ID!, status: OrderStatus): Order!

}

`;
export default orderSchema;