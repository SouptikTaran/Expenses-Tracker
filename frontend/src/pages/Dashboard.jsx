import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { GET_TOTAL_TRANSACTION_DETAILS, GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";
import { useEffect, useState } from "react";
import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";
// import RecentTransactions from "../components/RecentTransactions";  
import RecentTransactions from "../components/RecentTransactions";
import DashboardCard from "../components/DashboardCard";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { data } = useQuery(GET_TRANSACTION_STATISTICS);
    const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);
    const [logout, { loading, client }] = useMutation(LOGOUT, {
        refetchQueries: ["GetAuthenticatedUser"],
    });

    const { data: totalTransactionData, refetch: refetchTotalTransactions, loading: loadingTotalTransactions, error: errorTotalTransactions } = useQuery(GET_TOTAL_TRANSACTION_DETAILS);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "$",
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
                borderRadius: 30,
                spacing: 10,
                cutout: 130,
            },
        ],
    });

    useEffect(() => {
        if (data?.categoryStatistics) {
            const categories = data.categoryStatistics.map((stat) => stat.category);
            const totalAmounts = data.categoryStatistics.map((stat) => stat.totalAmount);

            const backgroundColors = categories.map((category) => {
                switch (category) {
                    case "saving": return "rgba(75, 192, 192)";
                    case "expense": return "rgba(255, 99, 132)";
                    case "investment": return "rgba(54, 162, 235)";
                    default: return "rgba(153, 102, 255)";
                }
            });

            setChartData({
                labels: categories,
                datasets: [{
                    ...chartData.datasets[0],
                    data: totalAmounts,
                    backgroundColor: backgroundColors,
                }],
            });
        }
    }, [data]);

    const handleLogout = async () => {
        try {
            await logout();
            client.resetStore();
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error(error.message);
        }
    };
    // Check loading and error states
    if (loadingTotalTransactions) return <p>Loading transaction details...</p>;
    if (errorTotalTransactions) {
        console.error("Error fetching total transaction details:", errorTotalTransactions);
        return <p>Error fetching transaction details. Please try again.</p>;
    }
    const { expenses=0, savings=0, investments=0, transactionCount=0 } = totalTransactionData.totalTransaction;

    return (
        <div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative'>
            {/* User Info Section */}
            <div className='flex items-center justify-between w-full p-4 bg-gray-100 shadow-lg rounded-lg'>
                <div className='flex items-center'>
                    <img
                        src={authUserData?.authUser?.profilePicture}
                        className='w-12 h-12 rounded-full border cursor-pointer'
                        alt='User Avatar'
                    />
                    <p className='ml-4 text-lg font-bold text-gray-700'>
                        Welcome, {authUserData?.authUser?.name}
                    </p>
                </div>
                {!loading && <MdLogout className='mx-4 w-6 h-6 cursor-pointer' onClick={handleLogout} />}
                {loading && <div className='w-6 h-6 border-t-2 border-b-2 rounded-full animate-spin' />}
            </div>

            {/* Dashboard Widgets */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
                <DashboardCard title="Total Expenses" value={`₹${expenses}`} color="bg-red-500" />
                <DashboardCard title="Total Savings" value={`₹${savings}`} color="bg-green-500" />
                <DashboardCard title="Total Investments" value={`₹${investments}`} color="bg-blue-500" />
                <DashboardCard title="Total Transactions" value={`${transactionCount}`} color="bg-purple-500" />
            </div>

            {/* Transaction Chart & Form */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-full'>
                <div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]'>
                    {data?.categoryStatistics?.length > 0 ? (
                        <Doughnut data={chartData} />
                    ) : (
                        <p>No data available</p>
                    )}
                </div>

                <TransactionForm />
            </div>

            {/* Recent Transactions Section */}
            <RecentTransactions  />

        </div>
    );
};

export default Dashboard;
