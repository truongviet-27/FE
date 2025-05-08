import React, { useState, useEffect } from "react";
import { reportAmountMonth } from "../../../api/OrderApi";
import { NavLink, useHistory, useParams } from "react-router-dom";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const ReportMonth = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const [month, setMonth] = useState([]);
    const [year, setYear] = useState();
    const [order, setOrder] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState();
    const [select, setSelect] = useState();
    const maxValue = Math.max(...month.map((item) => item.total));
    console.log("MAX" + maxValue);
    useEffect(() => {
        setYear(id);
        reportAmountMonth(id)
            .then((resp) => {
                // Lấy dữ liệu doanh thu của từng tháng
                const data = resp.data;
                // Tạo mảng doanh thu cho tất cả 12 tháng
                const fullYearData = Array.from({ length: 12 }, (_, index) => {
                    const monthData = data.find(
                        (item) => item.month === index + 1
                    );
                    return {
                        month: index + 1,
                        total: monthData ? monthData.total : 0, // Nếu không có dữ liệu thì gán total = 0
                    };
                });
                setMonth(fullYearData);
            })
            .catch((error) => console.log(error));
        props.yearHandler(id);
    }, [id]);

    const goBack = () => {
        history.goBack();
    };

    const changeYearHandler = (value) => {
        setYear(value);
        setOrder([]);
        reportAmountMonth(value)
            .then((resp) => {
                // Tạo mảng doanh thu cho tất cả 12 tháng
                const data = resp.data;
                const fullYearData = Array.from({ length: 12 }, (_, index) => {
                    const monthData = data.find(
                        (item) => item.month === index + 1
                    );
                    return {
                        month: index + 1,
                        total: monthData ? monthData.total : 0,
                    };
                });
                setMonth(fullYearData);
            })
            .catch((error) => console.log(error));
        props.yearHandler(value);
    };

    const onChangePage = (page) => {
        setPage(page);
    };

    const clickHandler = (value) => {
        setSelect(value);
        // Fetch data for the selected month (orders, etc.)
        // Example: getOrderByOrderStatusAndYearAndMonth(4, year, value, page, 8)
    };

    return (
        <div className="col-12">
            <div className="card">
                <button style={{ width: 60 }} onClick={() => goBack()}>
                    <i
                        className="fa fa-arrow-left"
                        style={{ fontSize: 18 }}
                        aria-hidden="true"
                    ></i>
                </button>
                <div className="card__header text-center">
                    <h3 className="text-primary">Doanh thu của Năm {year}</h3>
                </div>
                <div className="col-sm-4 mt-2">
                    <select
                        className="form-control"
                        onChange={(e) => changeYearHandler(e.target.value)}
                        defaultValue={id}
                    >
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </div>
                <div className="card__body">
                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart
                            data={month}
                            margin={{ top: 20, right: 5, left: 50, bottom: 5 }}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            {/* Cách điều chỉnh phạm vi trục Y */}
                            <YAxis domain={[0, maxValue + maxValue]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {order.length > 0 && (
                <div className="card">
                    <div className="card__header text-center">
                        <h3 className="text-primary">Đơn hàng trong tháng</h3>
                    </div>
                    <div className="card__body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Mã đơn hàng</th>
                                    <th scope="col">Tên khách hàng</th>
                                    <th scope="col">Số điện thoại</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Ngày tạo</th>
                                    <th scope="col">Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order &&
                                    order.map((item, index) => (
                                        <tr key={index}>
                                            <th scope="row">
                                                <NavLink
                                                    to={`/detail-order/${item.id}`}
                                                    exact
                                                >
                                                    #OD{item.id}
                                                </NavLink>
                                            </th>
                                            <td>{item.fullname}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.address}</td>
                                            <td>{item.createdAt}</td>
                                            <td>{item.total}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <nav aria-label="navigation">
                            <ul className="flex justify-center pagination mt-3 w-full flex justify-center gap-2">
                                {/* Pagination controls */}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportMonth;
