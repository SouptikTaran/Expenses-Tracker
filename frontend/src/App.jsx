import Header from "./components/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionPage from "./pages/TransactionPage";
import NotFound from "./pages/NotFound";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/Profile";


function App() {
	const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER)
	if (loading) return null;
	return (
		<>
			{data?.authUser && <Header />}
			<Routes>
				<Route  element={<Layout authUser={data?.authUser} />} >
					<Route path='/' element={data.authUser ? <Dashboard /> : <Navigate to="/login" />} />
					<Route path='/History' element={data.authUser ? <HomePage /> : <Navigate to="/login" />} />
					<Route path='/profile' element={data.authUser ? <Profile /> : <Navigate to="/login" />} />
					<Route path='/login' element={!data.authUser ? <LoginPage /> : <Navigate to="/" />} />
					<Route path='/signup' element={!data.authUser ? <SignUpPage /> : <Navigate to="/" />} />
					<Route path='/transaction/:id' element={data.authUser ? <TransactionPage /> : <Navigate to="/login" />} />
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}
export default App;