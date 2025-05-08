import { NavLink } from "react-router-dom";
import { Carousel } from "antd";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import first from "../static/images/slider_6.jpg";
import second from "../static/images/slider_2_image.jpg";
import third from "../static/images/slider_4_image.jpg";
import fourth from "../static/images/slider_7.jpg";
import React, { useState, useEffect } from "react";
import { getAllProducts, toggleLikeProduct } from "../api/ProductApi";
import ChatAI from "./ChatAI";
import "../static/css/home.css";
import { toast } from "react-toastify";

const Home = (props) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState({});
    const [active, setActive] = useState(true);

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

    useEffect(() => {
        const token = localStorage.getItem("token") || null;
        console.log("TOKEN HOME:", token);
        getAllProducts(page, 10, active, token)
            .then((response) => {
                setProducts(response.content); // Lưu các sản phẩm vào state
                setTotal(response.totalPages);
            })
            .catch(() => toast.warning("Không có sản phẩm!!"));
    }, [page, localStorage.getItem("token")]);

    const onChangePage = (page) => {
        setPage(page);
    };

    const handleLike = (productId, currentLikeStatus) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Vui lòng đăng nhập trước khi yêu thích sản phẩm");
            return;
        }

        toggleLikeProduct(productId, !currentLikeStatus, token)
            .then((response) => {
                getAllProducts(page, 12, active, token).then((response) => {
                    setProducts(response.content);
                    setTotal(response.totalPages);
                });
            })
            .catch((error) => {
                console.error("Lỗi khi thực hiện thao tác like: ", error);
            });
    };

    return (
        <div>
            <Carousel autoplay autoplaySpeed={100000} style={{ width: "100%" }}>
                <div>
                    <img
                        src={second}
                        alt="Second slide"
                        style={{ width: "100%", height: "700px" }}
                    />
                </div>
                <div>
                    <img
                        src={first}
                        alt="First slide"
                        style={{ width: "100%", height: "700px" }}
                    />
                </div>
                <div>
                    <img
                        src={third}
                        alt="Third slide"
                        style={{ width: "100%", height: "700px" }}
                    />
                </div>
                <div>
                    <img
                        src={fourth}
                        alt="Fourth slide"
                        style={{ width: "100%", height: "700px" }}
                    />
                </div>
            </Carousel>

            {/* Các phần hiển thị sản phẩm khác */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 !mt-20 !px-10">
                {products?.map((item) => (
                    <div className="mb-3" key={item._id}>
                        {/* Sử dụng item.id làm key */}
                        <div className="border rounded-2xl p-4 !overflow-y-hidden !h-full">
                            <div className="d-flex justify-content-between position-absolute">
                                <div className="label-new">
                                    <span className="text-white bg-success small d-flex align-items-center px-2 py-1">
                                        <i
                                            className="fa fa-star"
                                            aria-hidden="true"
                                        ></i>
                                        <span className="ml-1">New</span>
                                    </span>
                                </div>
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

                            <div className="card-body px-2 pb-2 pt-1">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <p className="h4 text-primary mini-card">
                                            {(
                                                (item?.price *
                                                    (100 -
                                                        item?.sale?.discount)) /
                                                100
                                            ).toLocaleString()}{" "}
                                            đ
                                        </p>
                                    </div>
                                </div>
                                <p className="text-warning d-flex align-items-center mb-2">
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
                                <p className="mb-0">
                                    <strong>
                                        <NavLink
                                            to={`/product-detail/${item._id}`}
                                            className="text-secondary"
                                        >
                                            {item?.name}
                                        </NavLink>
                                    </strong>
                                </p>
                                <p className="mb-1">
                                    <small>
                                        <NavLink
                                            to="#"
                                            className="text-secondary "
                                        >
                                            {item?.brand?.name}
                                        </NavLink>
                                    </small>
                                </p>
                                <div className="d-flex mb-3 justify-content-between">
                                    <div>
                                        <p className="mb-0 small">
                                            <b>Yêu thích: </b> {item?.view} lượt
                                        </p>
                                        <p className="mb-0 small">
                                            <b>
                                                Giá gốc:{" "}
                                                {item?.price?.toLocaleString()}{" "}
                                                đ
                                            </b>
                                        </p>
                                        <p className="mb-0 small text-danger">
                                            <span className="font-weight-bold">
                                                Tiết kiệm:{" "}
                                            </span>{" "}
                                            {(
                                                (item?.price * item?.discount) /
                                                100
                                            ).toLocaleString()}{" "}
                                            đ ({item?.sale?.discount}%)
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="col px-0 ">
                                        <NavLink
                                            to={`/product-detail/${item._id}`}
                                            exact
                                            className="btn btn-outline-primary btn-block"
                                        >
                                            <span className="mr-2">
                                                {" "}
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

            {/* Pagination */}
            <nav aria-label="Page navigation">
                <ul className="pagination mt-3 w-full flex justify-center gap-2">
                    <li
                        className={
                            page === 0 ? "page-item disabled" : "page-item"
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
            <div>
                <ChatAI></ChatAI>
            </div>
        </div>
    );
};

export default Home;
