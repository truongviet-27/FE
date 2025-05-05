import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  getAllOrderAndPagination,
  getOrderByOrderStatusBetweenDate,
  getOrderByOrderStatusAndYearAndMonth,
  getOrderById,
  getOrderDetailByOrderId,
  updateCancel,
  updateProcess,
  updateShip,
  updateSuccess,
  getAllOrderStatus,
  getAllOrdersByPayment
} from "../../../api/OrderApi";
import "../table/table.css";
import Badge from "../badge/Badge";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

const orderStatus = {
  "Chờ xác nhận": "secondary",
  "Đang xử lí": "primary",
  "Đang vận chuyển": "warning",
  "Đã giao": "success",
  "Đã hủy": "danger",
};

const pendingStatus = {
  true: "success",
  false: "danger",
};

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showThird, setShowThird] = useState(false);
  const [showFouth, setShowFouth] = useState(false);

  const [shipment, setShipment] = useState(null);
  const [code, setCode] = useState(null);
  const [description, setDescription] = useState(null);
  const [reason, setReason] = useState(null);
  const [shipDate, setShipDate] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const shipmentHandler = (value) => {
    console.log(value);
    setShipment(value);
  };

  const codeHandler = (value) => {
    console.log(value);
    setCode(value);
  };

  const descriptionHandler = (value) => {
    console.log(value);
    setDescription(value);
  };

  const reasonHandler = (value) => {
    console.log(value);
    setReason(value);
  };

  const shipDateHandler = (value) => {
    console.log(value);
    setShipDate(value);
  };

  const [flagProcess, setFlagProcess] = useState(false);

  const handleCloseFirst = () => {
    setShowFirst(false);
    setFlagProcess(false);
  };
  const handleShowFirst = (orderId, statusId) => {
    getOrderById(orderId)
      .then((resp) => setTemp(resp.data))
      .catch((error) => console.log(error));

    getOrderDetailByOrderId(orderId)
      .then((resp) => setAttribute(resp.data))
      .catch((error) => console.log(error));

    setShowFirst(true);
    setObj({
      orderId: orderId,
      statusId: statusId,
    });
  };

  const handleCloseSecond = () => {
    setShowSecond(false);
    setShipment(null);
    setCode(null);
    setShipDate(null);
  };
  const handleShowSecond = (orderId, statusId) => {
    setShowSecond(true);
    setObj({
      orderId: orderId,
      statusId: statusId,
    });
  };

  const [flagSuccess, setFlagSuccess] = useState(false);
  const handleCloseThird = () => {
    setShowThird(false);
    setFlagSuccess(false);
  };
  const handleShowThird = (orderId, statusId) => {
    getOrderById(orderId)
      .then((resp) => setTemp(resp.data))
      .catch((error) => console.log(error));
    setShowThird(true);
    setObj({
      orderId: orderId,
      statusId: statusId,
    });
  };

  const handleCloseFouth = () => {
    setShowFouth(false);
    setReason(null);
    setDescription(null);
  };
  const handleShowFouth = (orderId, statusId) => {
    setShowFouth(true);
    setObj({
      orderId: orderId,
      statusId: statusId,
    });
  };
  const [status, setStatus] = useState(0);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [obj, setObj] = useState({});
  const [total, setTotal] = useState();
  const [page, setPage] = useState(0);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [temp, setTemp] = useState();
  const [attribute, setAttribute] = useState([]);

  var rows = new Array(total).fill(0).map((zero, index) => (
    <li
      className={page === index ? "page-item active" : "page-item"}
      key={index}
    >
      <button
        className="page-link"
        style={{ borderRadius: 50 }}
        onClick={() => onChangePage(index)}
      >
        {index + 1}
      </button>
    </li>
  ));
  const onChangePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    onLoad();
  }, [page]);

  const onLoad = () => {
    getAllOrderAndPagination(status, paymentMethod, page, 20)
      .then((res) => {
        setOrders(res.data.content);
        setTotal(res.data.totalPages);
      })
      .catch((error) => console.log(error));
    getAllOrderStatus()
      .then((resp) => setOrderStatuses(resp.data))
      .catch((error) => console.log(error.response.data.message));
  };

  const updateStatusHandlerFirst = (orderId, statusId) => {
    handleShowFirst(orderId, statusId);
  };

  const updateStatusHandlerSecond = (orderId, statusId) => {
    handleShowSecond(orderId, statusId);
  };

  const updateStatusHandlerThird = (orderId, statusId) => {
    handleShowThird(orderId, statusId);
  };

  const updateStatusHandlerFouth = (orderId, statusId) => {
    handleShowFouth(orderId, statusId);
  };

  const confirmUpdateProcess = () => {
    const data = {
      id: obj.orderId,
      status: obj.statusId,
      shipment: shipment,
      payment: paymentMethod,
      code: code,
      description: `${reason} - ${description}`,
      shipDate: shipDate,
    };

    updateProcess(data)
      .then((resp) => {
        setStatus(obj.statusId);
        setPage(0);
        getAllOrderAndPagination(obj.statusId, paymentMethod, 0, 20)
          .then((res) => {
            setOrders(res.data.content);
            setTotal(res.data.totalPages);
          })
          .catch((error) => console.log(error));
        toast.success("Cập nhật thành công.");
      })
      .catch((error) => toast.error(error.response.data.message));

    setFlagProcess(false);
    setShowFirst(false);
  };

  const confirmUpdateShip = () => {
    const data = {
      id: obj.orderId,
      status: obj.statusId,
      shipment: shipment,
      code: code,
      description: `${reason} - ${description}`,
      shipDate: shipDate,
    };

    updateShip(data)
      .then((resp) => {
        setStatus(obj.statusId);
        setPage(0);
        getAllOrderAndPagination(obj.statusId, paymentMethod, 0, 20)
          .then((res) => {
            setOrders(res.data.content);
            setTotal(res.data.totalPages);
          })
          .catch((error) => console.log(error));
        toast.success("Cập nhật thành công.");
      })
      .catch((error) => toast.error(error.response.data.message));
    setShipment(null);
    setCode(null);
    setShipDate(null);
    setShowSecond(false);
  };

  const confirmUpdateSuccess = () => {
    const data = {
      id: obj.orderId,
      status: obj.statusId,
      shipment: shipment,
      code: code,
      description: `${reason} - ${description}`,
      shipDate: shipDate,
    };

    updateSuccess(data)
      .then((resp) => {
        setStatus(obj.statusId);
        setPage(0);
        getAllOrderAndPagination(obj.statusId, paymentMethod, 0, 20)
          .then((res) => {
            setOrders(res.data.content);
            setTotal(res.data.totalPages);
          })
          .catch((error) => console.log(error));
        toast.success("Cập nhật thành công.");
      })
      .catch((error) => toast.error(error.response.data.message));

    setFlagSuccess(null);
    setShowThird(false);
  };

  const confirmUpdateCancel = () => {
    const data = {
      id: obj.orderId,
      status: obj.statusId,
      shipment: shipment,
      code: code,
      description: `${reason} - ${description}`,
      shipDate: shipDate,
    };

    updateCancel(data)
      .then((resp) => {
        setStatus(obj.statusId);
        setPage(0);
        getAllOrderAndPagination(obj.statusId, paymentMethod, 0, 20)
          .then((res) => {
            setOrders(res.data.content);
            setTotal(res.data.totalPages);
          })
          .catch((error) => console.log(error));
        toast.success("Cập nhật thành công.");
      })
      .catch((error) => toast.error(error.response.data.message));

    setReason(null);
    setDescription(null);
    setShowFouth(false);
  };

  const getAllOrderByStatus = (value) => {
    setStatus(value);
    setPage(0);
    setYear("");
    setMonth("");
    getAllOrderAndPagination(value, paymentMethod, page, 20)
      .then((res) => {
        setOrders(res.data.content);
        setTotal(res.data.totalPages);
      })
      .catch((error) => console.log(error.response.data.message));
  };

  const getAllOrdersByPaymentStatus = (paymentMethod) => {
    setPaymentMethod(paymentMethod);
    console.log(paymentMethod)
    setPage(0);
    const sanitizedPaymentMethod = paymentMethod === "null" ? null : paymentMethod;
    getAllOrdersByPayment(sanitizedPaymentMethod, 0, 20)
      .then((res) => {
        console.log(res)
        if (res.data) {
          setOrders(res.data.content || []);
          setTotal(res.data.totalPages || 0);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu:", error);
      });
  };
  const getAllOrderByOrderStatusAndYearAndMonth = (value) => {
    setMonth(value);
    setFrom("");
    setTo("");
    getOrderByOrderStatusAndYearAndMonth(status, year, value, page, 20)
      .then((res) => {
        setOrders(res.data.content);
        setTotal(res.data.totalPages);
      })
      .catch((error) => console.log(error.response.data.message));
  };

  const changeYearHandler = (value) => {
    setYear(value);
  };

  const searchHandler = () => {
    // if (from.length === 0 || to.length === 0) {
    //   toast.warning("Chọn ngày cần tìm kiếm.");
    // } else {
    if (from > to) {
      toast.warning("Chọn ngày tìm kiếm không hợp lệ.");
    } else {
      let a = from.split("-");
      let strFrom = a[2] + "-" + a[1] + "-" + a[0];
      let b = to.split("-");
      let strTo = b[2] + "-" + b[1] + "-" + b[0];
      console.log(strFrom + " " + strTo);
      getOrderByOrderStatusBetweenDate(status, strFrom, strTo, page, 8)
        .then((res) => {
          setOrders(res.data.content);
          setTotal(res.data.totalPages);
        })
        .catch((error) => console.log(error.response.data.message));
    }
    // }
  };

  const flagProcessHandler = (e) => {
    const { checked } = e.target;
    setFlagProcess(checked);
  };

  const flagSuccessHandler = (e) => {
    const { checked } = e.target;
    setFlagSuccess(checked);
  };
  return (
    <div className="col-12">
      <div className="card">
        <div className="card__header">
          <h3>Đơn hàng</h3>
        </div>
        <div className="row">
          <div className="col-sm-4 mt-2">
            <select
              className="form-control"
              onChange={(event) => getAllOrderByStatus(event.target.value)}
            >
              <option value="0">Tất cả</option>
              {orderStatuses &&
                orderStatuses.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-sm-4 mt-2">
            <select
              className="form-control"
              onChange={(e) => changeYearHandler(e.target.value)}
              value={year}
            >
              <option value="">
                Chọn năm
              </option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div className="col-sm-4 mt-2">
            <select
              className="form-control"
              onChange={(e) =>
                getAllOrderByOrderStatusAndYearAndMonth(e.target.value)
              }
              value={month}
            >
              <option value="">
                Chọn tháng
              </option>
              {months &&
                months.map((item, index) => (
                  <option key={index} value={item}>
                    Tháng {item}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 mt-2">
            <input
              type="date"
              name=""
              id=""
              className="border"
              onChange={(e) => setFrom(e.target.value)}
              value={from}
            />
          </div>

          <div className="col-sm-4 mt-2">
            <input
              type="date"
              name=""
              id=""
              className="border"
              onChange={(e) => setTo(e.target.value)}
              value={to}
            />
          </div>
          <div className="col-sm-4 mt-2">
            <select
              className="form-control"
              onChange={(event) => getAllOrdersByPaymentStatus(event.target.value)}
            >
              <option value="null">Phương thức thanh toán</option>
              <option value="Thanh toán khi giao hàng(COD)">Thanh toán khi giao hàng (COD)</option>
              <option value="CHUYỂN KHOẢN QUA VNPAY">Chuyển khoản qua VNPay</option>
            </select>
          </div>

          <div
            className="btn btn-primary mt-2"
            onClick={() => searchHandler()}
          >
            Tìm kiếm
          </div>
        </div>
        <div className="row"></div>
        <div className="card__body">
          {orders && (
            <div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Mã đơn hàng</th>
                      <th scope="col">Ngày mua</th>
                      <th scope="col">Hình thức</th>
                      <th scope="col">Thanh toán</th>
                      <th scope="col">Tổng tiền</th>
                      {paymentMethod !== "CHUYỂN KHOẢN QUA VNPAY" && (
                        <th scope="col">
                          <Badge
                            type={orderStatus["Chờ xác nhận"]}
                            content={"Chờ xác nhận"}
                          />
                        </th>
                      )}
                      <th scope="col" >
                        <Badge
                          type={orderStatus["Đang xử lí"]}
                          content={"Đang xử lí"}
                        />
                      </th>
                      <th scope="col">
                        <Badge
                          type={orderStatus["Đang vận chuyển"]}
                          content={"Đang vận chuyển"}
                        />
                      </th>
                      <th scope="col">
                        <Badge
                          type={orderStatus["Đã giao"]}
                          content={"Đã giao"}
                        />
                      </th>
                      <th scope="col">
                        <Badge
                          type={orderStatus["Đã hủy"]}
                          content={"Hủy"}
                        />
                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    {orders &&
                      orders
                        // .filter((order) => {
                        //   // Lọc theo phương thức thanh toán "CHUYỂN KHOẢN QUA VNPAY"
                        //   if (paymentMethod === "CHUYỂN KHOẢN QUA VNPAY") {
                        //     return (
                        //       ["Đang xử lí", "Đang vận chuyển", "Đã giao", "Đã hủy"].includes(
                        //         order.orderStatusName
                        //       )
                        //     );
                        //   }
                        //   return true; // Hiển thị tất cả trạng thái nếu không chọn VNPAY
                        // })
                        .map((item, index) => (
                          <tr key={index}>
                            <th scope="row">
                              <NavLink to={`/admin/detail-order/${item.id}`} exact>
                                #{item.id}
                              </NavLink>
                            </th>
                            <th>{item.createDate}</th>
                            <th>{item.payment ? item.payment : "Chưa chọn phương thức thanh toán"}</th>
                            <th>
                              <Badge
                                type={pendingStatus[item.isPending]}
                                content={
                                  item.isPending
                                    ? "Đã thanh toán"
                                    : "Chưa thanh toán"
                                }
                              />
                            </th>
                            <th> {item.total.toLocaleString()} ₫</th>
                            {paymentMethod !== "CHUYỂN KHOẢN QUA VNPAY" && (
                              <th>
                                <div className="form-check mb-4">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={index}
                                    checked={item.orderStatusId === 1}
                                    value="1"
                                  />
                                </div>
                              </th>
                            )}
                            {/* <th>
                              <div className="form-check mb-4">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={index}
                                  checked={item.orderStatusId === 1}
                                  value="1"
                                />
                              </div>
                            </th> */}
                            <th>
                              <div className="form-check mb-4">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={index}
                                  checked={item.orderStatusId === 2}
                                  value="2"
                                  onChange={(e) =>
                                    updateStatusHandlerFirst(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </th>
                            <th>
                              <div className="form-check mb-4">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={index}
                                  checked={item.orderStatusId === 3}
                                  value="3"
                                  onChange={(e) =>
                                    updateStatusHandlerSecond(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </th>
                            <th>
                              <div className="form-check mb-4">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={index}
                                  checked={item.orderStatusId === 4}
                                  value="4"
                                  onChange={(e) =>
                                    updateStatusHandlerThird(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </th>
                            <th>
                              <div className="form-check mb-4">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={index}
                                  checked={item.orderStatusId === 5}
                                  value="5"
                                  onChange={(e) =>
                                    updateStatusHandlerFouth(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </th>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <nav aria-label="Page navigation">
          <ul className="pagination offset-5 mt-3">
            <li className={page === 0 ? "page-item disabled" : "page-item"}>
              <button
                className="page-link"
                style={{ borderRadius: 50 }}
                onClick={() => onChangePage(0)}
              >
                {`<<`}
              </button>
            </li>
            {rows}
            <li className={page === total ? "page-item disabled" : "page-item"}>
              <button
                className="page-link"
                style={{ borderRadius: 50 }}
                onClick={() => onChangePage(total - 1)}
              >
                {`>>`}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <Modal show={showFirst} onHide={handleCloseFirst}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>
            Xác nhận cập nhật?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <Alert.Heading>
              Gọi điện cho khách hàng xác nhận những thông tin
            </Alert.Heading>
            <hr />
            <p className="font-weight-bold">
              Tên khách hàng: {temp && temp.fullName}
            </p>
            <p className="font-weight-bold">
              Số điện thoại: {temp && temp.phone}
            </p>
            <p className="font-weight-bold">
              Địa chỉ nhận hàng: {temp && temp.address}
            </p>
            <p className="font-weight-bold">Sản phẩm mua:</p>
            {attribute &&
              attribute.map((item, index) => (
                <p key={index}>
                  {item.attribute.name} - Size {item.attribute.size} - Số lượng{" "}
                  {item.quantity}
                </p>
              ))}
          </Alert>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Đã xác nhận đơn hàng."
              defaultChecked={flagProcess}
              onChange={(e) => flagProcessHandler(e)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            disabled={!flagProcess}
            onClick={confirmUpdateProcess}
          >
            Xác nhận
          </Button>
          <Button variant="primary" onClick={handleCloseFirst}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSecond} onHide={handleCloseSecond}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>
            Xác nhận cập nhật?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <Alert.Heading>Cập nhật thông tin vận đơn</Alert.Heading>
            <hr />
            <Form.Label style={{ marginRight: 30, marginBottom: 10 }}>
              Hãng vận chuyển
            </Form.Label>
            <Form.Select
              style={{ height: 40, width: 300, marginBottom: 20 }}
              onChange={(e) => shipmentHandler(e.target.value)}
            >
              <option value={null}></option>
              <option value="ViettelPost">ViettelPost</option>
              <option value="J&T">J&T</option>
              <option value="Gojek">Gojek</option>
              <option value="AhaMove">AhaMove</option>
            </Form.Select>
            {/* <Form>
              <Form.Label style={{ marginRight: 30, marginBottom: 10 }}>
                Mã vận đơn
              </Form.Label>
              <Form.Control
                style={{ height: 40, width: 300, marginBottom: 20 }}
                type="text"
                onChange={(e) => codeHandler(e.target.value)}
              />
            </Form> */}
            <Form>
              <Form.Label style={{ marginRight: 30, marginBottom: 10 }}>
                Ngày nhận dự kiến
              </Form.Label>
              <Form.Control
                style={{ height: 40, width: 300 }}
                type="date"
                onChange={(e) => shipDateHandler(e.target.value)}
              />
            </Form>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={confirmUpdateShip}
            disabled={!shipDate}
          >
            Xác nhận
          </Button>
          <Button variant="primary" onClick={handleCloseSecond}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showThird} onHide={handleCloseThird}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>
            Xác nhận cập nhật?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <Alert.Heading>Tiền đã về tay?</Alert.Heading>
            <hr />
            <p className="font-weight-bold">
              Tổng tiền đơn hàng: {temp && temp.total.toLocaleString()} đ
            </p>
          </Alert>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Xác nhận đã nhận tiền."
              defaultChecked={flagProcess}
              onChange={(e) => flagSuccessHandler(e)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            disabled={!flagSuccess}
            onClick={confirmUpdateSuccess}
          >
            Xác nhận
          </Button>
          <Button variant="primary" onClick={handleCloseThird}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showFouth} onHide={handleCloseFouth}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>
            Xác nhận cập nhật?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <Alert.Heading>Hủy đơn hàng</Alert.Heading>
            <hr />
            <Form.Label style={{ marginRight: 30, marginBottom: 10 }}>
              Lí do hủy đơn
            </Form.Label>
            <Form.Select
              style={{ height: 40, width: 420, marginBottom: 20 }}
              onChange={(e) => reasonHandler(e.target.value)}
            >
              <option value={null}></option>
              <option value="Đặt trùng">Đặt trùng</option>
              <option value="Thêm bớt sản phẩm">Thêm bớt sản phẩm</option>
              <option value="Gojek">Không còn nhu cầu</option>
              <option value="AhaMove">Lí do khác</option>
            </Form.Select>
            <Form>
              <Form.Label style={{ marginRight: 30, marginBottom: 10 }}>
                Mô tả
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) => descriptionHandler(e.target.value)}
              />
            </Form>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={confirmUpdateCancel}
            disabled={!reason || !description}
          >
            Xác nhận
          </Button>
          <Button variant="primary" onClick={handleCloseFouth}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;
