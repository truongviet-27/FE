import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { getBrands } from "../../../api/BrandApi";
import { getCategory } from "../../../api/CategoryApi";
import { getSale } from "../../../api/SaleApi";
import "../../../components/admin/image/CardProfile.css";
// import logo from "../../assets/images/logo-sneaker.jpg";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct } from "../../../api/ProductApi";

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ProductForm = () => {
    const [brand, setBrand] = useState([]);
    const [sale, setSale] = useState([]);
    const [base64Images, setBase64Images] = useState([]);

    const history = useHistory();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        getValues,
    } = useForm({
        defaultValues: {
            attributes: [{}],
        },
    });

    console.log(errors, "errors");

    const { fields: fieldsCategoryId } = useFieldArray({
        name: "categories",
        control,
        keyName: "key",
    });

    const {
        fields: fieldsAttribute,
        append,
        remove,
    } = useFieldArray({
        name: "attributes",
        control,
        keyName: "key",
    });

    useEffect(() => {
        getBrands(0, 20)
            .then((resp) => setBrand(resp.data.content))
            .catch((error) => console.log(error));

        getSale(0, 20)
            .then((resp) => setSale(resp.data.content))
            .catch((error) => console.log(error));

        getCategory(0, 20)
            .then((resp) => setValue("categories", resp.data.content ?? []))
            .catch((error) => console.log(error));
    }, []);

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);

        const promises = files.map((file) => convertToBase64(file));
        const base64Results = await Promise.all(promises);

        setBase64Images(base64Results);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result); // includes "data:image/jpeg;base64,..."
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const submitHandler = (data) => {
        if (base64Images.length < 1) {
            toast.warning("Cần tải lên ảnh của sản phẩm");
        } else {
            const numbersSize = getValues("attributes").map(
                (item) => item.size
            );

            const hasDuplicate = numbersSize.some(
                (item, index) => numbersSize.indexOf(item) !== index
            );
            if (hasDuplicate) {
                toast.warning("Nhập trùng size. Vui lòng nhập lại!");
            } else {
                const newData = {
                    ...data,
                    images: base64Images,
                    attributes: data.attributes.map((attribute) => {
                        return {
                            ...attribute,
                            originPrice: +attribute.originPrice,
                            price: +attribute.price,
                            size: +attribute.size,
                            stock: +attribute.stock,
                        };
                    }),
                };

                console.log(newData, "newData");

                createProduct(newData)
                    .then(() => {
                        toast.success("Thêm mới sản phẩm thành công");
                        history.push("/admin/product");
                    })
                    .catch((error) => toast.error(error.response.data.message));
            }
        }
    };

    const changeCountHandler = (value) => {
        if (value - getValues("attributes").length < 0) {
            remove();
        }
        Array.from({
            length: value - getValues("attributes").length,
        }).forEach(() => {
            append({});
        });
    };

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className="card flex flex-col justify-between !mx-[25px]">
            <div className="flex flex-col">
                <div className="col-12 flex items-center justify-between text-center mb-4">
                    <button style={{ width: 60 }} onClick={() => goBack()}>
                        <i
                            className="fa fa-arrow-left"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                        ></i>
                    </button>
                    <h2 className="text-danger !mb-0">Sản phẩm</h2>
                    <div className="w-[60px]"></div>
                </div>
                <form
                    className="needs-validation pro-form"
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <div className="col-12">
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <label className="form-label">
                                    Tên sản phẩm
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("name", {
                                        required: true,
                                        pattern: /^\s*\S+.*/,
                                    })}
                                />
                                {errors.name && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        Tên sản phẩm không hợp lệ!
                                    </div>
                                )}
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("code", {
                                        required: true,
                                        pattern: /^\s*\S+.*/,
                                    })}
                                />
                                {errors.code && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        Code không hợp lệ!
                                    </div>
                                )}
                            </div>
                            <div className="col-12 mt-4">
                                <label className="form-label">
                                    Mô tả sản phẩm
                                </label>
                                <textarea
                                    className="form-control"
                                    id="exampleFormControlTextarea1"
                                    rows={5}
                                    {...register("description", {
                                        required: true,
                                        pattern: /^\s*\S+.*/,
                                    })}
                                />
                                {errors.description && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        Mô tả không hợp lệ!
                                    </div>
                                )}
                            </div>
                            <div className="col-sm-6 mt-4">
                                <label className="form-label">
                                    Thương hiệu
                                </label>
                                <select
                                    className="form-control"
                                    {...register("brand", {
                                        required: true,
                                    })}
                                >
                                    {brand?.map((item, index) => (
                                        <option
                                            value={item?._id}
                                            key={item?._id}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-6 mt-4">
                                <label className="form-label">
                                    Chương trình giảm giá
                                </label>
                                <select
                                    className="form-control"
                                    {...register("sale", {
                                        required: true,
                                    })}
                                >
                                    {sale?.map((item, index) => (
                                        <option value={item._id} key={item._id}>
                                            {item?.name} - {item?.discount} %
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 mt-4">
                                <label className="form-label mb-3">
                                    Loại sản phẩm
                                </label>{" "}
                                <br />
                                <div className="flex items-center gap-4 flex-wrap">
                                    {fieldsCategoryId?.map((item, index) => (
                                        <div
                                            className="flex items-center gap-2"
                                            key={item._id}
                                        >
                                            <input
                                                className="form-check-input !-mt-1"
                                                type="checkbox"
                                                value={item._id}
                                                {...register("categories", {
                                                    required: true,
                                                })}
                                            />
                                            <label className="form-check-label">
                                                {item.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors.categories && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        Chọn loại sản phẩm!
                                    </div>
                                )}
                            </div>
                            <div className="col-12 mt-4 mb-5">
                                <label className="form-label">
                                    Hình ảnh sản phẩm
                                </label>
                                <div className="row">
                                    <div className="flex mr-5 ml-3">
                                        <label
                                            className="custom-file-upload fas"
                                            style={{
                                                display: "block",
                                                cursor: "pointer",
                                                padding: "35x 2px", // Tăng padding để nút rộng hơn
                                                border: "2px solid #007bff",
                                                borderRadius: "8px",
                                                textAlign: "center",
                                                backgroundColor: "#007bff",
                                                color: "#fff",
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                transition:
                                                    "background-color 0.3s, transform 0.2s",
                                                minWidth: "180px",
                                            }}
                                        >
                                            <div
                                                className="img-wrap img-upload"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <i
                                                    className="fas fa-upload"
                                                    style={{
                                                        fontSize: "28px",
                                                        color: "#fff",
                                                    }}
                                                ></i>
                                            </div>
                                            <input
                                                id="photo-upload"
                                                type="file"
                                                multiple
                                                onChange={(e) =>
                                                    handleFileChange(e)
                                                }
                                                style={{ display: "none" }}
                                            />
                                        </label>
                                    </div>
                                    <div
                                        className="col"
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {base64Images?.map((item, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    marginRight: "10px",
                                                    marginBottom: "10px",
                                                    borderRadius: "8px",
                                                    overflow: "hidden",
                                                    boxShadow:
                                                        "0 0 5px rgba(0,0,0,0.1)",
                                                }}
                                            >
                                                <img
                                                    src={item}
                                                    alt={`product-img-${index}`}
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`col-12`}>
                        <div
                            className={`border border-gray-200 !py-5 !px-5 rounded-2xl !mt-4`}
                        >
                            <h4 className="d-flex justify-content-between align-items-center mb-4">
                                <span className="text-dark">
                                    Chi tiết sản phẩm
                                </span>{" "}
                                <br />
                            </h4>
                            <label className="mb-2">Số lượng</label>
                            <select
                                className="form-control mb-2"
                                onChange={(e) =>
                                    changeCountHandler(e.target.value)
                                }
                            >
                                {numbers?.map((item, index) => (
                                    <option value={item} key={index}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-4">
                            {fieldsAttribute?.map((item, index) => {
                                return (
                                    <div
                                        key={item.key}
                                        className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row"
                                    >
                                        <div className="form-group col-md-12 mb-3">
                                            <label className="mb-2">
                                                Giá nhập (VNĐ)
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                {...register(
                                                    `attributes.${index}.originPrice`,
                                                    {
                                                        required:
                                                            "Trường này không được để trống",
                                                        min: {
                                                            value: 1,
                                                            message:
                                                                "Giá sản phẩm phải lớn hơn 0",
                                                        },
                                                    }
                                                )}
                                            />
                                            {Object.keys(errors).length > 0 &&
                                                errors?.attributes[index]
                                                    ?.originPrice && (
                                                    <p className="text-danger mt-2">
                                                        {
                                                            errors?.attributes[
                                                                index
                                                            ]?.originPrice
                                                                ?.message
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3">
                                            <label className="mb-2">
                                                Giá (VNĐ)
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                {...register(
                                                    `attributes.${index}.price`,
                                                    {
                                                        required:
                                                            "Trường này không được để trống",
                                                        min: {
                                                            value: 1,
                                                            message:
                                                                "Giá sản phẩm phải lớn hơn 0",
                                                        },
                                                    }
                                                )}
                                            />
                                            {Object.keys(errors).length > 0 &&
                                                errors?.attributes[index]
                                                    ?.price && (
                                                    <p className="text-danger mt-2">
                                                        {
                                                            errors?.attributes[
                                                                index
                                                            ]?.price?.message
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                        <div className="form-group col-md-12 mb-3">
                                            <label className="mb-2">Size</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                {...register(
                                                    `attributes.${index}.size`,

                                                    {
                                                        required:
                                                            "Trường này không được để trống",
                                                        min: {
                                                            value: 36,
                                                            message:
                                                                "Size phải lớn hơn hoặc bằng 36",
                                                        },
                                                        max: {
                                                            value: 45,
                                                            message:
                                                                "Size phải nhỏ hơn hoặc bằng 45",
                                                        },
                                                        validate: (value) =>
                                                            getValues(
                                                                "attributes"
                                                            )
                                                                ?.map(
                                                                    (item) =>
                                                                        item.size
                                                                )
                                                                ?.includes(
                                                                    value
                                                                ) === true ||
                                                            "Size đã tồn tại",
                                                    }
                                                )}
                                            />
                                            {Object.keys(errors).length > 0 &&
                                                errors?.attributes[index]
                                                    ?.size && (
                                                    <p className="text-danger mt-2">
                                                        {
                                                            errors?.attributes[
                                                                index
                                                            ]?.size?.message
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        <div className="form-group col-md-12">
                                            <label className="mb-2">
                                                Số lượng
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                {...register(
                                                    `attributes.${index}.stock`,
                                                    {
                                                        required:
                                                            "Trường này không được để trống",
                                                        min: {
                                                            value: 1,
                                                            message:
                                                                "Số lượng phải lớn hơn hoặc bằng 1",
                                                        },
                                                    }
                                                )}
                                            />
                                            {Object.keys(errors).length > 0 &&
                                                errors?.attributes[index]
                                                    ?.stock && (
                                                    <p className="text-danger mt-2">
                                                        {
                                                            errors?.attributes[
                                                                index
                                                            ]?.stock?.message
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                );
                            })}
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
        </div>
    );
};

export default ProductForm;
