const transactionTypeDef = `#graphql
  type Transaction {
    _id: ID!
    userId: ID!
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    location: String
    date: String!
    user: User!
  }
  type TotalTransaction {
  expenses: Float!
  savings: Float!
  investments: Float!
  transactionCount: Float!
}

type TransactionHistory{
  id: ID!
  description: String!
  amount: Float!
  category: String
  date: String!
}

  type Query {
    transactions: [Transaction!]
    transaction(transactionId:ID!): Transaction
    totalTransaction: TotalTransaction!
    transactionHistory: [TransactionHistory]!
    categoryStatistics: [CategoryStatistics!]
  }

  type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(transactionId:ID!): Transaction!
  }

  type CategoryStatistics {
    category: String!
    totalAmount: Float!
  }

  input CreateTransactionInput {
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    date: String!
    location: String
  }

  input UpdateTransactionInput {
    transactionId: ID!
    description: String
    paymentType: String
    category: String
    amount: Float
    location: String
    date: String
  }
`;

export default transactionTypeDef;