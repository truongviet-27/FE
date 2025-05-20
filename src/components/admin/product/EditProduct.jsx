import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "../../../components/admin/image/CardProfile.css";
import { getBrands } from "../../../api/BrandApi";
import { getSale } from "../../../api/SaleApi";
import { getCategory } from "../../../api/CategoryApi";
import { getProductById, modifyProduct } from "../../../api/ProductApi";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";

const EditProduct = () => {
    const [brand, setBrand] = useState([]);
    const [sale, setSale] = useState([]);
    const [category, setCategory] = useState([]);
    const [item, setItem] = useState();
    const { id } = useParams();
    const history = useHistory();
    const [image, setImage] = useState([]);
    const [count, setCount] = useState(0);
    const [currentImages, setCurrentImages] = useState([]); // Ảnh đã có (URL từ backend)
    const [base64Images, setBase64Images] = useState([]);
    const [newImages, setNewImages] = useState([]); // Ảnh mới upload
    const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const [categoriesOld, setCategoriesOld] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        control,
        setValue,
        watch,
    } = useForm();

    console.log(errors, "erros");

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

    const onFileChange = async (event) => {
        console.log("xxxxxxxxxxx");
        const files = Array.from(event.target.files);

        const validImages = files.filter(
            (file) =>
                file.name.toLowerCase().endsWith(".jpg") ||
                file.name.toLowerCase().endsWith(".png")
        );

        if (validImages.length !== files.length) {
            toast.warning(
                "Một số file không hợp lệ. Chỉ hỗ trợ file .jpg và .png."
            );
        }

        const promises = files.map((file) => convertToBase64(file));
        const base64Results = await Promise.all(promises);

        console.log(base64Results, "base64Results");

        setBase64Images(base64Results);

        setNewImages((prev) => [...prev, ...base64Results]);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveCurrentImage = (index) => {
        setCurrentImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        onLoad();
    }, []);

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

    useEffect(() => {
        getBrands(0, 20)
            .then((resp) => setBrand(resp.data.content))
            .catch((error) => console.log(error));

        getSale(0, 20)
            .then((resp) => setSale(resp.data.content))
            .catch((error) => console.log(error));
        getCategory(0, 20)
            .then((resp) => setCategory(resp.data.content ?? []))
            .catch((error) => console.log(error));
    }, []);

    const onLoad = () => {
        getProductById(id)
            .then((res) => {
                setItem(res.data.data);
                // setFlag(res.data.data.categories);
                // setAttributes(res.data.data.attributes);
                setCurrentImages(res.data.data.imageUrls);
                setCount(res.data.data.attributes.length);

                setCategoriesOld(res.data.data.categories);

                reset({
                    ...res.data.data,
                    brand: res.data.data.brand._id,
                    sale: res.data.data.sale._id,
                });
            })
            .catch((error) => console.log(error));
    };

    console.log(getValues(), "getValues");
    const submitHandler = (data) => {
        const numbersSize = getValues("attributes").map((item) => item.size);

        const hasDuplicate = numbersSize.some(
            (item, index) => numbersSize.indexOf(item) !== index
        );
        if (hasDuplicate) {
            toast.warning("Nhập trùng size. Vui lòng nhập lại!");
        } else {
            const newData = {
                ...data,
                categories: data.categories
                    .map((item, index) => {
                        return item && category[index];
                    })
                    .filter((item) => !!item),
                categoriesOld: categoriesOld,
                attributes: data.attributes.map((attribute) => {
                    return {
                        ...attribute,
                        originPrice: +attribute.originPrice,
                        size: +attribute.size,
                        price: +attribute.price,
                        stock: +attribute.stock,
                    };
                }),
                images: currentImages,
                imagesNew: newImages,
            };

            console.log(newData, "newData");
            modifyProduct(newData)
                .then(() => {
                    toast.success("Cập nhật thành công!");
                    history.push("/admin/product");
                })
                .catch((error) => {
                    console.log(error.response.data.message);
                    toast.error(error.response.data.message);
                });
        }
    };

    const goBack = () => {
        history.goBack();
    };

    return (
        <div
            className="card flex flex-col justify-between !mx-[25px]"
            style={{ marginLeft: "25px" }}
        >
            <div className="flex flex-col">
                <div className="col-12 flex items-center justify-between text-center mb-4">
                    <button style={{ width: 60 }} onClick={() => goBack()}>
                        <i
                            className="fa fa-arrow-left"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                        ></i>
                    </button>
                    <h2 className="text-danger">Chỉnh sửa sản phẩm</h2>
                    <div className="w-[60px]"></div>
                </div>
                <form
                    className="needs-validation"
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
                                    {...register("brand", { required: true })}
                                >
                                    {brand?.map((item, index) => (
                                        <option value={item._id} key={item._id}>
                                            {item?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-6 mt-4">
                                <label className="form-label">
                                    Chương trình giảm Giá
                                </label>
                                <select
                                    className="form-control"
                                    {...register("sale", { required: true })}
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
                                    {category?.map((item, index) => (
                                        <div
                                            className="flex items-center gap-2"
                                            key={item._id}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                {...register(
                                                    `categories.${index}`
                                                )}
                                            />
                                            <label className="form-check-label">
                                                {item?.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label
                                    htmlFor="upload-images"
                                    style={{
                                        cursor: "pointer",
                                        padding: "10px 20px",
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        borderRadius: "5px",
                                    }}
                                >
                                    Chọn ảnh
                                </label>
                                <input
                                    type="file"
                                    id="upload-images"
                                    multiple
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={onFileChange}
                                />
                            </div>

                            <div
                                style={{ display: "flex", flexWrap: "wrap" }}
                                className="!px-0"
                            >
                                {/* Ảnh hiện tại */}
                                {currentImages?.map((item, index) => (
                                    <div
                                        key={`current-${index}`}
                                        style={{
                                            margin: "10px",
                                        }}
                                        className="relative"
                                    >
                                        <img
                                            src={item.url}
                                            alt={`current-img-${index}`}
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                boxShadow:
                                                    "0 0 5px rgba(0,0,0,0.1)",
                                            }}
                                        />
                                        <div
                                            onClick={() =>
                                                handleRemoveCurrentImage(index)
                                            }
                                            className="absolute top-0 right-0 bg-black py-0 px-2 text-white !text-[15px] cursor-pointer"
                                        >
                                            ×
                                        </div>
                                    </div>
                                ))}

                                {/* Ảnh mới */}
                                {newImages?.map((item, index) => (
                                    <div
                                        key={`new-${index}`}
                                        style={{
                                            position: "relative",
                                            margin: "10px",
                                        }}
                                    >
                                        <img
                                            src={item}
                                            alt={`new-img-${index}`}
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                boxShadow:
                                                    "0 0 5px rgba(0,0,0,0.1)",
                                            }}
                                        />
                                        <div
                                            onClick={() =>
                                                handleRemoveNewImage(index)
                                            }
                                            className="absolute top-0 right-0 bg-black py-0 px-2 text-white !text-[15px] cursor-pointer"
                                        >
                                            ×
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="col-sm-6 mt-4 mb-4">
                                <label className="form-label">Trạng thái</label>
                                <select
                                    className="form-control"
                                    {...register("isActive", {
                                        required: false,
                                    })}
                                >
                                    <option value="false">Dừng bán</option>
                                    <option value="true">Đang bán</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
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
                                value={getValues("attributes")?.length}
                            >
                                {numbers.map((item, index) => (
                                    <option
                                        value={item}
                                        key={item}
                                        // hidden={item < count}
                                    >
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                            <br />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-4">
                            {fieldsAttribute.map((item, index) => {
                                return (
                                    <div
                                        key={item.key}
                                        className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row"
                                    >
                                        <div className="form-group col-md-12 mb-3">
                                            <label className="mb-2">
                                                Giá nhập (Vnđ)
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
                                            {Object.keys(errors)?.length > 0 &&
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
                                                Giá(Vnđ)
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
                                            {Object.keys(errors)?.length > 0 &&
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
                                                    }
                                                )}
                                            />
                                            {Object.keys(errors)?.length > 0 &&
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
                                            {Object.keys(errors)?.length > 0 &&
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
                            style={{ marginLeft: 70, borderRadius: 50 }}
                        >
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
