import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { createVoucher } from "../../../api/VoucherApi";
import { toast } from "react-toastify";

const NewVoucher = () => {
    const history = useHistory();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitHandler = (data) => {
        const result = {
            ...data,
        };
        createVoucher(result)
            .then(() => {
                toast.success("Thêm voucher thành công.");
                history.push("/admin/voucher");
            })
            .catch((error) => toast.error(error.response.data.Errors));
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
                <h2 className="text-danger !mb-0">Voucher</h2>
                <div className="w-[60px]"></div>
            </div>
            <form
                className="needs-validation col-12 flex flex-col !flex-1 !justify-between"
                onSubmit={handleSubmit(submitHandler)}
            >
                <div className="row g-3">
                    <div className="col-sm-6">
                        <label className="form-label">Code</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            {...register("code", {
                                required: true,
                                pattern: /^\s*\S+.*/,
                            })}
                        />
                        {errors.code && (
                            <div className="alert alert-danger" role="alert">
                                Code không hợp lệ!
                            </div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label">Giảm giá</label>
                        <input
                            type="number"
                            className="form-control"
                            id="lastName"
                            {...register("discount", {
                                required: true,
                                min: 0,
                                max: 100,
                            })}
                        />
                        {errors.discount && (
                            <div className="alert alert-danger" role="alert">
                                Giảm giá không hợp lệ!
                            </div>
                        )}
                    </div>
                    <div className="col-sm-6 mt-4">
                        <label className="form-label">Lượt sử dụng</label>
                        <input
                            type="number"
                            className="form-control"
                            id="lastName"
                            {...register("count", {
                                required: true,
                                min: 0,
                            })}
                        />
                        {errors.count && (
                            <div className="alert alert-danger" role="alert">
                                Lượt sử dụng không hợp lệ!
                            </div>
                        )}
                    </div>
                    <div className="col-sm-6 mt-4">
                        <label className="form-label">Ngày hết hạn</label>
                        <input
                            type="date"
                            min="2024-01-01"
                            max="2028-01-01"
                            className="form-control"
                            id="lastName"
                            {...register("expireDate", {
                                required: true,
                            })}
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className="btn btn-primary btn-lg mt-4 mb-4"
                        type="submit"
                        style={{ borderRadius: 50 }}
                    >
                        Thêm mới
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewVoucher;
