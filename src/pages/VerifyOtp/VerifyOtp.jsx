import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Xác thực mã OTP
        </h2>
        <p className="text-center text-sm mb-6">{"Xác thực mã OTP"}</p>
        <form>
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
          <button
            className="w-full py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
            onClick={() => {
              navigate("/reset-password");
            }}
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
