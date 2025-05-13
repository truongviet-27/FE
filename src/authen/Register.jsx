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
    const history = useHistory();
    // const renderInput = (type, name, label, registerProps, errorMessage) => (
    //     <div className="form-outline mb-4 position-relative">
    //         <input
    //             type={type}
    //             id={name}
    //             className="form-control form-control-lg"
    //             {...register(name, registerProps)}
    //         />
    //         {errorMessage && (
    //             <div className="alert alert-danger" role="alert">
    //                 {errorMessage}
    //             </div>
    //         )}
    //     </div>
    // );
    const onSubmitHandler = (data) => {
        registerAccount({
            ...data,
            birthday: formatDateInputToUTC(data.birthday),
            avatar: "123",
        })
            .then(() => {
                toast.success("Đăng kí thành công!");
                history.push("/sign-in");
            })
            .catch((error) => {
                // Kiểm tra xem error có response hay không để log lỗi phù hợp
                if (error.response) {
                    // Nếu có response từ server
                    toast.error(
                        error.response.data.message || "Có lỗi xảy ra!"
                    ); // Hiển thị lỗi từ server
                } else if (error.request) {
                    // Nếu không có response
                    toast.error(
                        "Không thể kết nối đến server. Vui lòng thử lại sau."
                    );
                } else {
                    // Nếu có lỗi khác
                    toast.error("Đã xảy ra lỗi: " + error.message);
                }
            });
    };

    const renderRadioGroup = (name, options) => (
        <div className="mb-4">
            <h6 className="mb-2 pb-1">Giới tính:</h6>
            {options.map((option) => (
                <div
                    className="form-check form-check-inline"
                    key={option.value}
                >
                    <input
                        className="form-check-input"
                        type="radio"
                        name={name}
                        id={option.id}
                        value={option.value}
                        {...register(name, { required: true })}
                    />
                    <label className="form-check-label" htmlFor={option.id}>
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    );

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
                    {/* Nhóm 1: Chứa 4 trường */}
                    <div className="form-group">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username <span style={{ color: "red" }}>*</span>
                            </label>
                            {RenderInput(
                                "text",
                                "username",
                                "Username",
                                {
                                    required: true,
                                    pattern: /^\s*\S+.*/,
                                },
                                errors.username && "Tài khoản không hợp lệ!"
                            )}
                            {errors.username && (
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
                            {errors.password && (
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
                            {RenderInput(
                                "text",
                                "fullName",
                                "Họ tên",
                                {
                                    required: true,
                                    pattern: /^\s*\S+.*/,
                                },
                                errors.fullName && "Họ tên không hợp lệ!"
                            )}
                            {errors.fullName && (
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
                            {RenderInput(
                                "text",
                                "email",
                                "Email",
                                {
                                    required: true,
                                    pattern:
                                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                },
                                errors.email && "Email không hợp lệ!"
                            )}
                            {errors.email && (
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
                            {RenderInput(
                                "tel",
                                "phone",
                                "Số điện thoại",
                                {
                                    required: true,
                                    pattern: /^0[0-9]{9}$/,
                                },
                                errors.phone && "Số điện thoại không hợp lệ!"
                            )}
                            {errors.phone && (
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
                            {RenderInput(
                                "date",
                                "birthday",
                                "Ngày sinh",
                                {
                                    required: true,
                                    validate: (value) => {
                                        const today = new Date();
                                        const birthday = new Date(value);
                                        return (
                                            birthday < today ||
                                            "Ngày sinh không hợp lệ!"
                                        );
                                    },
                                },
                                errors.birthday?.message &&
                                    "Vui lòng nhập ngày sinh!"
                            )}
                            {errors.birthday && (
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
