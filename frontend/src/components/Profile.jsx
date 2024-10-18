import React from 'react';
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import RecentTransactions from './RecentTransactions'; // Assuming you have this component
import { useQuery } from '@apollo/client';
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query';

const ProfilePage = () => {
//   const user = {
//     name: "John Doe",
//     email: "johndoe@example.com",
//     phone: "+1 234 567 890",
//     location: "San Francisco, CA",
//     profilePicture: "https://via.placeholder.com/150", // You can use a real image URL here
//   };

const {data} = useQuery(GET_AUTHENTICATED_USER);
console.log(data);
const user = data.authUser;

  return (
    <div className="w-full min-h-screen  flex flex-col items-center py-10">
      {/* Profile Header */}
      <div className="bg-white shadow-lg rounded-lg w-3/4 p-10 flex flex-col items-center">
        <div className="relative">
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full">
            <FaUser className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mt-4 text-black">{user.name}</h2>

      </div>

      {/* Profile Body */}
      <div className="mt-10 w-3/4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section: About the user */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">About Me</h3>
            <p className="text-gray-600">
              Hello! I'm {user.name}, a passionate developer from {user.location}. I love creating
              amazing web applications and exploring new technologies. Feel free to reach out to me for any
              collaborations or projects.
            </p>
          </div>

          {/* Right Section: Recent Transactions/Activities */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Recent Transactions</h3>
            <RecentTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
