import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isAccount, setIsAccount] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {isAccount ? "Đăng nhập" : "Tạo mới"}
        </h2>
        <p className="text-center text-sm mb-6">
          {isAccount ? "Đăng nhập tài khoản" : "Tạo mới tài khoản"}
        </p>
        <form>
          {!isAccount && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                className="bg-transparent outline-0 none w-full"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-0 none w-full"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <div className="flex gap-3">
              <img src={assets.lock_icon} alt="" />
              <input
                className="bg-transparent outline-0 none w-full"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />
            </div>
            {showPassword ? (
              <img
                src={assets.eye_hide_icon}
                alt=""
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            ) : (
              <img
                src={assets.eye_icon}
                alt=""
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            )}
          </div>

          {isAccount && (
            <p
              className="mb-4 text-indigo-500 cursor-pointer text-right"
              onClick={() => {
                navigate("/reset-password");
              }}
            >
              Quên mật khẩu
            </p>
          )}
          <button className="w-full py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {isAccount ? "Đăng nhập" : "Đăng ký"}
          </button>
          <p className="text-gray-400 text-center text-xs mt-4">
            {isAccount ? "Bạn chưa có tài khoản? " : "Bạn đã có tài khoản? "}
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => {
                setIsAccount(!isAccount);
              }}
            >
              {isAccount ? "Đăng ký" : "Đăng nhập"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
