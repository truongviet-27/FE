import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { updateBrand, getBrandDetail } from "../../../api/BrandApi";
import { toast } from "react-toastify";

const EditBrand = () => {
    const history = useHistory();
    const { id } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        getBrandDetail(id).then((response) => {
            reset(response.data.data);
        });
    }, []);

    const submitHandler = (data) => {
        const result = {
            ...data,
            id: id,
            createdAt: null,
        };
        console.log(result);
        updateBrand(result)
            .then(() => {
                toast.success("Cập nhật brand thành công.");
                history.push("/admin/brand");
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
                <h2 className="text-danger">Thương hiệu</h2>
                <div className="w-[60px]"></div>
            </div>
            <form
                className="needs-validation col-12 flex flex-col !flex-1 !justify-between"
                onSubmit={handleSubmit(submitHandler)}
            >
                <div className="row g-3">
                    <div className="col-sm-6">
                        <label className="form-label">Tên thương hiệu</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("name", {
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
                    <div className="col-12 mt-4">
                        <label className="form-label">Mô tả</label>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows={3}
                            {...register("description", {
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
                    <div className="col-sm-6 mt-4">
                        <label className="form-label">
                            Trạng thái hoạt động
                        </label>
                        <select
                            className="form-control"
                            {...register("isActive", {
                                required: false,
                            })}
                        >
                            <option value="false">Không hoạt động</option>
                            <option value="true">Hoạt động</option>
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

export default EditBrand;
