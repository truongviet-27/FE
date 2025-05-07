import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "../../../components/admin/image/CardProfile.css";
import { getBrands } from "../../../api/BrandApi";
import { getSale } from "../../../api/SaleApi";
import { getCategory } from "../../../api/CategoryApi";
// import logo from "../../assets/images/logo-sneaker.jpg";
import { createProduct } from "../../../api/ProductApi";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { error } from "jquery";

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ProductForm = () => {
    const [count, setCount] = useState(0);
    const [brand, setBrand] = useState([]);
    const [sale, setSale] = useState([]);
    const [category, setCategory] = useState([]);
    const [image, setImage] = useState([]);

    const history = useHistory();

    useEffect(() => {
        getBrands(0, 20)
            .then((resp) => setBrand(resp.data.content))
            .catch((error) => console.log(error));

        getSale(0, 8)
            .then((resp) => setSale(resp.data.content))
            .catch((error) => console.log(error));

        getCategory(0, 20)
            .then((resp) => setCategory(resp.data.content))
            .catch((error) => console.log(error));
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onFileChange = (event) => {
        const images = Array.from(event.target.files);
        const links = images.map((item) => item.name);
        let flag = false;
        for (let i of links) {
            if (!i.includes(".jpg") && !i.includes(".png")) {
                toast.warning("File ảnh không hợp lệ.");
                setImage([]);
                flag = true;
                break;
            }
        }
        if (!flag) {
            setImage(images);
        }
    };

    const submitHandler = (data) => {
        if (image.length < 1) {
            toast.warning("Cần tải lên ảnh của sản phẩm");
        } else {
            const nums = [
                data.size1,
                data.size2,
                data.size3,
                data.size4,
                data.size5,
                data.size6,
                data.size7,
                data.size8,
                data.size9,
                data.size10,
            ];
            const newNums = nums.slice(0, count);
            const hasDuplicate = newNums.some(
                (x) => newNums.indexOf(x) !== newNums.lastIndexOf(x)
            );
            if (hasDuplicate) {
                toast.warning("Nhập trùng size. Vui lòng nhập lại!");
            } else {
                const formData = new FormData();

                // Thêm các thông tin sản phẩm vào FormData
                formData.append("name", data.name);
                formData.append("code", data.code);
                formData.append("description", data.description);
                formData.append("brandId", data.brand);
                formData.append("saleId", data.sale);
                formData.append("categoryId", data.category);

                // Thêm từng hình ảnh vào FormData
                image.forEach((img, index) => {
                    formData.append("files", img);
                });

                // Thêm các thuộc tính sản phẩm vào FormData dưới dạng các cặp key-value
                const attributes = [
                    {
                        size: data.size1,
                        price: data.price1,
                        stock: data.quantity1,
                    },
                    {
                        size: data.size2,
                        price: data.price2,
                        stock: data.quantity2,
                    },
                    {
                        size: data.size3,
                        price: data.price3,
                        stock: data.quantity3,
                    },
                    {
                        size: data.size4,
                        price: data.price4,
                        stock: data.quantity4,
                    },
                    {
                        size: data.size5,
                        price: data.price5,
                        stock: data.quantity5,
                    },
                    {
                        size: data.size6,
                        price: data.price6,
                        stock: data.quantity6,
                    },
                    {
                        size: data.size7,
                        price: data.price7,
                        stock: data.quantity7,
                    },
                    {
                        size: data.size8,
                        price: data.price8,
                        stock: data.quantity8,
                    },
                    {
                        size: data.size9,
                        price: data.price9,
                        stock: data.quantity9,
                    },
                    {
                        size: data.size10,
                        price: data.price10,
                        stock: data.quantity10,
                    },
                ].slice(0, count);

                attributes.forEach((attribute, index) => {
                    formData.append(`attribute[${index}].size`, attribute.size);
                    formData.append(
                        `attribute[${index}].price`,
                        attribute.price
                    );
                    formData.append(
                        `attribute[${index}].stock`,
                        attribute.stock
                    );
                });

                // Gửi yêu cầu tạo sản phẩm
                createProduct(formData)
                    .then(() => {
                        toast.success("Thêm mới sản phẩm thành công");
                        history.push("/admin/products");
                    })
                    .catch((error) => toast.error(error.response.data.message));
            }
        }
    };

    const changeCountHandler = (value) => {
        setCount(value);
    };

    return (
        <div className="pb-3 container-fluid card">
            <div className="col-10 offset-1 text-center">
                <h1 className="text-danger">Sản phẩm</h1>
            </div>
            <div className="row card">
                <form
                    className="needs-validation pro-form"
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <div className="col-10">
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
                            <div className="col-12 mt-5">
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
                            <div className="col-sm-6 mt-5">
                                <label className="form-label">
                                    Thương hiệu
                                </label>
                                <select
                                    className="form-control"
                                    {...register("brand", { required: true })}
                                >
                                    {brand &&
                                        brand.map((item, index) => (
                                            <option value={item.id} key={index}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="col-sm-6 mt-5">
                                <label className="form-label">
                                    Chương trình giảm giá
                                </label>
                                <select
                                    className="form-control"
                                    {...register("sale", { required: true })}
                                >
                                    {sale &&
                                        sale.map((item, index) => (
                                            <option
                                                value={item.id}
                                                key={index}
                                                selected={item.id === 1}
                                            >
                                                {item.name} - {item.discount} %
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="col-12 mt-5">
                                <label className="form-label mb-3">
                                    Loại sản phẩm
                                </label>{" "}
                                <br />
                                {category &&
                                    category.map((item, index) => (
                                        <div
                                            className="col-2 form-check form-check-inline mr-5"
                                            key={index}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={item.id}
                                                {...register("category", {
                                                    required: true,
                                                })}
                                            />
                                            <label className="form-check-label">
                                                {item.name}
                                            </label>
                                        </div>
                                    ))}
                                {errors.category && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        Chọn loại sản phẩm!
                                    </div>
                                )}
                            </div>
                            <div className="col-12 mt-5">
                                <label className="form-label mb-5">
                                    Hình ảnh sản phẩm
                                </label>
                                <div className="row">
                                    <div
                                        className="col-3 mr-5 ml-3 mb-5"
                                        style={{
                                            paddingRight: "40px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
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
                                        {image &&
                                            image.map((item, index) => (
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
                    <div className="col-10 row">
                        <div className="card mr-5 col-10">
                            <h4 className="d-flex justify-content-between align-items-center mb-1">
                                <span className="text-dark">
                                    Chi tiết sản phẩm
                                </span>{" "}
                                <br />
                            </h4>
                            <span className="text-dark">Số lượng</span> <br />
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
                        {count >= 1 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("size1", {
                                                required: true,
                                                min: 36,
                                                max: 45,
                                            })}
                                        />
                                        {errors.size1 && (
                                            <p className="text-danger mt-2">
                                                Size giày trong khoảng 36-45
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Giá(Vnđ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("price1", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price1 && (
                                            <p className="text-danger mt-2">
                                                Giá sản phẩm lớn hơn 0
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-10">
                                        <label>Số lượng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("quantity1", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.quantity1 && (
                                            <p className="text-danger mt-2">
                                                Số lượng sản phẩm lớn hơn 1
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {count >= 2 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
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
                                    <div className="form-group col-md-6">
                                        <label>Giá(Vnđ)</label>
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
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-10">
                                        <label>Số lượng</label>
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
                            </div>
                        )}
                        {count >= 3 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
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
                                    <div className="form-group col-md-6">
                                        <label>Giá(Vnđ)</label>
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
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-10">
                                        <label>Số lượng</label>
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
                            </div>
                        )}
                        {count >= 4 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
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
                                    <div className="form-group col-md-6">
                                        <label>Giá(Vnđ)</label>
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
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-10">
                                        <label>Số lượng</label>
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
                            </div>
                        )}
                        {count >= 5 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
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
                                    <div className="form-group col-md-6">
                                        <label>Giá(Vnđ)</label>
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
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-10">
                                        <label>Số lượng</label>
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
                            </div>
                        )}
                        {count >= 6 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
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
                                    <div className="form-group col-md-6">
                                        <label>Giá(Vnđ)</label>
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
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-10">
                                        <label>Số lượng</label>
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
                            </div>
                        )}
                        {count >= 7 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
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
                                    <div className="form-group col-md-6">
                                        <label>Giá(Vnđ)</label>
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
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-10">
                                        <label>Số lượng</label>
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
                            </div>
                        )}
                        {count >= 8 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
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
                                    <div className="form-group col-md-6">
                                        <label>Giá(Vnđ)</label>
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
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-10">
                                        <label>Số lượng</label>
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
                            </div>
                        )}
                        {count >= 9 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
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
                                    <div className="form-group col-md-6">
                                        <label>Giá(Vnđ)</label>
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
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-10">
                                        <label>Số lượng</label>
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
                            </div>
                        )}
                        {count >= 10 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
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
                                    <div className="form-group col-md-6">
                                        <label>Giá(Vnđ)</label>
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
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-10">
                                        <label>Số lượng</label>
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
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="btn btn-primary btn-lg mt-5 mb-5"
                            type="submit"
                            style={{ marginLeft: 70, borderRadius: 50 }}
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
