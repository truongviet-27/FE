import React, { useState, useEffect } from "react";
import { getOrderByProduct } from "../../../api/OrderApi";
import { NavLink, useHistory, useParams } from "react-router-dom";
import formatDate from "../../../utils/convertDate";
import convertStatusOrder from "../../../utils/convertStatusOrder";
import truncateWords from "../../../utils/truncateWord";

const OrderProduct = () => {
    const { id } = useParams();
    const history = useHistory();

    const [order, setOrder] = useState([]);
    const [total, setTotal] = useState();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    var rows = new Array(total).fill(0).map((zero, index) => (
        <li
            className={page === index + 1 ? "page-item active" : "page-item"}
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
        getOrderByProduct(id, page, size)
            .then((resp) => {
                setOrder(resp.data.content);
                setTotal(resp.data.totalPages);
            })
            .catch((error) => console.log(error));
    }, [page, size]);

    const onChangePage = (page) => {
        setPage(page);
    };
    const goBack = () => {
        history.goBack();
    };
    return (
        <div className="col-12">
            <div className="card">
                <div className="col-12 flex items-center justify-between text-center mb-5">
                    <button style={{ width: 60 }} onClick={() => goBack()}>
                        <i
                            className="fa fa-arrow-left"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                        ></i>
                    </button>
                    <h2 className="text-danger !mb-0">
                        Đơn hàng theo sản phẩm
                    </h2>
                    <div className="w-[60px]"></div>
                </div>
                <div className="card__body !mt-0">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Mã đơn hàng
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Tên khách hàng
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Số điện thoại
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Địa chỉ
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Ngày tạo
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Trạng thái đơn hàng
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Tổng tiền
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.map((item, index) => (
                                <tr key={item._id}>
                                    <td
                                        scope="row"
                                        className="text-center align-middle font-medium hover:!text-blue-600 !py-5"
                                        onClick={() => {
                                            history.push(
                                                `/admin/detail-order/${item._id}`
                                            );
                                        }}
                                    >
                                        {item.code}
                                    </td>
                                    <td className="text-center align-middle font-medium">
                                        {item.fullName}
                                    </td>
                                    <td className="text-center align-middle font-medium">
                                        {item.phone}
                                    </td>
                                    <td
                                        className="text-center align-middle font-medium"
                                        title={item.address}
                                    >
                                        {truncateWords(item.address)}
                                    </td>
                                    <td className="text-center align-middle font-medium">
                                        {formatDate(item.createdAt, true)}
                                    </td>
                                    <td className="text-center align-middle font-medium">
                                        {convertStatusOrder(item.orderStatus)}
                                    </td>
                                    <td className="text-center align-middle font-medium">
                                        {item.total.toLocaleString()} VNĐ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
            </div>
        </div>
    );
};

export default OrderProduct;
