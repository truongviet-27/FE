import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { assets } from "../../assets/assets";

function Home() {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6"
      />
      <div className="flex flex-col justify-center items-center gap-4">
        Hey developer{" "}
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
        <h2>Welcome to our app</h2>
        <p>
          Let&apos;s start with a quick product tour and we will have you up and
          running in no time!
        </p>
        <button className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer">
          Get started!
        </button>
      </div>
    </div>
  );
}

export default Home;
