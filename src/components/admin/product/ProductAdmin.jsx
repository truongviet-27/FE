import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { getAllProductsByBrand, getListHot } from "../../../api/ProductApi";
import { NavLink } from "react-router-dom";
import { getBrands } from "../../../api/BrandApi";
import { toast } from "react-toastify";
import Badge from "../badge/Badge";
import { active } from "../../../enum/active";
import { useForm } from "react-hook-form";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [brands, setBrands] = useState([]);
    const [size, setSize] = useState(10);

    const { register, handleSubmit, getValues, setValue, watch } = useForm({
        defaultValues: {
            brandId: "",
            query: "",
            search: "",
        },
    });

    function formatCurrency(price) {
        return price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    }

    useEffect(() => {
        onLoad();
    }, [page, size, watch("brandId"), watch("query"), watch("search")]);

    const onLoad = () => {
        getAllProductsByBrand(
            getValues("brandId"),
            page,
            size,
            getValues("query"),
            getValues("search")
        )
            .then((response) => {
                setProducts(response.data.content);
                setTotal(response.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });
    };

    useEffect(() => {
        getBrands(0, 1000)
            .then((resp) => setBrands(resp.data.content))
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });
    }, []);

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

    // const getProductByBrandHandler = (value) => {
    //     if (value == 0) {
    //         onLoad();
    //     } else {
    //         getAllProductsByBrand(
    //             value,
    //             page,
    //             size,
    //             getValues("query"),
    //             getValues("search")
    //         )
    //             .then((resp) => {
    //                 setProducts(resp.data.content);
    //                 setTotal(resp.data.totalPages);
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //                 toast.error(error.response.data.message);
    //             });
    //     }
    // };
    const onSubmitHandler = handleSubmit((data) => {
        console.log(data, "data");
    });
    return (
        <>
            <div className="card flex flex-col justify-between !mx-[25px] overflow-y-hidden">
                <form onSubmit={onSubmitHandler}>
                    <div className="card__header mb-5 flex justify-between items-center">
                        <NavLink
                            to="/admin/product/add-product"
                            className="btn btn-primary"
                            style={{ borderRadius: 50 }}
                        >
                            Thêm sản phẩm
                        </NavLink>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-300 rounded-[6px] mr-2 !pr-2">
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    onChange={(e) =>
                                        setValue("search", e.target.value)
                                    }
                                    className="border-0 py-2 pl-2 rounded-[6px] focus:outline-none !text-[14px]"
                                    {...register("search")}
                                />
                                <i className="bx bx-search" />
                            </div>
                            <select
                                className="form-control"
                                // onChange={(event) =>
                                //     getProductByBrandHandler(event.target.value)
                                // }
                                {...register("brandId")}
                            >
                                <option value={""}>Tất cả</option>
                                {brands?.map((item, index) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-control"
                                {...register("query")}
                            >
                                <option value={""}>--- Lọc ---</option>
                                <option value={"isActive-true"}>
                                    Hoạt động
                                </option>
                                <option value={"isActive-false"}>
                                    Không hoạt động
                                </option>
                                <option value={"name-asc"}>Sắp xếp A-Z</option>
                                <option value={"name-desc"}>Sắp xếp Z-A</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-[500px]">
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
                                        Trạng thái
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Cập nhật
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {products?.map((item, index) => (
                                    <tr key={index}>
                                        <td
                                            className="text-center align-middle font-bold"
                                            scope="row"
                                        >
                                            <NavLink
                                                to={`/admin/product/product-view/${item._id}`}
                                                exact
                                            >
                                                {index + 1 + page * size}
                                            </NavLink>
                                        </td>
                                        <td className="text-center align-middle">
                                            {item.name}
                                        </td>
                                        <td className="text-center align-middle">
                                            {item.code}
                                        </td>
                                        <td className="text-center align-middle">
                                            {item?.brand?.name}
                                        </td>
                                        <td className="text-center align-middle flex items-center justify-center h-[80px] border-0">
                                            <img
                                                className="img-fluid"
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                }}
                                                src={item?.imageUrls[0]?.url}
                                                alt=""
                                            />
                                        </td>
                                        {/* <th>{formatCurrency(item.price)}</th> */}
                                        <td className="text-center align-middle">
                                            <Badge
                                                type={active[item.isActive]}
                                                content={
                                                    item.isActive
                                                        ? "Hoạt động"
                                                        : "Không hoạt động"
                                                }
                                            />
                                        </td>
                                        <td className="text-center align-middle">
                                            <NavLink
                                                to={`/admin/product/product-detail/${item._id}`}
                                                exact
                                            >
                                                <i
                                                    className="fa fa-pencil-square-o"
                                                    aria-hidden="true"
                                                ></i>
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </form>
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
