import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Link, useHistory } from "react-router-dom";
import { countAccount } from "../../../api/AccountApi";
import {
    countOrder,
    countOrderByName,
    reportAmountYear,
    reportByProduct,
} from "../../../api/OrderApi";
import { countProduct } from "../../../api/ProductApi";
import statusCards from "../../../assets/JsonData/status-card-data.json";
import StatusCard from "../status-card/StatusCard";
import { toast } from "react-toastify";

const Dashboard = () => {
    const [productChartOptions, setProductChartOptions] = useState({});
    const [productChartSeries, setProductChartSeries] = useState([]);
    const [yearChartOptions, setYearChartOptions] = useState({});
    const [yearChartSeries, setYearChartSeries] = useState([]);
    const [countOr, setCountOr] = useState();
    const [total, setTotal] = useState();
    const [countAcc, setCountAcc] = useState();
    const [countPro, setCountPro] = useState();
    const [seri, setSeri] = useState([]);
    const [option, setOption] = useState({});
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
                const years = resp.data.map((item) => item.year);
                const revenues = resp.data.map((item) => item.total);

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

                const totalRevenue = resp.data.reduce(
                    (sum, item) => sum + item.total,
                    0
                );
                setTotal(totalRevenue);
            })
            .catch((error) => console.log(error));

        // Đơn hàng theo danh mục
        countOrderByName()
            .then((resp) => {
                const x = resp.data.content.map((item) => item.name);
                setOption({
                    labels: x,
                });
                const y = resp.data.map((item) => item.count);
                setSeri(y);
            })
            .catch((error) => toast.error(error.message));

        // Số lượng đơn hàng
        countOrder()
            .then((resp) => setCountOr(resp.data.data))
            .catch((error) => toast.error(error.message));

        // Số lượng tài khoản
        countAccount()
            .then((resp) => setCountAcc(resp.data.data))
            .catch((error) => toast.error(error.message));

        // Số lượng sản phẩm
        countProduct()
            .then((resp) => setCountPro(resp.data.data))
            .catch((error) => toast.error(error.message));
    }, []);
    const [selectedYear, setSelectedYear] = useState("2024");

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div className="col-12">
            <div className="card overflow-y-scroll">
                <h2 className="page-header">Thống kê</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 !ml-5">
                    <div className="card justify-between full-height overflow-hidden">
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
                        <StatusCard
                            icon={statusCards[3].icon}
                            count={countOr}
                            title={`Đơn hàng: `}
                            onClick={() => {
                                history.push("/admin/order");
                            }}
                        />
                        <StatusCard
                            icon={statusCards[2].icon}
                            // count={total && `${total.toLocaleString()} Vnđ`}
                            count={`10.000.000 VNĐ`}
                            title={`Tổng doanh thu: `}
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
                            type="line"
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
                            options={option}
                            series={seri}
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
