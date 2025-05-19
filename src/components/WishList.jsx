/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { getAllProductWishList } from "../api/ProductApi";
import { NavLink } from "react-router-dom";
import { getBrands } from "../api/BrandApi";
import { toast } from "react-toastify";

const WishList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [brand, setBrand] = useState([]);
    const [size, setSize] = useState(10);

    useEffect(() => {
        onLoad();
    }, [page, localStorage.getItem("token"), size]);

    const onLoad = () => {
        const token = localStorage.getItem("token") || null;
        getAllProductWishList(token, page, 10)
            .then((response) => {
                setProducts(response.data.content);
                setTotal(response.data.totalPages);
            })
            .catch((error) => {
                toast.warning(error.response.data.message);
            });

        getBrands(0, 20)
            .then((resp) => setBrand(resp.data.content))
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const onChangePage = (page) => {
        setPage(page);
    };

    var rows = new Array(total).fill(0).map((zero, index) => (
        <li
            className={page === index ? "page-item active" : "page-item"}
            key={index}
        >
            <button
                className="page-link"
                style={{ borderRadius: 50 }}
                onClick={() => onChangePage(index + 1)}
            >
                {index + 1}
            </button>
        </li>
    ));

    const getProductByBrandHandler = (value) => {
        const token = localStorage.getItem("token") || null;
        if (value == 0) {
            onLoad();
        } else {
            getAllProductWishList(token, 0, 10)
                .then((resp) => {
                    setProducts(resp.data.content);
                    setTotal(resp.data.totalPages);
                })
                .catch((error) => {
                    toast.warning(error.response.data.message);
                });
        }
    };
    return (
        <div className="col-12 !mb-20">
            <div className="">
                <div className="row mb-3 mt-3">
                    <div className="col-sm-4 mt-2">
                        <select
                            className="form-control"
                            onChange={(event) =>
                                getProductByBrandHandler(event.target.value)
                            }
                        >
                            <option value="0">Tất cả</option>
                            {brand?.map((item, index) => (
                                <option key={index} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="card__body">
                    <div className="table-wrapper">
                        <table className="table table-striped table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        STT
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Hình ảnh
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Tên sản phẩm
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Mã sản phẩm
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Thương hiệu
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((item, index) => (
                                    <tr key={item._id}>
                                        <td
                                            scope="row"
                                            className="text-center align-middle font-bold"
                                        >
                                            <NavLink
                                                to={`/product-detail/${item._id}`}
                                                exact
                                            >
                                                {index + 1 + page * size}
                                            </NavLink>
                                        </td>
                                        <td className="text-center align-middle font-bold">
                                            <div className="flex justify-center">
                                                <img
                                                    className="img-fluid"
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                    }}
                                                    src={
                                                        item?.imageUrls[0]?.url
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                        </td>
                                        <td className="text-center align-middle font-bold">
                                            {item.name}
                                        </td>
                                        <td className="text-center align-middle font-bold">
                                            {item.code}
                                        </td>
                                        <td className="text-center align-middle font-bold">
                                            {item?.brand?.name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <nav
                    aria-label="Page navigation"
                    className="flex items-center justify-between !mt-10 !mb-20"
                >
                    <div className="w-[100px]" />

                    <div className="flex-1 flex justify-center items-center">
                        <div className="flex pagination gap-4">
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
                                    {`<<`}
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
                                    onClick={() => onChangePage(page + 1)}
                                >
                                    {`>>`}
                                </button>
                            </li>
                        </div>
                    </div>

                    <div className="w-[100px] flex justify-end">
                        <select
                            className="py-2 pl-2 border border-gray-100 rounded-[6px]"
                            onChange={(e) => setSize(e.target.value)}
                            value={size}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </nav>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận cập nhật?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleClose}>
                                Xác nhận
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Đóng
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default WishList;
