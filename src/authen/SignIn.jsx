import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import "./signin.css";
import 'font-awesome/css/font-awesome.min.css';
import { signIn } from "../api/AuthenticateApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getInformation } from "../api/AccountApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = (props) => {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signInHandler = (data) => {
    const userFlag = {
      ...data,
      admin: false,
    };
    signIn(userFlag)
      .then((res) => {
        const accessToken = res.data.accessToken;
        if (!accessToken) {
          throw new Error("Token không hợp lệ");
        }
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", res.data);
        return getInformation(accessToken);
      })
      .then((res) => {
        const user = res.data;
        props.userHandler(user);
        // Kiểm tra role và điều hướng
        if (user.roleName === "ADMIN") {
          history.push("/admin/dashboard");
        } else if (user.roleName === "CUSTOMER") {
          history.push("/");
          window.location.reload();
        } else {
          throw new Error("Role không hợp lệ");
        }
        toast.success("Đăng nhập thành công!");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      });
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center">
                <h2 className="fw-bold mb-4 text-uppercase">Đăng nhập</h2>
                <form onSubmit={handleSubmit(signInHandler)} className="needs-validation">
                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="username">
                      Tài khoản
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control form-control-lg"
                      {...register("username", {
                        required: "Tài khoản không được để trống!",
                        pattern: {
                          value: /^\s*\S+.*/,
                          message: "Tài khoản không hợp lệ!",
                        },
                      })}
                    />
                    {errors.username && (
                      <div className="alert alert-danger" role="alert">
                        {errors.username.message}
                      </div>
                    )}
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="password">
                      Mật khẩu
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control form-control-lg"
                        {...register("password", {
                          required: true,
                          pattern: /^\s*\S+.*/,
                        })}
                      />
                      <span
                        className="input-group-text"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>

                    {errors.password && (
                      <div className="alert alert-danger" role="alert">
                        {errors.password.message}
                      </div>
                    )}
                  </div>

                  <p className="small mb-5 pb-lg-2">
                    <NavLink className="text-black-50" to="/forgot-password">
                      Quên mật khẩu?
                    </NavLink>
                  </p>

                  <button className="btn btn-outline-light btn-lg px-5" type="submit">
                    Đăng nhập
                  </button>
                </form>

                <div className="d-flex justify-content-center text-center mt-4 pt-1">
                  <a href="#!" className="text-white mx-2">
                    <i className="fab fa-facebook-f fa-lg" />
                  </a>
                  <a href="#!" className="text-white mx-2">
                    <i className="fab fa-twitter fa-lg" />
                  </a>
                  <a href="#!" className="text-white mx-2">
                    <i className="fab fa-google fa-lg" />
                  </a>
                </div>
              </div>
              <div>
                <p className="mb-0">
                  Chưa có tài khoản?{" "}
                  <NavLink to="/register" className="text-white-50 fw-bold">
                    Đăng kí ngay
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
