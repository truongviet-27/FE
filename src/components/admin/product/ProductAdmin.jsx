import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { getAllProductsByBrand, getListHot } from "../../../api/ProductApi";
import { NavLink } from "react-router-dom";
import { getBrands } from "../../../api/BrandApi";
import { toast } from "react-toastify";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [brand, setBrand] = useState([]);
    const [size, setSize] = useState(10);

    function formatCurrency(price) {
        return price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    }

    useEffect(() => {
        onLoad();
    }, [page, size]);

    const onLoad = () => {
        getAllProductsByBrand(null, page, size)
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
                toast.warning(error.response.data.message);
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
                onClick={() => onChangePage(index)}
            >
                {index + 1}
            </button>
        </li>
    ));

    // const getListHotProduct = () => {
    //   getListHot(0, 20)
    //     .then((resp) => {
    //       setProducts(resp.data.content)
    //       console.log(resp.data.content)
    //     })
    //     .catch((error) => console.log(error))
    // }

    const getProductByBrandHandler = (value) => {
        if (value == 0) {
            onLoad();
        } else {
            getAllProductsByBrand(value, 0, 10)
                .then((resp) => {
                    setProducts(resp.data.content);
                    setTotal(resp.data.totalPages);
                })
                .catch((error) => console.log(error));
        }
    };
    return (
        <>
            <div className="card flex flex-col justify-between !mx-[25px] overflow-y-hidden">
                <div>
                    <div className="card__header">
                        <NavLink
                            to="/admin/product/add-product"
                            className="btn btn-primary"
                            style={{ borderRadius: 50 }}
                        >
                            Thêm sản phẩm
                        </NavLink>
                    </div>
                    <div className="row mb-3 mt-3">
                        <div className="col-sm-4 mt-2">
                            <select
                                className="form-control"
                                onChange={(event) =>
                                    getProductByBrandHandler(event.target.value)
                                }
                            >
                                <option value={""}>Tất cả</option>
                                {brand &&
                                    brand.map((item, index) => (
                                        <option key={index} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-[500px]">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">Tên sản phẩm</th>
                                    <th scope="col">Mã sản phẩm</th>
                                    <th scope="col">Thương hiệu</th>
                                    <th scope="col">Hình ảnh</th>

                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Cập nhật</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {products?.map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">
                                            <NavLink
                                                to={`/admin/product/product-view/${item._id}`}
                                                exact
                                            >
                                                {index + 1 + page * size}
                                            </NavLink>
                                        </th>
                                        <th>{item.name}</th>
                                        <th>{item.code}</th>
                                        <th>{item?.brand?.name}</th>
                                        <th className="flex items-center justify-center h-[60px] border-0">
                                            <img
                                                className="img-fluid"
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                }}
                                                src={item.image}
                                                alt=""
                                            />
                                        </th>
                                        {/* <th>{formatCurrency(item.price)}</th> */}
                                        <th>
                                            {item.isActive
                                                ? "Đang bán"
                                                : "Dừng bán"}
                                        </th>
                                        <th>
                                            <NavLink
                                                to={`/admin/product/product-detail/${item._id}`}
                                                exact
                                            >
                                                <i
                                                    className="fa fa-pencil-square-o"
                                                    aria-hidden="true"
                                                ></i>
                                            </NavLink>
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <nav
                    aria-label="Page navigation"
                    className="flex items-center justify-between mt-3"
                >
                    <div className="w-[100px]" />

                    <div className="flex-1 flex justify-center items-center">
                        <div className="flex pagination gap-2">
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
        </>
    );
};

export default Product;
