import { useEffect, useState } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import {
    getOrderByOrderYearAndMonth,
    reportAmountMonth,
} from "../../../api/OrderApi";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import formatDate from "../../../utils/convertDate";

const ReportMonth = (props) => {
    const { year } = useParams();
    const history = useHistory();
    const [month, setMonth] = useState([]);
    const [yearState, setYearState] = useState();
    const [order, setOrder] = useState([]);
    const [page, setPage] = useState(0);
    const maxValue = Math.max(...month.map((item) => item.total));
    console.log("MAX" + maxValue);
    useEffect(() => {
        setYearState(year);
        reportAmountMonth(year)
            .then((resp) => {
                const data = resp.data.content;
                const fullYearData = Array.from({ length: 12 }, (_, index) => {
                    const monthData = data.find(
                        (item) => item.month === index + 1
                    );
                    return {
                        month: index + 1,
                        total: monthData ? monthData.totalRevenue : 0,
                    };
                });
                setMonth(fullYearData);
            })
            .catch((error) => console.log(error));
        props.yearHandler(year);
    }, [year]);

    const goBack = () => {
        history.goBack();
    };

    const changeYearHandler = (value) => {
        setYearState(value);
        setOrder([]);
        reportAmountMonth(value)
            .then((resp) => {
                const data = resp.data.content;
                const fullYearData = Array.from({ length: 12 }, (_, index) => {
                    const monthData = data.find(
                        (item) => item.month === index + 1
                    );
                    return {
                        month: index + 1,
                        total: monthData ? monthData.totalRevenue : 0,
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

    const clickHandler = async (data, index) => {
        const result = await getOrderByOrderYearAndMonth(
            yearState,
            data.month,
            page,
            10
        );
        setOrder(result.data.content);
    };

    return (
        <div className="col-12">
            <div className="card overflow-hidden">
                <div className="col-12 flex items-center justify-between text-center mb-4">
                    <button style={{ width: 60 }} onClick={() => goBack()}>
                        <i
                            className="fa fa-arrow-left"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                        ></i>
                    </button>
                    <h2 className="text-danger !mb-0">
                        Doanh thu của Năm {yearState}
                    </h2>
                    <div className="w-[60px]"></div>
                </div>
                <div className="col-sm-4 mt-2">
                    <select
                        className="form-control"
                        onChange={(e) => changeYearHandler(e.target.value)}
                        defaultValue={year}
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
                            <Bar
                                dataKey="total"
                                fill="#8884d8"
                                onClick={clickHandler}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {order.length > 0 && (
                <div className="card overflow-hidden">
                    <div className="card__header text-center">
                        <h3 className="text-primary">Đơn hàng trong tháng</h3>
                    </div>
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
                                            className="text-center align-middle font-medium"
                                            scope="row"
                                        >
                                            <NavLink
                                                to={`/admin/detail-order/${item._id}`}
                                                exact
                                            >
                                                #{item.code}
                                            </NavLink>
                                        </td>
                                        <td className="text-center align-middle font-medium">
                                            {item.fullName}
                                        </td>
                                        <td className="text-center align-middle font-medium">
                                            {item.phone}
                                        </td>
                                        <td className="text-center align-middle font-medium">
                                            {item.address.length > 30
                                                ? item.address.slice(0, 50) +
                                                  "..."
                                                : item.address}
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
