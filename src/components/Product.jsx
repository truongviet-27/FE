import React, { useState, useEffect } from "react";
import {
    getAllProducts,
    filterProducts,
    toggleLikeProduct,
} from "../api/ProductApi";
import { getBrands } from "../api/BrandApi";
import { getCategory } from "../api/CategoryApi";
import { NavLink } from "react-router-dom";
import { Collapse } from "antd";
import "./sidebar/sidebar.css";
import { toast } from "react-toastify";

const { Panel } = Collapse;
const prices = [
    {
        display_name: "Dưới 1 triệu",
        value: "0",
        icon: "bx bx-category-alt",
        min: 0,
        max: 1000000,
    },
    {
        display_name: "1.000.000 - 2.000.000",
        value: "1",
        icon: "bx bx-category-alt",
        min: 1000000,
        max: 2000000,
    },
    {
        display_name: "2.000.000 - 3.000.000",
        value: "2",
        icon: "bx bx-category-alt",
        min: 2000000,
        max: 3000000,
    },
    {
        display_name: "3.000.000 - 4.000.000",
        value: "3",
        icon: "bx bx-category-alt",
        min: 3000000,
        max: 4000000,
    },
    {
        display_name: "Trên 4 triệu",
        value: "4",
        icon: "bx bx-category-alt",
        min: 4000000,
        max: 10000000,
    },
];

const count = 12;
const defaultBrand = [1, 2, 3, 4, 5, 6, 7];
const defaultCategory = [1, 2, 3, 4, 5, 6, 7];

