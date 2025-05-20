import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { countAccount } from "../../../api/AccountApi";
import {
    amountYear,
    countOrder,
    countOrderByName,
    reportAmountYear,
    reportByProduct,
} from "../../../api/OrderApi";
import { countProduct } from "../../../api/ProductApi";
import statusCards from "../../../assets/JsonData/status-card-data.json";
import StatusCard from "../status-card/StatusCard";

const Dashboard = () => {
    const [productChartOptions, setProductChartOptions] = useState({});
    const [productChartSeries, setProductChartSeries] = useState([]);
    const [yearChartOptions, setYearChartOptions] = useState({});
    const [yearChartSeries, setYearChartSeries] = useState([]);
    const [countOr, setCountOr] = useState({});
    const [total, setTotal] = useState();
    const [countAcc, setCountAcc] = useState();
    const [countPro, setCountPro] = useState();
    const [seriesChartDonut, setSeriesChartDonut] = useState([]);
    const [chartDonutOption, setChartDonutOption] = useState({});
    const [selectedYear, setSelectedYear] = useState("2024");

    const [isOpenOrder, setIsOpenOrder] = useState(false);

    const togglePopoverOrder = () => setIsOpenOrder(!isOpenOrder);

    const [isOpenTotal, setIsOpenTotal] = useState(false);

    const togglePopoverTotal = () => setIsOpenTotal(!isOpenTotal);

    const [actualRevenue, setActualRevenue] = useState();
    const [initialRevenue, setInitialRevenue] = useState();

    const history = useHistory();

    useEffect(() => {
        // Doanh thu theo sản phẩm
        reportByProduct(0, 10, "totalRevenue")
            .then((resp) => {
                const productNames = resp.data.content.map(
                    (item) => item.productInfo.name
                );
                const revenues = resp.data.content.map(
                    (item) => item.totalRevenue
                );
                const quantity = resp.data.content.map(
                    (item) => item.totalQuantity
                );
                const quantityOrder = resp.data.content.map(
                    (item) => item.orderDetailLength
                );
                setProductChartOptions({
                    chart: {
                        type: "bar",
                    },
                    xaxis: {
                        categories: productNames,
                    },
                    title: {
                        text: "10 sản phẩm doanh số cao nhất",
                        align: "center",
                    },
                });

                setProductChartSeries([
                    {
                        name: "Doanh thu",
                        data: revenues,
                    },
                    {
                        name: "Số lượng",
                        data: quantity,
                    },
                    {
                        name: "Số đơn hàng",
                        data: quantityOrder,
                    },
                ]);
            })
            .catch((error) => console.log(error));

        // Doanh thu theo năm
        reportAmountYear()
            .then((resp) => {
                const years = resp.data.data.map((item) => item.year);
                const revenues = resp.data.data.map((item) => item.totalAmount);

                setYearChartOptions({
                    chart: {
                        type: "line",
                    },
                    xaxis: {
                        categories: years,
                    },
                    title: {
                        text: "Doanh thu theo năm",
                        align: "center",
                    },
                });

                setYearChartSeries([
                    {
                        name: "Doanh thu",
                        data: revenues,
                    },
                ]);

                const totalRevenue = resp.data.data.reduce(
                    (sum, item) => sum + item.totalAmount,
                    0
                );
                setTotal(totalRevenue);
            })
            .catch((error) => console.log(error));

        // Đơn hàng theo danh mục
        countOrderByName()
            .then((resp) => {
                const categoryName = resp.data.content.map(
                    (item) => item.categoryName
                );
                setChartDonutOption({
                    labels: categoryName,
                });
                const total = resp.data.content.map(
                    (item) => item.totalRevenue
                );

                setSeriesChartDonut(total);
            })
            .catch((error) => toast.error(error.message));

        amountYear().then((resp) => {
            let actual = resp.data.data.isPaymentTrue.reduce((acc, curr) => {
                return acc + curr.totalAmount;
            }, 0);

            let initial = resp.data.data.isPaymentFalseNotDelivered.reduce(
                (acc, curr) => {
                    return acc + curr.totalAmount;
                },
                0
            );
            setActualRevenue(actual);
            setInitialRevenue(initial);
            setTotal(actual + initial);
        });
        // .catch((error) => toast.error(error.message));

        // Số lượng tài khoản
        countAccount()
            .then((resp) => setCountAcc(resp.data.data))
            .catch((error) => toast.error(error.message));

        // Số lượng sản phẩm
        countProduct()
            .then((resp) => setCountPro(resp.data.data))
            .catch((error) => toast.error(error.message));

        // Số lượng đơn hàng
        countOrder()
            .then((resp) => setCountOr(resp.data.data))
            .catch((error) => toast.error(error.message));
    }, []);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div className="col-12">
            <div className="card overflow-y-scroll">
                <h2 className="page-header">Thống kê</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 !ml-5 !mb-5">
                    <div className="card justify-between full-height overflow-hidden">
                        <div className="relative">
                            <div>
                                <StatusCard
                                    icon={statusCards[2].icon}
                                    count={`${
                                        total && (total ?? 0).toLocaleString()
                                    } VNĐ`}
                                    title={`Tổng doanh thu: `}
                                    onClick={() => {
                                        togglePopoverTotal();
                                    }}
                                    onBlur={() => {
                                        console.log("xxxxxxxxxxxxxxxxx");
                                        setIsOpenTotal(false);
                                    }}
                                />
                            </div>
                            {isOpenTotal && (
                                <div
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        top: "70%",
                                        padding: "10px 25px",
                                        backgroundColor: "#fff",
                                        boxShadow:
                                            "0 2px 10px rgba(0,0,0,0.15)",
                                        borderRadius: 6,
                                        zIndex: 999,
                                        animation: "fadeIn 0.3s ease",
                                        userSelect: "none",
                                    }}
                                >
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => {}}
                                    >
                                        <div className="flex justify-between gap-4 font-medium mt-2 hover:text-gray-400 active:text-gray-700">
                                            <span>Doanh thu khởi tạo :</span>
                                            <div className="flex gap-2">
                                                <span>
                                                    {initialRevenue.toLocaleString()}
                                                </span>
                                                <span>VNĐ</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between gap-4 font-medium mt-2 hover:text-gray-400 active:text-gray-700">
                                            <span>Doanh thu thực tế :</span>
                                            <div className="flex gap-2">
                                                <span>
                                                    {actualRevenue.toLocaleString()}
                                                </span>
                                                <span>VNĐ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <StatusCard
                                icon={statusCards[3].icon}
                                count={countOr.total}
                                title="Đơn hàng"
                                onClick={() => {
                                    togglePopoverOrder();
                                }}
                            />

                            {isOpenOrder && (
                                <div
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        top: "70%",
                                        padding: "10px 25px",
                                        backgroundColor: "#fff",
                                        boxShadow:
                                            "0 2px 10px rgba(0,0,0,0.15)",
                                        borderRadius: 6,
                                        zIndex: 999,
                                        animation: "fadeIn 0.3s ease",
                                        userSelect: "none",
                                    }}
                                >
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => {
                                            history.push("/admin/order");
                                        }}
                                    >
                                        <div className="flex justify-between gap-4 font-medium mt-2 hover:text-gray-400 active:text-gray-700">
                                            <span>Chờ xác nhận :</span>
                                            <span>
                                                {countOr.pendingConfirm}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-4 font-medium mt-2 hover:text-gray-400 active:text-gray-700">
                                            <span>Đang xử lí :</span>
                                            <span>{countOr.processing}</span>
                                        </div>
                                        <div className="flex justify-between gap-4 font-medium mt-2 hover:text-gray-400 active:text-gray-700">
                                            <span>Đang vận chuyển :</span>
                                            <span>{countOr.shipping}</span>
                                        </div>
                                        <div className="flex justify-between gap-4 font-medium mt-2 hover:text-gray-400 active:text-gray-700">
                                            <span>Đã giao :</span>
                                            <span>{countOr.delivered}</span>
                                        </div>
                                        <div className="flex justify-between gap-4 font-medium mt-2 hover:text-gray-400 active:text-gray-700">
                                            <span>Hủy :</span>
                                            <span>{countOr.cancelled}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <StatusCard
                            icon={statusCards[0].icon}
                            count={countAcc}
                            title={`Khách hàng: `}
                            onClick={() => {
                                history.push("/admin/account");
                            }}
                        />
                        <StatusCard
                            icon={statusCards[1].icon}
                            count={countPro}
                            title={`Sản phẩm: `}
                            onClick={() => {
                                history.push("/admin/product");
                            }}
                        />
                    </div>

                    {/* Doanh thu theo sản phẩm */}
                    <div className="card full-height overflow-hidden">
                        <Chart
                            options={productChartOptions}
                            series={productChartSeries}
                            type="line"
                            height="400"
                        />
                        <Link
                            to={`/admin/report-product`}
                            className="btn btn-primary mt-3 !flex justify-center"
                        >
                            Xem chi tiết
                        </Link>
                    </div>
                    <div className="card full-height overflow-hidden">
                        <Chart
                            options={yearChartOptions}
                            series={yearChartSeries}
                            type="area"
                            height="400"
                        />
                        <div className="mt-3">
                            <label htmlFor="year-select">Chọn năm:</label>
                            <select
                                id="year-select"
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="form-control"
                            >
                                <option value="2023">2024</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                {/* Thêm các năm khác nếu cần */}
                            </select>
                        </div>
                        <Link
                            to={`/admin/report-month/${selectedYear}`}
                            className="btn btn-primary mt-3"
                        >
                            Xem chi tiết
                        </Link>
                    </div>

                    {/* Biểu đồ Donut: Đơn hàng theo danh mục */}
                    <div className="card full-height overflow-hidden">
                        <Chart
                            options={chartDonutOption}
                            series={seriesChartDonut}
                            type="donut"
                            height="400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
