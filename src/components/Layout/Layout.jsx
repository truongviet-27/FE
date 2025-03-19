import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Layout() {
  return (
    <>
      <Header />
      <div className="flex px-12 md:px-24 2xl:px-0">
        <Navbar />
        <div className="flex flex-5">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Layout;
