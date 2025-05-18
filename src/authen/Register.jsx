import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { registerAccount } from "../api/AuthenticateApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import formatDateInputToUTC from "../utils/formatDateInputToUTC";
import RenderInput from "./RenderInput";

const Register = () => {
    const methods = useForm();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;
    const [showPassword, setShowPassword] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const history = useHistory();
    const onSubmitHandler = (data) => {
        registerAccount({
            ...data,
            avatar: previewUrl,
        })
            .then(() => {
                toast.success("Đăng kí thành công!");
                history.push("/sign-in");
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(
                        error.response.data.message || "Có lỗi xảy ra!"
                    );
                } else if (error.request) {
                    toast.error(
                        "Không thể kết nối đến server. Vui lòng thử lại sau."
                    );
                } else {
                    toast.error("Đã xảy ra lỗi: " + error.message);
                }
            });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <FormProvider {...methods}>
            <div
                className="container my-5 p-4"
                style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h3
                    className="text-center mb-4"
                    style={{ color: "#4CAF50", fontWeight: "600" }}
                >
                    Đăng ký tài khoản
                </h3>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col items-center justify-center gap-4">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Avatar"
                                className="!w-30 !h-30 rounded-full object-cover border-4 border-primary shadow-md"
                            />
                        ) : (
                            <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm border-dashed border-2 border-gray-400">
                                No Avatar
                            </div>
                        )}

                        {/* Upload Button */}
                        <label
                            htmlFor="photo-upload"
                            className="cursor-pointer px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                        >
                            Chọn ảnh đại diện
                        </label>

                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    {/* Nhóm 1: Chứa 4 trường */}
                    <div className="form-group">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username <span style={{ color: "red" }}>*</span>
                            </label>
                            <RenderInput
                                type={"text"}
                                name={"username"}
                                label={"Username"}
                                registerProps={{
                                    required: true,
                                    pattern: /^\s*\S+.*/,
                                }}
                                errorMessage={
                                    errors?.username &&
                                    "Tài khoản không hợp lệ!"
                                }
                            />
                            {errors?.username && (
                                <span
                                    className="text-danger"
                                    style={{ fontSize: "12px" }}
                                >
                                    Bắt buộc
                                </span>
                            )}
                        </div>
                        {/* Password Field with Toggle */}
                        <div className="mb-3 position-relative">
                            <label htmlFor="password" className="form-label">
                                Password <span style={{ color: "red" }}>*</span>
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
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {errors?.password && (
                                <span
                                    className="text-danger"
                                    style={{ fontSize: "12px" }}
                                >
                                    Mật khẩu không hợp lệ!
                                </span>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">
                                Họ tên <span style={{ color: "red" }}>*</span>
                            </label>
                            <RenderInput
                                type={"text"}
                                name={"fullName"}
                                label={"Họ tên"}
                                registerProps={{
                                    required: true,
                                    pattern: /^\s*\S+.*/,
                                }}
                                errorMessage={
                                    errors?.fullName && "Họ tên không hợp lệ!"
                                }
                            />
                            {errors?.fullName && (
                                <span
                                    className="text-danger"
                                    style={{ fontSize: "12px" }}
                                >
                                    Bắt buộc
                                </span>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email <span style={{ color: "red" }}>*</span>
                            </label>
                            <RenderInput
                                type={"text"}
                                name={"email"}
                                label={"Email"}
                                registerProps={{
                                    required: true,
                                    pattern:
                                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                }}
                                errorMessage={
                                    errors?.email && "Email không hợp lệ!"
                                }
                            />
                            {errors?.email && (
                                <span
                                    className="text-danger"
                                    style={{ fontSize: "12px" }}
                                >
                                    Bắt buộc
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Nhóm 2: Chứa 4 trường */}
                    <div className="form-group">
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                                Số điện thoại{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <RenderInput
                                type={"tel"}
                                name={"phone"}
                                label={"Số điện thoại"}
                                registerProps={{
                                    required: true,
                                    pattern: /^0[0-9]{9}$/,
                                }}
                                errorMessage={
                                    errors?.phone &&
                                    "Số điện thoại không hợp lệ!"
                                }
                            />
                            {errors?.phone && (
                                <span
                                    className="text-danger"
                                    style={{ fontSize: "12px" }}
                                >
                                    Bắt buộc
                                </span>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="birthday" className="form-label">
                                Ngày sinh{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <RenderInput
                                type={"date"}
                                name={"birthday"}
                                label={"Ngày sinh"}
                                registerProps={{
                                    required: true,
                                    validate: (value) => {
                                        const today = new Date();
                                        const birthday = new Date(value);
                                        return (
                                            birthday < today ||
                                            "Ngày sinh không hợp lệ!"
                                        );
                                    },
                                }}
                                errorMessage={
                                    errors?.birthday?.message &&
                                    "Vui lòng nhập ngày sinh!"
                                }
                            />
                            {errors?.birthday && (
                                <span
                                    className="text-danger"
                                    style={{ fontSize: "12px" }}
                                >
                                    Bắt buộc
                                </span>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="gender" className="form-label">
                                Giới tính{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id="female"
                                    value="Nữ"
                                    className="form-check-input"
                                    {...register("gender", { required: true })}
                                />
                                <label
                                    htmlFor="female"
                                    className="form-check-label"
                                >
                                    Nữ
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id="male"
                                    value="Nam"
                                    className="form-check-input"
                                    {...register("gender", { required: true })}
                                />
                                <label
                                    htmlFor="male"
                                    className="form-check-label"
                                >
                                    Nam
                                </label>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                                Địa chỉ <span style={{ color: "red" }}>*</span>
                            </label>
                            <textarea
                                id="address"
                                className="form-control form-control-sm"
                                style={{
                                    padding: "8px",
                                    fontSize: "14px",
                                    borderRadius: "5px",
                                }}
                                {...register("address")}
                            />
                        </div>
                    </div>

                    {/* Nút submit */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        style={{
                            backgroundColor: "#4CAF50",
                            border: "none",
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "5px",
                        }}
                    >
                        Đăng ký
                    </button>
                </form>
            </div>
        </FormProvider>
    );
};

export default Register;
