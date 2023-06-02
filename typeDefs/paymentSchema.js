import gql from 'graphql-tag';

const orderSchema = gql`

type Payment {
    id: ID
    amount: Float
    order: Order
    customer:User
    paymentIntentId: String
    }


type PaymentResult {
    success: Boolean
    message: String
  }

input createPaymentInput{
    amount: Float
    order: String
}

type Mutation {
    createPayment(input: createPaymentInput): PaymentResult!
  }
`;