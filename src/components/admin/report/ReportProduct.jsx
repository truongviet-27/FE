import React, { useState, useEffect } from "react";
import { reportByProduct } from "../../../api/OrderApi";
import { NavLink, useHistory } from "react-router-dom";

const ReportProduct = () => {
    const [product, setProduct] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState();
    const [sort, setSort] = useState("totalRevenue");
    const history = useHistory();
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

    useEffect(() => {
        reportByProduct(page, size, sort)
            .then((resp) => {
                setProduct(resp.data.content);
                setTotal(resp.data.totalPages);
            })
            .catch((error) => console.log(error));
    }, [page, size, sort]);

    const onChangePage = (page) => {
        setPage(page);
    };
    const goBack = () => {
        history.goBack();
    };
    return (
        <div className="card flex flex-col !mx-[25px] overflow-y-hidden">
            <div className="col-12 flex items-center justify-between text-center mb-4">
                <button style={{ width: 60 }} onClick={() => goBack()}>
                    <i
                        className="fa fa-arrow-left"
                        style={{ fontSize: 18 }}
                        aria-hidden="true"
                    ></i>
                </button>
                <div className="card__header">
                    <h3 className="text-danger">Doanh thu theo sản phẩm</h3>
                </div>
                <div className="w-[60px]"></div>
            </div>

            <div className="flex items-center justify-end gap-3 !mt-0">
                <select
                    className="form-control !w-[150px]"
                    onChange={(e) => {
                        setSort(e.target.value);
                    }}
                >
                    <option value={"totalRevenue"}>Doanh thu</option>
                    <option value={"totalQuantity"}>Số lượng bán</option>
                    <option value={"orderDetailLength"}>Số lượng đơn</option>
                </select>
            </div>
            <div className="card__body min-h-[450px]">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
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
                                Tên sản phẩm
                            </th>
                            <th
                                scope="col"
                                className="text-center align-middle"
                            >
                                Số lượng bán
                            </th>
                            <th
                                scope="col"
                                className="text-center align-middle"
                            >
                                Số lượng đơn
                            </th>
                            <th
                                scope="col"
                                className="text-center align-middle"
                            >
                                Doanh thu
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {product?.map((item, index) => (
                            <tr key={item._id}>
                                <td
                                    className="text-center align-middle font-medium"
                                    scope="row"
                                >
                                    <NavLink
                                        to={`/admin/order-product/${item._id}`}
                                        exact
                                    >
                                        {item.productInfo.code}
                                    </NavLink>
                                </td>
                                <td className="text-center align-middle font-medium">
                                    {item.productInfo.name}
                                </td>
                                <td className="text-center align-middle font-medium">
                                    {item.totalQuantity ?? 0}
                                </td>
                                <td className="text-center align-middle font-medium">
                                    {item?.orderDetailIds?.length ?? 0}
                                </td>
                                <td className="text-center align-middle font-medium">
                                    {item.totalRevenue.toLocaleString() ?? 0}{" "}
                                    VNĐ
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                                page === 0 ? "page-item disabled" : "page-item"
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
                                onClick={() => onChangePage(total - 1)}
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
    );
};

export default ReportProduct;