const Product = (props) => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState({});
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [brandIds, setBrandIds] = useState([]);
    const [price, setPrice] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [isFilter, setIsFilter] = useState(false);

    useEffect(() => {
        getBrands(0, 100).then((response) => {
            setBrands(response.data.content);
        });
    }, []);

    useEffect(() => {
        getCategory(0, 100).then((response) => {
            setCategories(response.data.content);
        });
    }, []);

    var rows = new Array(total).fill(0).map((zero, index) => (
        <li
            className={page === index ? "page-item active" : "page-item"}
            key={index}
        >
            <button className="page-link" onClick={() => onChangePage(index)}>
                {index + 1}
            </button>
        </li>
    ));
    const handleLike = (productId, currentLikeStatus) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Vui lòng đăng nhập trước khi yêu thích sản phẩm");
            return;
        }

        toggleLikeProduct(productId, !currentLikeStatus, token)
            .then((response) => {
                toast.success(response.data.message);
                if (
                    categoryIds.length === 0 &&
                    brandIds.length === 0 &&
                    price.length === 0
                ) {
                    getAllProducts(
                        page,
                        10,
                        true,
                        localStorage.getItem("id")
                    ).then((response) => {
                        setProducts(response?.data.content);
                        setTotal(response.data.totalPages);
                    });
                } else {
                    const data = {
                        page: page,
                        size: 10,
                        categoryIds: categoryIds.length > 0 ? categoryIds : [],
                        brandIds: brandIds.length > 0 ? brandIds : [],
                        min: min,
                        max: max,
                        userId: localStorage.getItem("id"),
                    };
                    filterProducts(data)
                        .then((resp) => {
                            setProducts(resp?.data.content);
                            setTotal(resp.data.totalPages);
                        })
                        .catch((error) => {
                            setProducts([]);
                            setTotal(0);
                            toast.error("Không tìm thấy sản phẩm ");
                        });
                }
                // getAllProducts(page, 10, true, localStorage.getItem("id")).then(
                //     (response) => {
                //         setProducts(response?.data?.content);
                //         setTotal(response?.data.totalPages);
                //     }
                // );
            })
            .catch((error) => {
                console.error("Lỗi khi thực hiện thao tác like: ", error);
            });
    };

    useEffect(() => {
        if (
            categoryIds.length === 0 &&
            brandIds.length === 0 &&
            price.length === 0
        ) {
            getAllProducts(page, 10, true, localStorage.getItem("id")).then(
                (response) => {
                    setProducts(response?.data.content);
                    setTotal(response.data.totalPages);
                }
            );
        } else {
            const data = {
                page: page,
                size: 10,
                categoryIds: categoryIds.length > 0 ? categoryIds : [],
                brandIds: brandIds.length > 0 ? brandIds : [],
                min: min,
                max: max,
                userId: localStorage.getItem("id"),
            };
            filterProducts(data)
                .then((resp) => {
                    setProducts(resp?.data.content);
                    setTotal(resp.data.totalPages);
                    toast.success(resp.data.message);
                })
                .catch((error) => {
                    setProducts([]);
                    setTotal(0);
                    toast.error("Không tìm thấy sản phẩm ");
                });
        }
    }, [page, categoryIds, brandIds, price, localStorage.getItem("token")]);

    console.log(products, "products");

    const onChangePage = (page) => {
        setPage(page);
    };

    const chooseCategoryHandler = (value) => {
        const index = categoryIds.indexOf(value);
        if (index > -1) {
            setCategoryIds(categoryIds.filter((i) => i !== value));
        } else {
            setCategoryIds([...categoryIds, value]);
        }
        onChangePage(0);
    };

    console.log(brandIds, "brandIds");

    const chooseBrandHandler = (value) => {
        const index = brandIds.indexOf(value);
        if (index > -1) {
            setBrandIds(brandIds.filter((i) => i !== value));
        } else {
            setBrandIds([...brandIds, value]);
        }
        onChangePage(0);
    };
    const choosePriceHandler = (value) => {
        const index = price.indexOf(value);
        console.log(index, "index");
        if (index > -1) {
            setPrice([]);
            setMin(0);
            setMax(10000000);
        } else {
            setPrice([value]);
            setMin(prices[value].min);
            setMax(prices[value].max);
        }
        onChangePage(0);
    };
    return (
        <div className="col-12">
            <div className="mt-5 !px-5">
                <div className="row">
                    <div className="col-2 lg:col-3 md:col-4 !mb-20">
                        <Collapse accordion>
                            <Panel header="Thương hiệu" key="1">
                                <ul className="list-group flex flex-col gap-2">
                                    {brands?.map((item, index) => (
                                        <button
                                            className={`!text-[14px] !px-4 text-black ${
                                                brandIds.includes(item?._id)
                                                    ? `!bg-neutral-300`
                                                    : ``
                                            }`}
                                            key={item._id}
                                            onClick={() =>
                                                chooseBrandHandler(item._id)
                                            }
                                        >
                                            <div className={`text-left`}>
                                                <i className="bx bx-category-alt"></i>
                                                <span className="!ml-1">
                                                    {item?.name}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </ul>
                            </Panel>
                            <Panel header="Loại sản phẩm" key="2">
                                <ul className="list-group flex flex-col gap-2">
                                    {categories?.map((item, index) => (
                                        <button
                                            className={`!text-[14px] !px-4 text-black ${
                                                categoryIds.includes(item?._id)
                                                    ? `!bg-neutral-300`
                                                    : ``
                                            }`}
                                            key={item._id}
                                            onClick={() =>
                                                chooseCategoryHandler(item?._id)
                                            }
                                        >
                                            <div className={`text-left`}>
                                                <i className="bx bx-category-alt"></i>
                                                <span className="!ml-1">
                                                    {item?.name}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </ul>
                            </Panel>
                            <Panel header="Giá" key="3">
                                <ul className="list-group flex flex-col gap-2">
                                    {prices?.map((item, index) => (
                                        <button
                                            className={`!text-[14px] !px-4 !text-left !text-black ${
                                                (prices.includes(item?._id)
                                                    ? `!bg-neutral-300`
                                                    : ``,
                                                console.log(
                                                    prices.includes(item?._id),
                                                    "xxxxxxx"
                                                ))
                                            } w-full`}
                                            onClick={() =>
                                                choosePriceHandler(item.value)
                                            }
                                            key={index}
                                        >
                                            <div className="text-left">
                                                <i className={item.icon}></i>
                                                <span className="!ml-1">
                                                    {item.display_name}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </ul>
                            </Panel>
                        </Collapse>
                    </div>

                    <div className="col-10 lg:col-9 md:col-8">
                        <div className="container-fluid padding">
                            <div className="row welcome mini-card">
                                <h4 className="title text-danger !mb-0">
                                    Sản phẩm nổi bật
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 !mt-10">
                                {products?.map((item) => (
                                    <div className="mb-3" key={item._id}>
                                        <div className="border rounded-2xl p-4 !overflow-y-hidden !h-full relative">
                                            <div className="absolute">
                                                <span className="text-white bg-success small flex items-center px-2 py-1">
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <span className="ml-1">
                                                        New
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="position-absolute right-6 text-[#EE4D2D] bg-[#FEEEEA] flex items-center px-2 py-1 text-[14px] font-medium">
                                                <span className="ml-1">
                                                    Đã bán 12
                                                </span>
                                            </div>

                                            <NavLink
                                                to={`/product-detail/${item._id}`}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    height: "250px",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <img
                                                    src={item?.image}
                                                    alt="Product"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                    className="mini-card"
                                                />
                                            </NavLink>

                                            <div className="card-body p-0">
                                                <div className="flex flex-col justify-between">
                                                    <div className="flex items-center gap-1 pr-4 pt-2 rounded-2xl text-[#EE4D2D] line-through">
                                                        <div className="flex gap-1 font-medium text-[12px]">
                                                            <span>
                                                                {Math.min(
                                                                    ...item.attributes.map(
                                                                        (a) =>
                                                                            a.price ??
                                                                            0
                                                                    )
                                                                ).toLocaleString()}{" "}
                                                            </span>
                                                            <span className="text-[12px]">
                                                                đ
                                                            </span>
                                                        </div>
                                                        <span>-</span>
                                                        <div className="flex gap-1 font-medium text-[12px]">
                                                            <span>
                                                                {Math.max(
                                                                    ...item.attributes.map(
                                                                        (a) =>
                                                                            a.price ??
                                                                            0
                                                                    )
                                                                ).toLocaleString()}{" "}
                                                            </span>
                                                            <span className="text-[12px]">
                                                                đ
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3 mb-1 items-center pr-4 py-2 rounded-2xl text-[#EE4D2D]">
                                                        <div className="flex gap-2">
                                                            <span className="font-medium text-[16px]">
                                                                {(
                                                                    (Math.min(
                                                                        ...item.attributes.map(
                                                                            (
                                                                                a
                                                                            ) =>
                                                                                a.price ??
                                                                                0
                                                                        )
                                                                    ) *
                                                                        (100 -
                                                                            item
                                                                                ?.sale
                                                                                ?.discount)) /
                                                                    100
                                                                ).toLocaleString()}{" "}
                                                                <span className="text-[12px]">
                                                                    đ
                                                                </span>
                                                            </span>
                                                            <span>-</span>
                                                            <span className="font-medium text-[16px]">
                                                                {(
                                                                    (Math.max(
                                                                        ...item.attributes.map(
                                                                            (
                                                                                a
                                                                            ) =>
                                                                                a.price ??
                                                                                0
                                                                        )
                                                                    ) *
                                                                        (100 -
                                                                            item
                                                                                ?.sale
                                                                                ?.discount)) /
                                                                    100
                                                                ).toLocaleString()}{" "}
                                                                <span className="text-[12px]">
                                                                    đ
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="font-medium text-[14px]">
                                                            (
                                                            {
                                                                item?.sale
                                                                    ?.discount
                                                            }
                                                            %)
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-warning d-flex align-items-center mb-3">
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                </p>
                                                <div className="mb-0">
                                                    <span>{item?.name}</span>
                                                </div>
                                                <div className="!my-3">
                                                    <span className="font-medium">
                                                        Thương hiệu:
                                                    </span>
                                                    <span>
                                                        {item?.brand?.name}
                                                    </span>
                                                </div>
                                                <div className="flex mb-3 justify-content-between">
                                                    <div className="flex gap-4">
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">
                                                                Lượt xem:
                                                            </span>
                                                            <span className="">
                                                                {item?.view}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">
                                                                Yêu thích:
                                                            </span>
                                                            <span className="">
                                                                {
                                                                    item
                                                                        ?.likeQuantity
                                                                        ?.length
                                                                }{" "}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <div className="">
                                                        <NavLink
                                                            to={`/product-detail/${item._id}`}
                                                            exact
                                                            className="btn btn-outline-primary btn-block"
                                                        >
                                                            <span className="!mr-2">
                                                                Thêm vào giỏ
                                                            </span>
                                                            <i
                                                                className="fa fa-shopping-basket ml-10"
                                                                aria-hidden="true"
                                                            ></i>
                                                        </NavLink>
                                                    </div>
                                                    <div className="ml-2">
                                                        <NavLink
                                                            to="#"
                                                            className="btn btn-outline-success"
                                                            data-toggle="tooltip"
                                                            data-placement="left"
                                                            title="Add to Wishlist"
                                                            onClick={() =>
                                                                handleLike(
                                                                    item._id,
                                                                    item?.liked
                                                                )
                                                            }
                                                        >
                                                            <i
                                                                className={`fa fa-heart ${
                                                                    item?.liked
                                                                        ? "text-danger"
                                                                        : ""
                                                                }`}
                                                                aria-hidden="true"
                                                            ></i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <nav
                                aria-label="Page navigation flex justify-center"
                                className="!mt-10 !mb-20"
                            >
                                <ul className="flex justify-center pagination mt-3 w-full gap-4">
                                    <li
                                        className={
                                            page === 0
                                                ? "page-item disabled"
                                                : "page-item"
                                        }
                                    >
                                        <button
                                            className="page-link"
                                            style={{ borderRadius: 50 }}
                                            onClick={() => onChangePage(0)}
                                        >
                                            {"<<"}
                                        </button>
                                    </li>
                                    {rows}
                                    <li
                                        className={
                                            page === total - 1
                                                ? "page-item disabled"
                                                : "page-item"
                                        }
                                    >
                                        <button
                                            className="page-link"
                                            style={{ borderRadius: 50 }}
                                            onClick={() =>
                                                onChangePage(total - 1)
                                            }
                                        >
                                            {`>>`}
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
