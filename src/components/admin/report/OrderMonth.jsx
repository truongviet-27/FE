import React, { useState, useEffect } from "react";
import {
    getOrderByOrderStatusAndYearAndMonth,
    getOrderByOrderYearAndMonth,
} from "../../../api/OrderApi";
import { NavLink, useHistory, useParams } from "react-router-dom";
import truncateWords from "../../../utils/truncateWord";
import formatDate from "../../../utils/convertDate";

const OrderMonth = (props) => {
    const { month } = useParams();
    const history = useHistory();

    const [order, setOrder] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const [total, setTotal] = useState();

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
        getOrderByOrderYearAndMonth(props.year, month, page, size)
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
                <div className="card__header text-center">
                    <h3 className="text-primary">Đơn hàng trong tháng</h3>
                </div>
                <button style={{ width: 60 }} onClick={() => goBack()}>
                    <i
                        className="fa fa-arrow-left"
                        style={{ fontSize: 18 }}
                        aria-hidden="true"
                    ></i>
                </button>
                <div className="card__body">
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
                                    Tổng tiền
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.map((item, index) => (
                                <tr key={index}>
                                    <td
                                        scope="row"
                                        className="text-center align-middle font-medium hover:!text-blue-600"
                                        onClick={() => {
                                            history.push(
                                                `/admin/detail-order/${item.id}`
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
                                        {item.total.toLocaleString()} VNĐ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <nav aria-label="navigation">
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
                                    {`<<`}
                                </button>
                            </li>
                            {rows}
                            <li
                                className={
                                    page === total
                                        ? "page-item disabled"
                                        : "page-item"
                                }
                            >
                                <button
                                    className="page-link"
                                    style={{ borderRadius: 50 }}
                                    onClick={() => onChangePage(total)}
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

export default OrderMonth;
