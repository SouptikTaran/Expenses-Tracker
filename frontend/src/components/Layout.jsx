/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { NavBar } from "./Navbar";

// Sample nav items for the FloatingNav
const navItems = [
  { name: "Home", link: "/" },
  { name: "History", link: "history" },
  { name: "Profile", link: "profile" },
  // Add more items as needed
];

function Layout({ authUser }) {
  return (
    <>
      {/* <Header /> */}
      
      {/* Floating Navigation Bar */}
      <NavBar navItems={navItems} />
      
      {/* Outlet renders the page content for the route */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
