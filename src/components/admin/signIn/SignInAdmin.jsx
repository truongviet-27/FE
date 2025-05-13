import "font-awesome/css/font-awesome.min.css";
import Cookies from "js-cookie";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import OTPInput from "react-otp-input";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { signIn, verifyOtp } from "../../../api/AuthenticateApi";
import "../../../authen/signin.css";
import { NavLink } from "react-bootstrap";
import OtpCountdown from "../../../authen/OtpCountdown";

const SignInAdmin = (props) => {
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);
    const [isShowOtp, setIsShowOtp] = useState(false);
    const [otpExpire, setOtpExpire] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm();

    const signInHandler = (data) => {
        const userFlag = {
            ...data,
            admin: false,
        };

        if (isShowOtp) {
            verifyOtp(userFlag)
                .then(async (res) => {
                    const accessToken = res.data.data.accessToken;
                    const refreshToken = res.data.data.refreshToken;
                    const id = res.data.data.id;

                    if (!accessToken) {
                        throw new Error("Token không hợp lệ");
                    }
                    localStorage.setItem("token", accessToken);
                    Cookies.set("refreshToken", refreshToken, {
                        secure: true,
                        sameSite: "Strict",
                    });
                    localStorage.setItem("id", id);

                    toast.success("Đăng nhập thành công!");
                    if (props?.user?.role === "ADMIN") {
                        history.push("/admin/dashboard");
                    } else if (props?.user?.role === "CUSTOMER") {
                        history.push("/");
                        window.location.reload();
                    } else {
                        history.push("/admin/dashboard");
                        return;
                    }
                })
                .catch((error) => {
                    toast.error(
                        error.response?.data?.message ||
                            "Đã xảy ra lỗi. Vui lòng thử lại."
                    );
                });
        } else {
            signIn(userFlag)
                .then((res) => {
                    toast.success(res.data.message);
                    setIsShowOtp(true);
                    setOtpExpire(res.data.data);
                })
                .catch((error) => {
                    toast.error(
                        error.response?.data?.message ||
                            "Đã xảy ra lỗi. Vui lòng thử lại."
                    );
                });
        }
    };

    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="flex justify-center items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5 !w-full">
                        <div
                            className="border border-white !p-10 bg-dark text-white"
                            style={{ borderRadius: "1rem" }}
                        >
                            <div className="card-body p-5 text-center">
                                <h2 className="fw-bold mb-4 text-uppercase">
                                    Đăng nhập
                                </h2>
                                <form
                                    onSubmit={handleSubmit(signInHandler)}
                                    className="needs-validation"
                                >
                                    {isShowOtp ? (
                                        <div className="flex flex-col gap-14 justify-center !my-20">
                                            <Controller
                                                name="otp"
                                                control={control}
                                                rules={{
                                                    required: "OTP is required",
                                                    minLength: 6,
                                                }}
                                                render={({
                                                    field,
                                                    fieldState,
                                                }) => (
                                                    <div>
                                                        <OTPInput
                                                            value={field.value}
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            numInputs={6}
                                                            renderInput={(
                                                                inputProps
                                                            ) => (
                                                                <input
                                                                    {...inputProps}
                                                                />
                                                            )}
                                                            inputStyle={{
                                                                width: "4rem",
                                                                height: "4rem",
                                                                marginRight:
                                                                    "1rem", // khoảng cách giữa các ô
                                                                fontSize:
                                                                    "1.5rem",
                                                                textAlign:
                                                                    "center",
                                                                border: "1px solid #ccc",
                                                                borderRadius:
                                                                    "4px",
                                                            }}
                                                            containerStyle={{
                                                                justifyContent:
                                                                    "center",
                                                                display: "flex",
                                                                gap: 20,
                                                            }}
                                                        />
                                                        {fieldState.error && (
                                                            <p
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                            >
                                                                {
                                                                    fieldState
                                                                        .error
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            />
                                            <OtpCountdown
                                                otpExpire={otpExpire}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            {" "}
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
                                                        {
                                                            errors.username
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                            <div className="form-outline form-white mb-4">
                                                <label
                                                    className="form-label"
                                                    htmlFor="password"
                                                >
                                                    Mật khẩu
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
                                                        {...register(
                                                            "password",
                                                            {
                                                                required: true,
                                                                pattern:
                                                                    /^\s*\S+.*/,
                                                            }
                                                        )}
                                                    />
                                                    <span
                                                        className="input-group-text"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
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

                                                {errors.password && (
                                                    <div
                                                        className="alert alert-danger"
                                                        role="alert"
                                                    >
                                                        {
                                                            errors.password
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <button
                                        className="btn btn-outline-light btn-lg px-5 mt-5"
                                        type="submit"
                                    >
                                        Đăng nhập
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignInAdmin;
