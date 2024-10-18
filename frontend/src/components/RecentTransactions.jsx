import { FaShoppingCart, FaHome, FaDollarSign } from "react-icons/fa";
import { formatDate } from "../utils/formatDate";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTION_HISTORY } from "../graphql/queries/transaction.query";

const RecentTransactions = () => {
  const { data: history, loading: loadingHistory } = useQuery(GET_TRANSACTION_HISTORY);

  // Function to get an icon based on the transaction category
  const getIcon = (category) => {
    switch (category) {
      case "expense":
        return <FaShoppingCart className="text-red-400" />;
      case "saving":
        return <FaDollarSign className="text-green-400" />;
      case "investment":
        return <FaHome className="text-yellow-400" />;
      default:
        return <FaDollarSign className="text-blue-400" />;
    }
  };

  if (loadingHistory) return <p>Loading.....  </p>;

  const transactions = history.transactionHistory;

  return (
    <div className="w-full mt-6 mb-10">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <ul className="bg-white text-black shadow-lg rounded-lg p-4">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="flex justify-between items-center py-4 border-b hover:bg-gray-100 transition-all duration-150"
          >
            {/* Left Side: Icon + Description */}
            <div className="flex items-center space-x-4 ">
              <div className="text-xl">{getIcon(transaction.category)}</div>
              <span className="font-medium">{transaction.description}</span>
            </div>

            {/* Middle: Centered Amount */}
            <div className="flex-1 text-center font-semibold">{`₹${transaction.amount}`}</div>

            {/* Right Side: Date */}
            <div className="text-gray-500 text-sm">
              {formatDate(transaction.date, "MMMM dd, yyyy")}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
