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
    const [count, setCount] = useState(1);
    const [brand, setBrand] = useState([]);
    const [sale, setSale] = useState([]);
    const [category, setCategory] = useState([]);
    const [images, setImages] = useState([]);

    const history = useHistory();

    useEffect(() => {
        getBrands(0, 20)
            .then((resp) => setBrand(resp.data.content))
            .catch((error) => console.log(error));

        getSale(0, 10, true)
            .then((resp) => setSale(resp.data.content))
            .catch((error) => console.log(error));

        getCategory(0, 20)
            .then((resp) => setValue("category", resp.data.content ?? []))
            .catch((error) => console.log(error));
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        getValues,
    } = useForm({
        defaultValues: {
            attribute: [{}],
        },
    });

    const { fields: fieldsCategoryId } = useFieldArray({
        name: "category",
        control,
        keyName: "key",
    });

    const {
        fields: filedsAttribute,
        append,
        remove,
    } = useFieldArray({
        name: "attribute",
        control,
        keyName: "key",
    });

    const onFileChange = (event) => {
        const images = Array.from(event.target.files);
        const links = images.map((item) => item.name);
        let flag = false;
        for (let i of links) {
            if (!i.includes(".jpg") && !i.includes(".png")) {
                toast.warning("File ảnh không hợp lệ.");
                setImages([]);
                flag = true;
                break;
            }
        }
        if (!flag) {
            setImages(images);
        }
    };

    const submitHandler = (data) => {
        if (images.length < 1) {
            toast.warning("Cần tải lên ảnh của sản phẩm");
        } else {
            const numbersSize = getValues("attribute").map((item) => item.size);

            const hasDuplicate = numbersSize.some(
                (item, index) => numbersSize.indexOf(item) !== index
            );
            if (hasDuplicate) {
                toast.warning("Nhập trùng size. Vui lòng nhập lại!");
            } else {
                // const formData = new FormData();

                // Thêm các thông tin sản phẩm vào FormData
                // formData.append("name", data.name);
                // formData.append("code", data.code);
                // formData.append("description", data.description);
                // formData.append("brand", data.brand);
                // formData.append("sale", data.sale);
                // formData.append("category", JSON.stringify(data.category));
                // formData.append("attribute", JSON.stringify(data.attribute));

                // images.forEach((img, index) => {
                //     formData.append("files", img);
                // });
                const newData = {
                    ...data,
                };

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
        if (value - getValues("attribute").length < 0) {
            remove();
        }
        Array.from({
            length: value - getValues("attribute").length,
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
                <div className="col-12 flex items-center justify-between text-center">
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
                                    rows={3}
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
                                        <option value={item._id} key={item._id}>
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
                                            {item.name} - {item.discount} %
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 mt-4">
                                <label className="form-label mb-3">
                                    Loại sản phẩm
                                </label>{" "}
                                <br />
                                <div className="flex items-center gap-4">
                                    {fieldsCategoryId?.map((item, index) => (
                                        <div
                                            className="flex items-center gap-2"
                                            key={item._id}
                                        >
                                            <input
                                                className="form-check-input !-mt-1"
                                                type="checkbox"
                                                value={item._id}
                                                {...register("category", {
                                                    required: true,
                                                })}
                                            />
                                            <label className="form-check-label">
                                                {item.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors.category && (
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
                                                fontSize: "18px", // Tăng cỡ chữ nếu muốn
                                                fontWeight: "600",
                                                transition:
                                                    "background-color 0.3s, transform 0.2s",
                                                minWidth: "180px", // Đảm bảo nút có chiều rộng tối thiểu
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
                                                        fontSize: "28px", // Tăng kích thước icon
                                                        color: "#fff",
                                                    }}
                                                ></i>
                                            </div>
                                            <input
                                                id="photo-upload"
                                                type="file"
                                                multiple
                                                onChange={(e) =>
                                                    onFileChange(e)
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
                                        {images?.map((item, index) => (
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
                                                    src={URL.createObjectURL(
                                                        item
                                                    )}
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
                                {numbers.map((item, index) => (
                                    <option value={item} key={index}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-4">
                            {filedsAttribute.map((item, index) => {
                                return (
                                    <div
                                        key={item.key}
                                        className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row"
                                    >
                                        <div className="form-group col-md-12 mb-3">
                                            <label className="mb-2">Size</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                {...register(
                                                    `attribute.${index}.size`,
                                                    {
                                                        required: true,
                                                        min: 36,
                                                        max: 45,
                                                        validate: (value) =>
                                                            getValues(
                                                                "attribute"
                                                            )
                                                                .map(
                                                                    (item) =>
                                                                        item.size
                                                                )
                                                                .includes(
                                                                    value
                                                                ) === false ||
                                                            "Size đã tồn tại",
                                                    }
                                                )}
                                            />
                                            {errors.attribute && (
                                                <p className="text-danger mt-2">
                                                    Size giày trong khoảng 36-45
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
                                                    `attribute.${index}.price`,
                                                    {
                                                        required: true,
                                                        min: 1,
                                                    }
                                                )}
                                            />
                                            {errors.price1 && (
                                                <p className="text-danger mt-2">
                                                    Giá sản phẩm lớn hơn 0
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
                                                    `attribute.${index}.quantity`,
                                                    {
                                                        required: true,
                                                        min: 1,
                                                    }
                                                )}
                                            />
                                            {errors.quantity1 && (
                                                <p className="text-danger mt-2">
                                                    Số lượng sản phẩm lớn hơn 1
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {/* {count >= 1 && (
                               
                            )} */}
                            {/* {count >= 2 && (
                                <div className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row">
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("size2", {
                                                required: true,
                                                min: 36,
                                                max: 45,
                                            })}
                                        />
                                        {errors.size2 && (
                                            <p className="text-danger mt-2">
                                                Size giày trong khoảng 36-45
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Giá(Vnđ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("price2", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price2 && (
                                            <p className="text-danger mt-2">
                                                Giá sản phẩm lớn hơn 0
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="mb-2">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("quantity2", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.quantity2 && (
                                            <p className="text-danger mt-2">
                                                Số lượng sản phẩm lớn hơn 1
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {count >= 3 && (
                                <div className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row">
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("size3", {
                                                required: true,
                                                min: 36,
                                                max: 45,
                                            })}
                                        />
                                        {errors.size3 && (
                                            <p className="text-danger mt-2">
                                                Size giày trong khoảng 36-45
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Giá(Vnđ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("price3", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price3 && (
                                            <p className="text-danger mt-2">
                                                Giá sản phẩm lớn hơn 0
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="mb-2">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("quantity3", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.quantity3 && (
                                            <p className="text-danger mt-2">
                                                Số lượng sản phẩm lớn hơn 1
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {count >= 4 && (
                                <div className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row">
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("size4", {
                                                required: true,
                                                min: 36,
                                                max: 45,
                                            })}
                                        />
                                        {errors.size4 && (
                                            <p className="text-danger mt-2">
                                                Size giày trong khoảng 36-45
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Giá(Vnđ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("price4", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price4 && (
                                            <p className="text-danger mt-2">
                                                Giá sản phẩm lớn hơn 0
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="mb-2">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("quantity4", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.quantity4 && (
                                            <p className="text-danger mt-2">
                                                Số lượng sản phẩm lớn hơn 1
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {count >= 5 && (
                                <div className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row">
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("size5", {
                                                required: true,
                                                min: 36,
                                                max: 45,
                                            })}
                                        />
                                        {errors.size5 && (
                                            <p className="text-danger mt-2">
                                                Size giày trong khoảng 36-45
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Giá(Vnđ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("price5", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price5 && (
                                            <p className="text-danger mt-2">
                                                Giá sản phẩm lớn hơn 0
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="mb-2">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("quantity5", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.quantity5 && (
                                            <p className="text-danger mt-2">
                                                Số lượng sản phẩm lớn hơn 1
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {count >= 6 && (
                                <div className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row">
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("size6", {
                                                required: true,
                                                min: 36,
                                                max: 45,
                                            })}
                                        />
                                        {errors.size6 && (
                                            <p className="text-danger mt-2">
                                                Size giày trong khoảng 36-45
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Giá(Vnđ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("price6", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price6 && (
                                            <p className="text-danger mt-2">
                                                Giá sản phẩm lớn hơn 0
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="mb-2">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("quantity6", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.quantity6 && (
                                            <p className="text-danger mt-2">
                                                Số lượng sản phẩm lớn hơn 1
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {count >= 7 && (
                                <div className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row">
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("size7", {
                                                required: true,
                                                min: 36,
                                                max: 45,
                                            })}
                                        />
                                        {errors.size7 && (
                                            <p className="text-danger mt-2">
                                                Size giày trong khoảng 36-45
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Giá(Vnđ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("price7", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price7 && (
                                            <p className="text-danger mt-2">
                                                Giá sản phẩm lớn hơn 0
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="mb-2">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("quantity7", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.quantity7 && (
                                            <p className="text-danger mt-2">
                                                Số lượng sản phẩm lớn hơn 1
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {count >= 8 && (
                                <div className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row">
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("size8", {
                                                required: true,
                                                min: 36,
                                                max: 45,
                                            })}
                                        />
                                        {errors.size8 && (
                                            <p className="text-danger mt-2">
                                                Size giày trong khoảng 36-45
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Giá(Vnđ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("price8", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price8 && (
                                            <p className="text-danger mt-2">
                                                Giá sản phẩm lớn hơn 0
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="mb-2">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("quantity8", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.quantity8 && (
                                            <p className="text-danger mt-2">
                                                Số lượng sản phẩm lớn hơn 1
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {count >= 9 && (
                                <div className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row">
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("size9", {
                                                required: true,
                                                min: 36,
                                                max: 45,
                                            })}
                                        />
                                        {errors.size9 && (
                                            <p className="text-danger mt-2">
                                                Size giày trong khoảng 36-45
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Giá(Vnđ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("price9", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price9 && (
                                            <p className="text-danger mt-2">
                                                Giá sản phẩm lớn hơn 0
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="mb-2">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("quantity9", {
                                                required: true,
                                                validate: (value) => value >= 1,
                                                min: 1,
                                            })}
                                        />
                                        {errors.quantity9 && (
                                            <p className="text-danger mt-2">
                                                Số lượng sản phẩm lớn hơn 1
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {count >= 10 && (
                                <div className="border border-gray-200 py-4 px-2 rounded-2xl !mt-4 form-row">
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("size10", {
                                                required: true,
                                                min: 36,
                                                max: 45,
                                            })}
                                        />
                                        {errors.size10 && (
                                            <p className="text-danger mt-2">
                                                Size giày trong khoảng 36-45
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12 mb-3">
                                        <label className="mb-2">Giá(Vnđ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("price10", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price10 && (
                                            <p className="text-danger mt-2">
                                                Giá sản phẩm lớn hơn 0
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label className="mb-2">Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("quantity10", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.quantity10 && (
                                            <p className="text-danger mt-2">
                                                Số lượng sản phẩm lớn hơn 1
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )} */}
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
