import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    getAccountDetailByAccountId,
    updateAccount,
} from "../../../api/AccountApi";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const EditAccount = () => {
    const { id } = useParams();
    const history = useHistory();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        getAccountDetailByAccountId(id)
            .then((resp) => {
                console.log(resp.data.data);
                reset(resp.data.data);
            })
            .catch((error) => toast.error(error.response.data.Errors));
    }, []);

    const onSubmitHandler = (data) => {
        const result = {
            id: data.id,
            isActive: data.isActive,
            fullName: data.fullName,
            gender: data.gender,
            phone: data.phone,
            email: data.email,
            address: data.address,
            birthDate: data.birthDate,
        };
        updateAccount(result)
            .then(() => {
                toast.success("Cập nhật thành công.");
                history.push("/admin/account");
            })
            .catch((error) => toast.error(error.response.data.message));
    };

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className="card flex flex-col !mx-[25px] overflow-y-hidden">
            <div className="col-12 flex items-center justify-between text-center mb-5">
                <button style={{ width: 60 }} onClick={() => goBack()}>
                    <i
                        className="fa fa-arrow-left"
                        style={{ fontSize: 18 }}
                        aria-hidden="true"
                    ></i>
                </button>
                <h2 className="text-danger">Tài khoản</h2>
                <div className="w-[60px]"></div>
            </div>
            <form
                className="needs-validation col-12 flex flex-col !flex-1 !justify-between"
                onSubmit={handleSubmit(onSubmitHandler)}
            >
                <div className="row g-3 mb-5">
                    <div className="col-sm-6 mt-2">
                        <label className="form-label">Họ tên</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("fullName", {
                                required: true,
                                pattern: /^\s*\S+.*/,
                            })}
                        />
                        {errors.fullName && (
                            <div className="alert alert-danger" role="alert">
                                Họ tên không hợp lệ!
                            </div>
                        )}
                    </div>
                    <div className="col-sm-6 mt-2">
                        <label className="form-label">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("email", {
                                required: true,
                                pattern: /^\s*\S+.*/,
                            })}
                        />
                        {errors.email && (
                            <div className="alert alert-danger" role="alert">
                                Email không hợp lệ!
                            </div>
                        )}
                    </div>
                    <div className="col-sm-6 mt-2">
                        <label className="form-label">Giới tính</label> <br />
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                {...register("gender", {
                                    required: true,
                                })}
                                value="Nam"
                            />
                            <label
                                className="form-check-label"
                                htmlFor="inlineRadio1"
                            >
                                Nam
                            </label>
                        </div>
                        <div className="form-check form-check-inline ml-5">
                            <input
                                className="form-check-input"
                                type="radio"
                                {...register("gender", {
                                    required: true,
                                })}
                                value="Nữ"
                            />
                            <label className="form-check-label">Nữ</label>
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <label className="form-label">Địa chỉ</label>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows={3}
                            {...register("address", {
                                required: true,
                                pattern: /^\s*\S+.*/,
                            })}
                        ></textarea>
                        {errors.address && (
                            <div className="alert alert-danger" role="alert">
                                Địa chỉ không hợp lệ!
                            </div>
                        )}
                    </div>

                    <div className="col-sm-6 mt-2">
                        <label className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("phone", {
                                required: true,
                                pattern: /^0[0-9]{9}$/,
                            })}
                        />
                        {errors.phone && (
                            <div className="alert alert-danger" role="alert">
                                Số điện thoại không hợp lệ!
                            </div>
                        )}
                    </div>
                    <div className="col-sm-6 mt-2">
                        <label className="form-label">Ngày sinh</label>
                        <input
                            type="date"
                            className="form-control"
                            {...register("birthDate", {
                                required: true,
                            })}
                        />
                        {errors.birthDate && (
                            <div className="alert alert-danger" role="alert">
                                Ngày sinh không hợp lệ!
                            </div>
                        )}
                    </div>
                    <div className="col-sm-6 mt-2">
                        <label className="form-label">Trạng thái</label>
                        <select
                            className="form-control"
                            {...register("isActive", {
                                required: true,
                            })}
                        >
                            <option value="true">Hoạt động</option>
                            <option value="false">Không hoạt động</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className="btn btn-primary btn-lg mt-4 mb-4"
                        type="submit"
                        style={{ borderRadius: 50 }}
                    >
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAccount;
