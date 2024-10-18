import Transaction from "../../models/transaction.model.js"
import User from "../../models/user.model.js";

const transactionResolver = {
	Query: {
		transactions: async (_, __, context) => {
			try {
				if (!context.getUser()) throw new Error("Unauthorized");
				const userId = await context.getUser()._id;

				const transactions = await Transaction.find({ userId });
				return transactions;
			} catch (err) {
				console.error("Error getting transactions:", err);
				throw new Error("Error getting transactions");
			}
		},
		transaction: async (_, { transactionId }) => {
			try {
				const transaction = await Transaction.findById(transactionId);
				return transaction;
			} catch (err) {
				console.error("Error getting transaction:", err);
				throw new Error("Error getting transaction");
			}
		},
		categoryStatistics: async (_, __, context) => {
			if (!context.getUser()) throw new Error("Unauthorized");

			const userId = context.getUser()._id;
			const transactions = await Transaction.find({ userId });
			const categoryMap = {};

			transactions.forEach((transaction) => {
				if (!categoryMap[transaction.category]) {
					categoryMap[transaction.category] = 0;
				}
				categoryMap[transaction.category] += transaction.amount;
			});

			// categoryMap = { expense: 125, investment: 100, saving: 50 }

			return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
			// return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
		},
		totalTransaction: async (_, __, context) => {
			try {
				if (!context.getUser()) throw new Error("Unauthorized");
				const userId = context.getUser()._id;
				const transactions = await Transaction.find({ userId });

				const totals = {
					expenses: 0,
					savings: 0,
					investments: 0,
					transactionCount: 0,
				};
				transactions.forEach(transaction => {
					if (transaction.category === 'expense') {
						totals.expenses += transaction.amount;
					} else if (transaction.category === 'saving') {
						totals.savings += transaction.amount;
					} else if (transaction.category === 'investment') {
						totals.investments += transaction.amount;
					}
					totals.transactionCount++;
				});

				return totals;
			} catch (error) {
				console.error("Error getting total transaction:", err);
				throw new Error("Error getting total transaction");
			}
		},
		transactionHistory: async (_, __, context) => {
			try {
				const userId = context.getUser()._id;
				const transactions = await Transaction.find({ userId });

				const results = transactions.map((transaction , index) => ({
					id: index + 1, 
					description: transaction.description,
					amount: transaction.amount,
					category: transaction.category || "other",
					date: transaction.date
				  }));

				  return results;

			} catch (error) {
				console.error("Error getting  transaction History:", err);
				throw new Error("Error getting transaction History");
			}
		}
	},
	Mutation: {
		createTransaction: async (_, { input }, context) => {
			try {
				const newTransaction = new Transaction({
					...input,
					userId: context.getUser()._id,
				});
				await newTransaction.save();
				return newTransaction;
			} catch (err) {
				console.error("Error creating transaction:", err);
				throw new Error("Error creating transaction");
			}
		},
		updateTransaction: async (_, { input }) => {
			try {
				const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
					new: true,
				});
				return updatedTransaction;
			} catch (err) {
				console.error("Error updating transaction:", err);
				throw new Error("Error updating transaction");
			}
		},
		deleteTransaction: async (_, { transactionId }) => {
			try {
				const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
				return deletedTransaction;
			} catch (err) {
				console.error("Error deleting transaction:", err);
				throw new Error("Error deleting transaction");
			}
		},
	},
	Transaction: {
		user: async (parent) => {
			const userId = parent.userId;
			try {
				const user = await User.findById(userId);
				return user;
			} catch (err) {
				console.error("Error getting user:", err);
				throw new Error("Error getting user");
			}
		},
	},
};

export default transactionResolver;