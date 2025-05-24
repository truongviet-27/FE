import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { reportAmountMonth } from "../../../api/OrderApi";

import ReactApexChart from "react-apexcharts";

const ReportMonth = (props) => {
    const { year } = useParams();
    const history = useHistory();
    const [yearState, setYearState] = useState();

    const [stateMonth, setStateMonth] = useState({
        series: {},
        options: {},
    });

    useEffect(() => {
        setYearState(year);
        reportAmountMonth(year)
            .then((resp) => {
                const data = resp.data.content;
                const fullYearData = Array.from({ length: 12 }, (_, index) => {
                    const month = index + 1;
                    const monthData = data.find((item) => item.month === month);

                    return {
                        month,
                        realizedRevenue: monthData?.realizedRevenue || 0,
                        unearnedRevenue: monthData?.unearnedRevenue || 0,
                        unsuccessfulRevenue:
                            monthData?.unsuccessfulRevenue || 0,
                    };
                });

                setStateMonth({
                    series: [
                        {
                            name: "Doanh thu thực thu",
                            data: fullYearData.map(
                                (item) => item.realizedRevenue
                            ),
                        },
                        {
                            name: "Doanh thu chưa thực hiện",
                            data: fullYearData.map(
                                (item) => item.unearnedRevenue
                            ),
                        },
                        {
                            name: "Doanh thu không thành công",
                            data: fullYearData.map(
                                (item) => item.unsuccessfulRevenue
                            ),
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
                            events: {
                                dataPointSelection: (
                                    event,
                                    chartContext,
                                    config
                                ) => {
                                    const seriesIndex = config.seriesIndex;
                                    const dataPointIndex =
                                        config.dataPointIndex;

                                    // Giá trị người dùng click
                                    const value =
                                        config.w.config.series[seriesIndex]
                                            .data[dataPointIndex];
                                    const label =
                                        config.w.config.xaxis.categories[
                                            dataPointIndex
                                        ];

                                    console.log("Clicked:", {
                                        seriesIndex,
                                        dataPointIndex,
                                        value,
                                        label,
                                    });

                                    clickHandler({
                                        seriesIndex,
                                        dataPointIndex,
                                        value,
                                        label,
                                    });
                                },
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
                            enabled: false,
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
                                borderRadius: 6,
                                borderRadiusApplication: "end",
                                borderRadiusWhenStacked: "last",
                                dataLabels: {
                                    total: {
                                        enabled: true,
                                        style: {
                                            fontSize: "12px",
                                            fontWeight: 800,
                                        },
                                        formatter: function (val) {
                                            if (val === 0) return "";
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
                            categories: fullYearData.map(
                                (item) => `Tháng ${item.month}`
                            ),
                        },
                        yaxis: {
                            labels: {
                                formatter: function (val) {
                                    return val.toLocaleString("vi-VN") + " VNĐ";
                                },
                            },
                        },
                        tooltip: {
                            y: {
                                formatter: function (val) {
                                    return val.toLocaleString("vi-VN") + " VNĐ";
                                },
                            },
                        },
                        title: {
                            text: "Doanh thu theo tháng",
                            align: "center",
                        },
                        legend: {
                            position: "bottom",
                            offsetY: 40,
                        },
                        fill: {
                            opacity: 1,
                        },
                    },
                });
            })
            .catch((error) => console.log(error));
        props.yearHandler(year);
    }, [year]);

    const goBack = () => {
        history.goBack();
    };

    const changeYearHandler = (value) => {
        setYearState(value);
        reportAmountMonth(value)
            .then((resp) => {
                const data = resp.data.content;
                const fullYearData = Array.from({ length: 12 }, (_, index) => {
                    const month = index + 1;
                    const monthData = data.find((item) => item.month === month);

                    return {
                        month,
                        realizedRevenue: monthData?.realizedRevenue || 0,
                        unearnedRevenue: monthData?.unearnedRevenue || 0,
                        unsuccessfulRevenue:
                            monthData?.unsuccessfulRevenue || 0,
                    };
                });

                setStateMonth({
                    series: [
                        {
                            name: "Doanh thu thực thu",
                            data: fullYearData.map(
                                (item) => item.realizedRevenue
                            ),
                        },
                        {
                            name: "Doanh thu chưa thực hiện",
                            data: fullYearData.map(
                                (item) => item.unearnedRevenue
                            ),
                        },
                        {
                            name: "Doanh thu không thành công",
                            data: fullYearData.map(
                                (item) => item.unsuccessfulRevenue
                            ),
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
                            events: {
                                dataPointSelection: (
                                    event,
                                    chartContext,
                                    config
                                ) => {
                                    const seriesIndex = config.seriesIndex;
                                    const dataPointIndex =
                                        config.dataPointIndex;
                                    const value =
                                        config.w.config.series[seriesIndex]
                                            .data[dataPointIndex];
                                    const label =
                                        config.w.config.xaxis.categories[
                                            dataPointIndex
                                        ];

                                    clickHandler({
                                        seriesIndex,
                                        dataPointIndex,
                                        value,
                                        label,
                                    });
                                },
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
                            enabled: false,
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
                                borderRadius: 6,
                                borderRadiusApplication: "end",
                                borderRadiusWhenStacked: "last",
                                dataLabels: {
                                    total: {
                                        enabled: true,
                                        style: {
                                            fontSize: "12px",
                                            fontWeight: 800,
                                        },
                                        formatter: function (val) {
                                            if (val === 0) return "";
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
                            categories: fullYearData.map(
                                (item) => `Tháng ${item.month}`
                            ),
                        },
                        yaxis: {
                            labels: {
                                formatter: function (val) {
                                    return val.toLocaleString("vi-VN") + " VNĐ";
                                },
                            },
                        },
                        tooltip: {
                            y: {
                                formatter: function (val) {
                                    return val.toLocaleString("vi-VN") + " VNĐ";
                                },
                            },
                        },
                        title: {
                            text: "Doanh thu theo tháng",
                            align: "center",
                        },
                        legend: {
                            position: "bottom",
                            offsetY: 40,
                        },
                        fill: {
                            opacity: 1,
                        },
                    },
                });
            })
            .catch((error) => console.log(error));
        props.yearHandler(value);
    };

    console.log(yearState, "yearState");

    const clickHandler = ({ dataPointIndex }) => {
        if (dataPointIndex >= 0) {
            history.push(`/admin/order-month/${dataPointIndex + 1}`);
        }
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
                    <ReactApexChart
                        options={stateMonth?.options}
                        series={stateMonth?.series}
                        type="bar"
                        height={400}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReportMonth;
