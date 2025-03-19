import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between items-center py-4 sm:py-6 px-12 md:px-24 2xl:px-24">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      <button
        onClick={() => {
          navigate("/login");
        }}
        className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
      >
        Login
        <img src={assets.arrow_icon} alt="" />
      </button>
    </div>
  );
}

export default Header;
