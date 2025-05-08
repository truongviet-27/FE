import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
    const [cate, setCate] = useState([]);
    const [item, setItem] = useState();
    const [attributes, setAttributes] = useState([]);
    const [flag, setFlag] = useState([]);
    const { id } = useParams();
    const history = useHistory();
    const [image, setImage] = useState([]);
    const [count, setCount] = useState(0);
    const [currentImages, setCurrentImages] = useState([]); // Ảnh đã có (URL từ backend)
    const [newImages, setNewImages] = useState([]); // Ảnh mới upload
    const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const onFileChange = (event) => {
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

        // Tạo URL tạm thời cho hình ảnh để hiển thị
        const imagePreviews = validImages.map((file) => {
            return {
                file, // Giữ file để upload sau
                preview: URL.createObjectURL(file), // URL để hiển thị trước
            };
        });

        // Thêm ảnh mới vào danh sách
        setNewImages((prev) => [...prev, ...imagePreviews]);
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
        setCount(value);
    };

    const onLoad = () => {
        getBrands(0, 20)
            .then((resp) => setBrand(resp.data.content))
            .catch((error) => console.log(error));

        getSale(0, 8)
            .then((resp) => setSale(resp.data.content))
            .catch((error) => console.log(error));

        getProductById(id)
            .then((res) => {
                setItem(res.data);
                setFlag(res.data.categories);
                setAttributes(res.data.attributes);
                setCurrentImages(res.data.images);
                setCount(res.data.attributes.length);
                getCategory(0, 20)
                    .then((resp) => setCate(resp.data.content))
                    .catch((error) => console.log(error));

                reset(res.data);
            })
            .catch((error) => console.log(error));
    };
    const submitHandler = (data) => {
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
            formData.append("id", id);
            formData.append("name", data.name);
            formData.append("code", data.code);
            formData.append("description", data.description);
            formData.append("brandId", data.brandId);
            formData.append("saleId", data.saleId);
            formData.append("categoryId", data.category);
            formData.append("isActive", data.isActive);

            // Thêm từng hình ảnh vào FormData
            // currentImages.forEach((img, index) => {
            //   formData.append("files", img);
            // });
            newImages.forEach((img, index) => {
                formData.append("files", img.file);
            });

            // Thêm các thuộc tính sản phẩm vào FormData dưới dạng các cặp key-value
            const attributes = [
                { size: data.size1, price: data.price1, stock: data.quantity1 },
                { size: data.size2, price: data.price2, stock: data.quantity2 },
                { size: data.size3, price: data.price3, stock: data.quantity3 },
                { size: data.size4, price: data.price4, stock: data.quantity4 },
                { size: data.size5, price: data.price5, stock: data.quantity5 },
                { size: data.size6, price: data.price6, stock: data.quantity6 },
                { size: data.size7, price: data.price7, stock: data.quantity7 },
                { size: data.size8, price: data.price8, stock: data.quantity8 },
                { size: data.size9, price: data.price9, stock: data.quantity9 },
                {
                    size: data.size10,
                    price: data.price10,
                    stock: data.quantity10,
                },
            ].slice(0, count);

            attributes.forEach((attribute, index) => {
                formData.append(`attribute[${index}].size`, attribute.size);
                formData.append(`attribute[${index}].price`, attribute.price);
                formData.append(`attribute[${index}].stock`, attribute.stock);
            });

            // const flag = {
            //   id: id,
            //   name: data.name,
            //   code: data.code,
            //   description: data.description,
            //   brandId: data.brandId,
            //   saleId: data.saleId,
            //   categoryId: data.category,
            //   isActive: data.isActive,
            //   attribute: [
            //     {
            //       size: data.size1,
            //       price: data.price1,
            //       stock: data.quantity1,
            //     },
            //     {
            //       size: data.size2,
            //       price: data.price2,
            //       stock: data.quantity2,
            //     },
            //     {
            //       size: data.size3,
            //       price: data.price3,
            //       stock: data.quantity3,
            //     },
            //     {
            //       size: data.size4,
            //       price: data.price4,
            //       stock: data.quantity4,
            //     },
            //     {
            //       size: data.size5,
            //       price: data.price5,
            //       stock: data.quantity5,
            //     },
            //     {
            //       size: data.size6,
            //       price: data.price6,
            //       stock: data.quantity6,
            //     },
            //     {
            //       size: data.size7,
            //       price: data.price7,
            //       stock: data.quantity7,
            //     },
            //     {
            //       size: data.size8,
            //       price: data.price8,
            //       stock: data.quantity8,
            //     },
            //     {
            //       size: data.size9,
            //       price: data.price9,
            //       stock: data.quantity9,
            //     },
            //     {
            //       size: data.size10,
            //       price: data.price10,
            //       stock: data.quantity10,
            //     }
            //   ].slice(0, count),
            // };
            modifyProduct(formData)
                .then(() => {
                    toast.success("Cập nhật thành công!");
                    history.push("/admin/products");
                })
                .catch((error) => {
                    console.log(error.response.data.message);
                    toast.error(error.response.data.message);
                });
        }
    };
    return (
        <div
            className="pb-3 container-fluid card"
            style={{ marginLeft: "25px" }}
        >
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
                                    {...register("brandId", { required: true })}
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
                                    Chương trình giảm Giá
                                </label>
                                <select
                                    className="form-control"
                                    {...register("saleId", { required: true })}
                                >
                                    {sale &&
                                        sale.map((item, index) => (
                                            <option value={item.id} key={index}>
                                                {item.name} - {item.discount} %
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="col-12 mt-5 mb-5">
                                <label className="form-label mb-3">
                                    Loại sản phẩm
                                </label>{" "}
                                <br />
                                {cate &&
                                    cate.map((i, index) => (
                                        <div
                                            className="col-2 form-check form-check-inline mr-5"
                                            key={index}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue={i.id}
                                                defaultChecked={flag.includes(
                                                    i.id
                                                )}
                                                {...register("category", {
                                                    required: true,
                                                })}
                                            />
                                            <label className="form-check-label">
                                                {i.name}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                            {/* <div className="col-12 mt-5 mb-5">
                <label className="form-label mb-3">Loại sản phẩm</label> <br />
                {cate && cate.map((i) => (
                  <div className="col-2 form-check form-check-inline mr-5" key={i.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={i.id}
                      defaultChecked={flag.includes(i.id)}  // Kiểm tra xem id của category này có trong flag không
                      {...register("category", { required: true })}
                    />
                    <label className="form-check-label">{i.name}</label>
                  </div>
                ))}
              </div> */}

                            <div style={{ marginTop: "20px" }}>
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

                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {/* Ảnh hiện tại */}
                                {currentImages.map((src, index) => (
                                    <div
                                        key={`current-${index}`}
                                        style={{
                                            position: "relative",
                                            margin: "10px",
                                        }}
                                    >
                                        <img
                                            src={src}
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
                                        <button
                                            onClick={() =>
                                                handleRemoveCurrentImage(index)
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                                {/* Ảnh mới */}
                                {newImages.map((src, index) => (
                                    <div
                                        key={`new-${index}`}
                                        style={{
                                            position: "relative",
                                            margin: "10px",
                                        }}
                                    >
                                        <img
                                            src={src.preview}
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
                                        <button
                                            onClick={() =>
                                                handleRemoveNewImage(index)
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="col-sm-6 mt-5">
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
                    <div className="col-10 row" style={{ marginTop: "15px" }}>
                        <div className="card mr-5 col-10">
                            <h4 className="d-flex justify-content-between align-items-center mb-1">
                                <span className="text-dark">
                                    Chi tiết sản phẩm
                                </span>{" "}
                                <br />
                            </h4>
                            <span className="text-dark">Số lượng</span>{" "}
                            <select
                                className="form-control mb-2"
                                onChange={(e) =>
                                    changeCountHandler(e.target.value)
                                }
                                value={count}
                            >
                                {numbers.map((item, index) => (
                                    <option
                                        value={item}
                                        key={index}
                                        disabled={item < attributes.length}
                                        hidden={item < attributes.length}
                                    >
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                            <br />
                        </div>
                        {count >= 1 && (
                            <div className="card mr-3">
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={
                                                item.attributes[0] &&
                                                item.attributes[0].size
                                            }
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
                                            defaultValue={
                                                item.attributes[0] &&
                                                item.attributes[0].price
                                            }
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
                                            defaultValue={
                                                item.attributes[0] &&
                                                item.attributes[0].stock
                                            }
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
                                            defaultValue={
                                                item.attributes[1] &&
                                                item.attributes[1].size
                                            }
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
                                            defaultValue={
                                                item.attributes[1] &&
                                                item.attributes[1].price
                                            }
                                            {...register("price2", {
                                                required: true,
                                                min: 1,
                                            })}
                                        />
                                        {errors.price2 && (
                                            <p className="text-danger mt-2">
                                                Giá(Vnđ) sản phẩm lớn hơn 0
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
                                            defaultValue={
                                                item.attributes[1] &&
                                                item.attributes[1].stock
                                            }
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
                                            defaultValue={
                                                item.attributes[2] &&
                                                item.attributes[2].size
                                            }
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
                                        <label>Giá</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={
                                                item.attributes[2] &&
                                                item.attributes[2].price
                                            }
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
                                            defaultValue={
                                                item.attributes[2] &&
                                                item.attributes[2].stock
                                            }
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
                                            defaultValue={
                                                item.attributes[3] &&
                                                item.attributes[3].size
                                            }
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
                                        <label>Giá</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={
                                                item.attributes[3] &&
                                                item.attributes[3].price
                                            }
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
                                            defaultValue={
                                                item.attributes[3] &&
                                                item.attributes[3].stock
                                            }
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
                                            defaultValue={
                                                item.attributes[4] &&
                                                item.attributes[4].size
                                            }
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
                                        <label>Giá</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={
                                                item.attributes[4] &&
                                                item.attributes[4].price
                                            }
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
                                            defaultValue={
                                                item.attributes[4] &&
                                                item.attributes[4].stock
                                            }
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
                                            defaultValue={
                                                item.attributes[5] &&
                                                item.attributes[5].size
                                            }
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
                                        <label>Giá</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={
                                                item.attributes[5] &&
                                                item.attributes[5].price
                                            }
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
                                            defaultValue={
                                                item.attributes[5] &&
                                                item.attributes[5].stock
                                            }
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
                                            defaultValue={
                                                item.attributes[6] &&
                                                item.attributes[6].size
                                            }
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
                                        <label>Giá</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={
                                                item.attributes[6] &&
                                                item.attributes[6].price
                                            }
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
                                            defaultValue={
                                                item.attributes[6] &&
                                                item.attributes[6].stock
                                            }
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
                                            defaultValue={
                                                item.attributes[7] &&
                                                item.attributes[7].size
                                            }
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
                                        <label>Giá</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={
                                                item.attributes[7] &&
                                                item.attributes[7].price
                                            }
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
                                            defaultValue={
                                                item.attributes[7] &&
                                                item.attributes[7].stock
                                            }
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
                                            defaultValue={
                                                item.attributes[8] &&
                                                item.attributes[8].size
                                            }
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
                                        <label>Giá</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={
                                                item.attributes[8] &&
                                                item.attributes[8].price
                                            }
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
                                            defaultValue={
                                                item.attributes[8] &&
                                                item.attributes[8].stock
                                            }
                                            {...register("quantity9", {
                                                required: true,
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
                                            defaultValue={
                                                item.attributes[9] &&
                                                item.attributes[9].size
                                            }
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
                                        <label>Giá</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={
                                                item.attributes[9] &&
                                                item.attributes[9].price
                                            }
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
                                            defaultValue={
                                                item.attributes[9] &&
                                                item.attributes[9].stock
                                            }
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
