import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { countAccount } from "../../../api/AccountApi";
import {
    amountYear,
    countOrder,
    countOrderByCategoryName,
    reportAmountYear,
    reportByProduct,
} from "../../../api/OrderApi";
import { countProduct } from "../../../api/ProductApi";
import statusCards from "../../../assets/JsonData/status-card-data.json";
import StatusCard from "../status-card/StatusCard";
import ReactApexChart from "react-apexcharts";

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
    const [selectedYear, setSelectedYear] = useState("2025");

    const [isOpenOrder, setIsOpenOrder] = useState(false);

    const togglePopoverOrder = () => setIsOpenOrder(!isOpenOrder);

    const [isOpenTotal, setIsOpenTotal] = useState(false);

    const togglePopoverTotal = () => setIsOpenTotal(!isOpenTotal);

    const [actualRevenue, setActualRevenue] = useState();
    const [initialRevenue, setInitialRevenue] = useState();

    const history = useHistory();

    const [stateTotalYear, setStateTotalYear] = useState({
        series: {},
        options: {},
    });

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
                const realizedRevenue = resp.data.data.map(
                    (item) => item.realizedRevenue
                );
                const unearnedRevenue = resp.data.data.map(
                    (item) => item.unearnedRevenue
                );
                const unsuccessfulRevenue = resp.data.data.map(
                    (item) => item.unsuccessfulRevenue
                );

                setStateTotalYear({
                    series: [
                        {
                            name: "Doanh thu thực thu",
                            data: realizedRevenue,
                        },
                        {
                            name: "Doanh thu chưa thực hiện",
                            data: unearnedRevenue,
                        },
                        {
                            name: "Doanh thu không thành công",
                            data: unsuccessfulRevenue,
                        },
                    ],
                    options: {
                        chart: {
                            type: "bar",
                            height: 400,
                            stacked: true,
                            toolbar: {
                                show: true,
                                tools: {
                                    download: true,
                                    selection: false,
                                    zoom: true,
                                    zoomin: true,
                                    zoomout: true,
                                    pan: true,
                                    reset: true,
                                },
                            },
                            zoom: {
                                enabled: true,
                            },
                        },
                        responsive: [
                            {
                                breakpoint: 480,
                                options: {
                                    legend: {
                                        position: "bottom",
                                        offsetX: -10,
                                        offsetY: 0,
                                    },
                                },
                            },
                        ],
                        dataLabels: {
                            enabled: true,
                            formatter: function (val) {
                                return val.toLocaleString("vi-VN") + " VNĐ";
                            },
                            style: {
                                fontSize: "12px",
                                colors: ["#000"],
                            },
                        },
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                borderRadius: 5,
                                borderRadiusApplication: "end",
                                borderRadiusWhenStacked: "last",
                                dataLabels: {
                                    total: {
                                        enabled: true,
                                        style: {
                                            fontSize: "13px",
                                            fontWeight: 800,
                                        },
                                        formatter: function (val) {
                                            return (
                                                val.toLocaleString("vi-VN") +
                                                " VNĐ"
                                            );
                                        },
                                    },
                                },
                            },
                        },
                        xaxis: {
                            type: "number",
                            categories: years,
                        },
                        yaxis: {
                            labels: {
                                formatter: function (val) {
                                    return val.toLocaleString("vi-VN") + " VNĐ";
                                },
                            },
                        },
                        legend: {
                            position: "bottom",
                            offsetY: 40,
                        },
                        fill: {
                            opacity: 1,
                        },
                        title: {
                            text: "Thống kê đơn hàng",
                            align: "center",
                        },
                    },
                });
            })
            .catch((error) => console.log(error));

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

        // Đơn hàng theo danh mục
        countOrderByCategoryName()
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
                                    count={`${(total ?? 0).toLocaleString(
                                        "vi-VN"
                                    )} VNĐ`}
                                    title={`Tổng doanh thu: `}
                                    onClick={() => {
                                        togglePopoverTotal();
                                    }}
                                    onBlur={() => {
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
                                            <span>
                                                Doanh thu chưa thực hiện :
                                            </span>
                                            <div className="flex gap-2">
                                                <span>
                                                    {initialRevenue.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                </span>
                                                <span>VNĐ</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between gap-4 font-medium mt-2 hover:text-gray-400 active:text-gray-700">
                                            <span>Doanh thu thực thu :</span>
                                            <div className="flex gap-2">
                                                <span>
                                                    {actualRevenue.toLocaleString(
                                                        "vi-VN"
                                                    )}
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
                    <div className="card flex-col justify-between full-height overflow-hidden">
                        <ReactApexChart
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
                    {/* Doanh thu theo năm */}
                    <div className="card flex-col justify-between full-height overflow-hidden">
                        <ReactApexChart
                            options={stateTotalYear?.options}
                            series={stateTotalYear?.series}
                            type="bar"
                            height={400}
                        />

                        <div className="mt-3">
                            <label htmlFor="year-select">Chọn năm:</label>
                            <select
                                id="year-select"
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="form-control"
                            >
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
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
                        <ReactApexChart
                            options={chartDonutOption}
                            series={seriesChartDonut}
                            type="donut"
                            height={400}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
