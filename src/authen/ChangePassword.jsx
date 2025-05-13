import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import "./signin.css";
import "font-awesome/css/font-awesome.min.css";
import { changePassword } from "../api/AuthenticateApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const history = useHistory();
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
        changePassword(userFlag)
            .then(() => {
                toast.success("Đổi mật khẩu thành công!");
                history.push("/profile");
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                        "Đã xảy ra lỗi. Vui lòng thử lại."
                );
            });
    };

    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div
                            className="border border-white !p-20 bg-dark text-white"
                            style={{ borderRadius: "1rem" }}
                        >
                            <div className="text-center">
                                <h2 className="fw-bold mb-4 text-uppercase">
                                    Đổi mật khẩu
                                </h2>
                                <form
                                    onSubmit={handleSubmit(signInHandler)}
                                    className="needs-validation"
                                >
                                    <div className="form-outline form-white mb-4">
                                        <label
                                            className="form-label"
                                            htmlFor="username"
                                        >
                                            Tài khoản
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            className="form-control form-control-lg"
                                            {...register("username", {
                                                required:
                                                    "Tài khoản không được để trống!",
                                                pattern: {
                                                    value: /^\s*\S+.*/,
                                                    message:
                                                        "Tài khoản không hợp lệ!",
                                                },
                                            })}
                                        />
                                        {errors.username && (
                                            <div
                                                className="alert alert-danger"
                                                role="alert"
                                            >
                                                {errors.username.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-outline form-white mb-4">
                                        <label
                                            className="form-label"
                                            htmlFor="password"
                                        >
                                            Mật khẩu hiện tại
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id="password"
                                                className="form-control form-control-lg"
                                                {...register("password", {
                                                    required:
                                                        "Mật khẩu không được để trống!",
                                                    pattern: {
                                                        value: /^\s*\S+.*/,
                                                        message:
                                                            "Mật khẩu không hợp lệ!",
                                                    },
                                                })}
                                            />
                                            {errors.password && (
                                                <div
                                                    className="alert alert-danger"
                                                    role="alert"
                                                >
                                                    {errors.password.message}
                                                </div>
                                            )}
                                            <span
                                                className="input-group-text"
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {showPassword ? (
                                                    <FaEyeSlash />
                                                ) : (
                                                    <FaEye />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-outline form-white mb-4">
                                        <label
                                            className="form-label"
                                            htmlFor="password"
                                        >
                                            Mật khẩu mới
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id="newPassword"
                                                className="form-control form-control-lg"
                                                {...register("newPassword", {
                                                    required:
                                                        "Mật khẩu không được để trống!",
                                                    pattern: {
                                                        value: /^\s*\S+.*/,
                                                        message:
                                                            "Mật khẩu không hợp lệ!",
                                                    },
                                                })}
                                            />
                                            {errors.password && (
                                                <div
                                                    className="alert alert-danger"
                                                    role="alert"
                                                >
                                                    {errors.password.message}
                                                </div>
                                            )}
                                            <span
                                                className="input-group-text"
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {showPassword ? (
                                                    <FaEyeSlash />
                                                ) : (
                                                    <FaEye />
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="small mb-5 pb-lg-2">
                                        <NavLink
                                            className="text-white"
                                            to="/forgot-password"
                                        >
                                            Quên mật khẩu?
                                        </NavLink>
                                    </p>

                                    <button
                                        className="btn btn-outline-light btn-lg px-5"
                                        type="submit"
                                    >
                                        Cập nhật mật khẩu
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
                                    <NavLink
                                        to="/register"
                                        className="text-white-50 fw-bold"
                                    >
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

export default ChangePassword;
