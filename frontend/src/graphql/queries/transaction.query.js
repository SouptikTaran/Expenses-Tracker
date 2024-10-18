import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
	query GetTransactions {
		transactions {
			_id
			description
			paymentType
			category
			amount
			location
			date
		}
	}
`;

export const GET_TRANSACTION = gql`
	query GetTransaction($id: ID!) {
		transaction(transactionId: $id) {
			_id
			description
			paymentType
			category
			amount
			location
			date
			user {
				name
				username
				profilePicture
			}
		}
	}
`;

export const GET_TRANSACTION_STATISTICS = gql`
	query GetTransactionStatistics {
		categoryStatistics {
			category
			totalAmount
		}
	}
`;

export const GET_TOTAL_TRANSACTION_DETAILS = gql`
	query GetTotalTransactionDetails{
		totalTransaction {
    		expenses
    		savings
    		investments
    		transactionCount
	}
  }
`

export const GET_TRANSACTION_HISTORY = gql`
	query GetTransactionHistory{
		transactionHistory {
    		id
    		description
    		amount
    		category
    		date
  }
	}
`