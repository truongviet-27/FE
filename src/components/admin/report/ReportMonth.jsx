import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { reportAmountMonth } from "../../../api/OrderApi";

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

const ReportMonth = (props) => {
    const { year } = useParams();
    const history = useHistory();
    const [month, setMonth] = useState([]);
    const [yearState, setYearState] = useState();
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

    const clickHandler = async (data, index) => {
        history.push(`/admin/order-month/${data.month}`);
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
        </div>
    );
};

export default ReportMonth;
