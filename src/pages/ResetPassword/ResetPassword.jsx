import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import OTPInput from "react-otp-input";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {isOtp ? "Đổi mật khẩu" : "Reset mật khẩu"}
        </h2>
        <p className="text-center text-sm mb-6">
          {isOtp ? "Đổi mật khẩu" : "Reset mật khẩu"}
        </p>
        <form>
          {isVerifyOtp ? (
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span></span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: "40px",
                height: "40px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
              inputType="tel"
              containerStyle={{
                display: "flex",
                justifyContent: "space-between",
                margin: "20px 0",
              }}
              shouldAutoFocus={true}
            />
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} alt="" />
                <input
                  className="bg-transparent outline-0 none w-full"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
              {isOtp && (
                <>
                  <div className="mb-4 flex items-center justify-between gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <div className="flex gap-3">
                      <img src={assets.lock_icon} alt="" />
                      <input
                        className="bg-transparent outline-0 none w-full"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
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

                  <div className="mb-4 flex items-center justify-between gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <div className="flex gap-3">
                      <img src={assets.lock_icon} alt="" />
                      <input
                        className="bg-transparent outline-0 none w-full"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Mật khẩu mới"
                        required
                      />
                    </div>
                    {showNewPassword ? (
                      <img
                        src={assets.eye_hide_icon}
                        alt=""
                        onClick={() => {
                          setShowNewPassword(!showNewPassword);
                        }}
                      />
                    ) : (
                      <img
                        src={assets.eye_icon}
                        alt=""
                        onClick={() => {
                          setShowNewPassword(!showNewPassword);
                        }}
                      />
                    )}
                  </div>
                </>
              )}
            </>
          )}

          <button
            className="w-full py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
            onClick={(e) => {
              e.preventDefault();
              if (isVerifyOtp) {
                setIsVerifyOtp(false);
                setIsOtp(true);
              } else {
                setIsVerifyOtp(true);
              }
            }}
          >
            Gửi
          </button>
          {!isVerifyOtp && !isOtp && (
            <p className="text-gray-400 text-center text-xs mt-4">
              {"Bạn đã có tài khoản? "}
              <span
                className="text-blue-400 cursor-pointer underline"
                onClick={() => {
                  navigate("/login");
                }}
              >
                {"Đăng nhập"}
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
