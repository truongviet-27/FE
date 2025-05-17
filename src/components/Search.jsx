import React, { useState, useEffect } from "react";
import { searchByKeyword, toggleLikeProduct } from "../api/ProductApi";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Search = (props) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(1);

    var rows = new Array(total).fill(0).map((zero, index) => (
        <li
            className={page === index ? "page-item active" : "page-item"}
            key={index}
        >
            <button
                className="page-link"
                style={{ borderRadius: 50 }}
                onClick={() => onChangePage(index)}
            >
                {index + 1}
            </button>
        </li>
    ));

    const onChangePage = (page) => {
        setPage(page);
    };

    useEffect(() => {
        searchByKeyword(page, 10, props.keyword, localStorage.getItem("id"))
            .then((response) => {
                setProducts(response.data.content);
                setTotal(response.data.totalPages);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setProducts([]); // Ensure we still set an empty array in case of error
            });
    }, [props.keyword, page]);

    const handleLike = (productId, currentLikeStatus) => {
        const token = localStorage.getItem("token");

        console.log(!currentLikeStatus, currentLikeStatus, "currentLikeStatus");

        if (!token) {
            toast.warning("Vui lòng đăng nhập trước khi yêu thích sản phẩm");
            return;
        }

        toggleLikeProduct(productId, !currentLikeStatus, token)
            .then((response) => {
                toast.success(response.data.message);
                searchByKeyword(
                    page,
                    10,
                    true,
                    localStorage.getItem("id")
                ).then((response) => {
                    setProducts(response.data.content);
                    setTotal(response.data.totalPages);
                });
            })
            .catch((error) => {
                console.error("Lỗi khi thực hiện thao tác like: ", error);
            });
    };

    return (
        <div className="col-12 !px-10 !mb-20">
            <div className="mini-card !mb-0">
                <div className="text-danger">
                    <h4 className="title !mb-0">Kết quả tìm kiếm</h4>
                </div>
            </div>
            <div className="">
                <div className="row padding d-flex">
                    {products.length === 0 && (
                        <div className="error-template !mt-5">
                            <h5 style={{ textAlign: "center" }}>
                                Không sản phẩm nào được tìm thấy
                            </h5>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 !mt-10">
                        {products?.map((item, index) => (
                            <div className="mb-3" key={item._id}>
                                <div className="border rounded-2xl p-4 !overflow-y-hidden !h-full relative">
                                    <div className="absolute">
                                        <span className="text-white bg-success small flex items-center px-2 py-1">
                                            <i
                                                className="fa fa-star"
                                                aria-hidden="true"
                                            ></i>
                                            <span className="ml-1">New</span>
                                        </span>
                                    </div>
                                    <div className="position-absolute right-6 text-[#EE4D2D] bg-[#FEEEEA] flex items-center px-2 py-1 text-[14px] font-medium">
                                        <span className="ml-1">Đã bán 12</span>
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
                                                                    a.price ?? 0
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
                                                                    a.price ?? 0
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
                                                                    (a) =>
                                                                        a.price ??
                                                                        0
                                                                )
                                                            ) *
                                                                (100 -
                                                                    item?.sale
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
                                                                    (a) =>
                                                                        a.price ??
                                                                        0
                                                                )
                                                            ) *
                                                                (100 -
                                                                    item?.sale
                                                                        ?.discount)) /
                                                            100
                                                        )?.toLocaleString()}{" "}
                                                        <span className="text-[12px]">
                                                            đ
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="font-medium text-[14px]">
                                                    ({item?.sale?.discount}
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
                                        <div className="flex gap-2 !my-3">
                                            <span className="font-medium">
                                                Thương hiệu:
                                            </span>
                                            <span>{item?.brand?.name}</span>
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
                                                            item?.likeQuantity
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
                                                    // onClick={() =>
                                                    //     handleLike(
                                                    //         item._id,
                                                    //         item?.liked
                                                    //     )
                                                    // }
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

                    <nav aria-label="Page navigation">
                        <ul className="pagination !mt-10 !mb-10 w-full flex justify-center gap-4">
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
                                    onClick={() => onChangePage(total - 1)}
                                >
                                    {`>>`}
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Search;
