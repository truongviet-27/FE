import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getAccountDetailByAccountId, getInformation } from "../api/AccountApi";
import { updatepProfile } from "../api/AuthenticateApi";
import { NavLink } from "react-router-dom";
// import "./profile.css"; // Sử dụng CSS riêng cho giao diện Profile

const Profile = (props) => {
    const history = useHistory();
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        getAccountDetailByAccountId(localStorage.getItem("userId"))
            .then((res) => {
                reset(res.data.data);
                setUserInfo(res.data.data);
                // eslint-disable-next-line react/prop-types
                props.userHandler(res.data.data);
            })
            .catch((error) => console.error(error));
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset,
    } = useForm();

    console.log(getValues("gender"), "gender");

    const onSubmitHandler = (data) => {
        const updatedData = { ...data, id: userInfo?.id };
        updatepProfile(updatedData)
            .then(() => {
                toast.success("Cập nhật thông tin thành công!");
                // eslint-disable-next-line react/prop-types
                props.refresh(false);
                getInformation(localStorage.getItem("token"))
                    // eslint-disable-next-line react/prop-types
                    .then((res) => props.userHandler(res.data))
                    .catch((error) => console.error(error));
                history.push("/profile");
            })
            .catch((error) => toast.error(error.response.data.message));
    };

    return (
        <div className="profile-container">
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-12 col-lg-9 col-xl-7">
                            <div
                                className="card bg-light shadow"
                                style={{ borderRadius: "15px" }}
                            >
                                <div className="card-body p-4">
                                    <h3 className="mb-4 text-center text-primary">
                                        Thông tin tài khoản
                                    </h3>
                                    <form
                                        onSubmit={handleSubmit(onSubmitHandler)}
                                    >
                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <label
                                                    htmlFor="fullName"
                                                    className="form-label"
                                                >
                                                    Họ tên
                                                </label>
                                                <input
                                                    type="text"
                                                    id="fullName"
                                                    className="form-control"
                                                    {...register("fullName", {
                                                        required:
                                                            "Họ tên không được để trống",
                                                        pattern: {
                                                            value: /^\s*\S+.*/,
                                                            message:
                                                                "Họ tên không hợp lệ!",
                                                        },
                                                    })}
                                                />
                                                {errors.fullName && (
                                                    <small className="text-danger">
                                                        {
                                                            errors.fullName
                                                                .message
                                                        }
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <h6 className="mb-2">
                                                    Giới tính
                                                </h6>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="femaleGender"
                                                        value="Nữ"
                                                        {...register("gender", {
                                                            required:
                                                                "Vui lòng chọn giới tính",
                                                        })}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="femaleGender"
                                                    >
                                                        Nữ
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="maleGender"
                                                        value="Nam"
                                                        {...register("gender", {
                                                            required:
                                                                "Vui lòng chọn giới tính",
                                                        })}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="maleGender"
                                                    >
                                                        Nam
                                                    </label>
                                                </div>
                                                {errors.gender && (
                                                    <small className="text-danger">
                                                        {errors.gender.message}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <label
                                                    htmlFor="email"
                                                    className="form-label"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="form-control"
                                                    {...register("email", {
                                                        required:
                                                            "Email không được để trống",
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message:
                                                                "Email không hợp lệ!",
                                                        },
                                                    })}
                                                />
                                                {errors.email && (
                                                    <small className="text-danger">
                                                        {errors.email.message}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <label
                                                    htmlFor="phone"
                                                    className="form-label"
                                                >
                                                    Số điện thoại
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    className="form-control"
                                                    {...register("phone", {
                                                        required:
                                                            "Số điện thoại không được để trống",
                                                        pattern: {
                                                            value: /^0[0-9]{9}$/,
                                                            message:
                                                                "Số điện thoại không hợp lệ!",
                                                        },
                                                    })}
                                                />
                                                {errors.phone && (
                                                    <small className="text-danger">
                                                        {errors.phone.message}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <label
                                                    htmlFor="address"
                                                    className="form-label"
                                                >
                                                    Địa chỉ
                                                </label>
                                                <textarea
                                                    id="address"
                                                    rows="3"
                                                    className="form-control"
                                                    {...register("address")}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-2 mb-3">
                                            <button
                                                className="btn btn-primary btn-lg"
                                                type="submit"
                                                style={{ marginLeft: "45%" }}
                                            >
                                                Cập nhật
                                            </button>
                                            <div>
                                                <NavLink
                                                    to="/change-password"
                                                    style={{
                                                        fontSize: "1.2rem",
                                                        color: "#007bff",
                                                        textDecoration: "none",
                                                        padding: "0.5rem 0",
                                                        marginLeft: "75%",
                                                    }}
                                                >
                                                    Đổi mật khẩu
                                                </NavLink>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;
