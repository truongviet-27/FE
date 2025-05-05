import React, { useState, useEffect } from "react";
import statusCards from "../../../assets/JsonData/status-card-data.json";
import StatusCard from "../status-card/StatusCard";
import Chart from "react-apexcharts";
import { Link, NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  reportByProduct,
  reportAmountYear,
  countOrder,
  countOrderByName,
} from "../../../api/OrderApi";
import { countAccount } from "../../../api/AccountApi";
import { countProduct } from "../../../api/ProductApi";

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
    reportByProduct(0, 8)
      .then((resp) => {
        const productNames = resp.data.content.map((item) => item.name);
        const revenues = resp.data.content.map((item) => item.amount);

        setProductChartOptions({
          chart: {
            type: "bar",
          },
          xaxis: {
            categories: productNames,
          },
          title: {
            text: "Doanh thu theo sản phẩm",
            align: "center",
          },
        });

        setProductChartSeries([
          {
            name: "Doanh thu",
            data: revenues,
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

    // Số lượng đơn hàng
    countOrder()
      .then((resp) => setCountOr(resp.data))
      .catch((error) => console.log(error));

    // Số lượng tài khoản
    countAccount()
      .then((resp) => setCountAcc(resp.data))
      .catch((error) => console.log(error));

    // Số lượng sản phẩm
    countProduct()
      .then((resp) => setCountPro(resp.data))
      .catch((error) => console.log(error));

    // Đơn hàng theo danh mục
    countOrderByName()
      .then((resp) => {
        const x = resp.data.map((item) => item.name);
        setOption({
          labels: x,
        });
        const y = resp.data.map((item) => item.count);
        setSeri(y);
      })
      .catch((error) => console.log(error));
  }, []);
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };


  return (
    <div>
      <h2 className="page-header" style={{ marginLeft: "35px", marginTop: "30px" }}>Thống kê</h2>
      <div className="row" style={{ marginLeft: "10px" }}>
        <div className="col-6">
          <div className="row container-fluid">
            <div className="col">
              <StatusCard
                icon={statusCards[0].icon}
                count={countAcc}
                title={`Khách hàng`}
                onClick={() => {
                  history.push("/admin/account");
                }}
              />
              <StatusCard
                icon={statusCards[1].icon}
                count={countPro}
                title={`Sản phẩm`}
                onClick={() => {
                  history.push("/admin/products");
                }}
              />
              <StatusCard
                icon={statusCards[3].icon}
                count={countOr}
                title={`Đơn hàng`}
                onClick={() => {
                  history.push("/admin/orders");
                }}
              />
              <StatusCard
                icon={statusCards[2].icon}
                count={total && `${total.toLocaleString()} Vnđ`}
                title={`Tổng doanh thu`}
              />
            </div>
          </div>
        </div>

        {/* Doanh thu theo sản phẩm */}
        <div className="col-6">
          <div className="card full-height">
            <Chart
              options={productChartOptions}
              series={productChartSeries}
              type="bar"
              height="400"

            />
          </div>
        </div>

        {/* Doanh thu theo năm */}
        {/* <div className="col-6">
          <div className="card full-height">
            <Chart
              options={yearChartOptions}
              series={yearChartSeries}
              type="line"
              height="400"
            />
            <Link to="/admin/report-month/2024" className="btn btn-primary mt-3">
              Xem chi tiết
            </Link>
          </div>
        </div> */}
        <div className="col-6">
          <div className="card full-height">
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
        </div>


        {/* Biểu đồ Donut: Đơn hàng theo danh mục */}
        <div className="col-6">
          <div className="card full-height">
            <Chart options={option} series={seri} type="donut" height="400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
