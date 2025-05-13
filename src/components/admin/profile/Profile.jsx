import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { NavLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { getAccountDetailByAccountId } from "../../../api/AccountApi";
import RenderInput from "../../../authen/RenderInput";
import { updateProfile } from "../../../api/AuthenticateApi";

const ProfileAdmin = (props) => {
    const history = useHistory();

    const methods = useForm();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset,
    } = methods;

    const onSubmitHandler = (data) => {
        const { isActive, role, ...rest } = data;
        const updatedData = {
            ...rest,
        };
        updateProfile(updatedData)
            .then(async () => {
                toast.success("Cập nhật thông tin thành công!");
                props.refresh(false);
                const res = await getAccountDetailByAccountId(data.userId);
                props.userHandler(res.data.data);
                history.push("/admin/dashboard");
            })
            .catch((error) => toast.error(error.response.data.message));
    };

    useEffect(() => {
        if (props.user) {
            reset(props.user);
        }
    }, [props.user]);

    return (
        <FormProvider {...methods}>
            <div className="profile-container">
                <section className="vh-100 gradient-custom">
                    <div className="container py-5 h-100">
                        <div className="row justify-content-center align-items-center h-100">
                            <div className="col-12 col-lg-9 col-xl-7">
                                <div
                                    className="!px-16 bg-light shadow"
                                    style={{ borderRadius: "15px" }}
                                >
                                    <div className="card-body p-4">
                                        <h3 className="mb-4 text-center text-primary">
                                            Thông tin tài khoản
                                        </h3>
                                        <form
                                            onSubmit={handleSubmit(
                                                onSubmitHandler
                                            )}
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
                                                        {...register(
                                                            "fullName",
                                                            {
                                                                required:
                                                                    "Họ tên không được để trống",
                                                                pattern: {
                                                                    value: /^\s*\S+.*/,
                                                                    message:
                                                                        "Họ tên không hợp lệ!",
                                                                },
                                                            }
                                                        )}
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
                                                            {...register(
                                                                "gender",
                                                                {
                                                                    required:
                                                                        "Vui lòng chọn giới tính",
                                                                }
                                                            )}
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
                                                            {...register(
                                                                "gender",
                                                                {
                                                                    required:
                                                                        "Vui lòng chọn giới tính",
                                                                }
                                                            )}
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
                                                            {
                                                                errors.gender
                                                                    .message
                                                            }
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label
                                                    htmlFor="birthday"
                                                    className="form-label"
                                                >
                                                    Ngày sinh{" "}
                                                    <span
                                                        style={{ color: "red" }}
                                                    >
                                                        *
                                                    </span>
                                                </label>

                                                <RenderInput
                                                    type="date"
                                                    name="birthday"
                                                    label="Ngày sinh"
                                                    registerProps={{
                                                        required: true,
                                                        validate: (value) => {
                                                            const today =
                                                                new Date();
                                                            const birthday =
                                                                new Date(value);
                                                            return (
                                                                birthday <
                                                                    today ||
                                                                "Ngày sinh không hợp lệ!"
                                                            );
                                                        },
                                                    }}
                                                    errorMessage={
                                                        errors?.birthday
                                                            ?.message &&
                                                        "Vui lòng nhập ngày sinh!"
                                                    }
                                                />
                                                {errors.birthday && (
                                                    <span
                                                        className="text-danger"
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        Bắt buộc
                                                    </span>
                                                )}
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
                                                            {
                                                                errors.email
                                                                    .message
                                                            }
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
                                                            {
                                                                errors.phone
                                                                    .message
                                                            }
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
                                                    style={{
                                                        marginLeft: "45%",
                                                    }}
                                                >
                                                    Cập nhật
                                                </button>
                                                <div>
                                                    <NavLink
                                                        to="/change-password"
                                                        style={{
                                                            fontSize: "1.2rem",
                                                            color: "#007bff",
                                                            textDecoration:
                                                                "none",
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
        </FormProvider>
    );
};

export default ProfileAdmin;
