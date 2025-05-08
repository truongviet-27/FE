import React, { useState, useEffect } from "react";
import { getOrderById, getOrderDetailByOrderId } from "../api/OrderApi";
import { Card, Button, Modal } from "react-bootstrap";
import {
    FaTruck,
    FaMoneyCheckAlt,
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa"; // Icons
import { toast } from "react-toastify";
import axios from "axios";
import "../index.css";
import { blue } from "@mui/material/colors";

const OrderDetail = (props) => {
    const [orderDetail, setOrderDetail] = useState([]);
    const [order, setOrder] = useState({});
    const [amount, setAmount] = useState();
    const [sale, setSale] = useState();
    const [total, setTotal] = useState();
    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);

    const url = new URL(window.location.href);
    const orderId = url.pathname.split("/").pop();

    const handlePayment = async (orderId, amount) => {
        try {
            const response = await fetch(
                `http://localhost:8086/api/v1/payment/vn-pay?amount=${amount}&orderId=${orderId}`,
                {
                    method: "GET",
                }
            );
            const result = await response.json();
            if (response.ok) {
                // toast.success('Thành công! Đơn hàng sẽ được chuẩn bị');
                window.location.href = result.data.paymentUrl;
            } else {
                toast.error(result.message || "Thanh toán thất bại.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi thanh toán.");
        }
    };

    const handleShipCodePayment = async (orderId) => {
        setLoading(true);

        try {
            const response = await axios.put(
                `http://localhost:8086/api/v1/payment/ship-code?orderId=${orderId}`
            );
            // Hiển thị thông báo thành công
            if (response.status === 200) {
                toast.success("Thành công! Đơn hàng chờ xác nhận");
                window.location.reload();
            } else {
                toast.error("Thất bại, kiểm tra lại");
            }
        } catch (error) {
            toast.error("Failed to update payment method");
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handlePaymentMethod = (method) => {
        setPaymentMethod(method);
        if (method === "COD") {
            handleShipCodePayment(orderId);
        } else {
            handlePayment(orderId, total);
        }
        handleCloseModal();
    };

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = () => {
        getOrderById(orderId).then((resp) => {
            setOrder(resp.data);
            setSale(resp.data.discount ? resp.data.discount : 0);
            setTotal(resp.data.total);
        });
        getOrderDetailByOrderId(orderId).then((resp) => {
            setOrderDetail(resp.data);
            const result = resp.data.reduce(
                (price, item) => price + item.sellPrice * item.quantity,
                0
            );
            setAmount(result);
        });
    };

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                {/* Order Information */}
                <div className="col-lg-8">
                    <Card className="order-card mb-4">
                        <Card.Body>
                            <h4 className="text-primary">
                                <FaTruck className="mr-2" /> Chi tiết đơn hàng
                            </h4>
                            <table className="table table-striped table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Tên sản phẩm</th>
                                        <th>Ảnh sản phẩm </th>
                                        <th>Size</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetail.map((item, index) => (
                                        <tr key={index} className="table-row">
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                    height: "100px",
                                                }}
                                            >
                                                {item.attribute.name}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                    height: "100px",
                                                }}
                                            >
                                                {" "}
                                                <img
                                                    src={item.image}
                                                    style={{
                                                        width: 150,
                                                        height: 150,
                                                    }}
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                    height: "100px",
                                                }}
                                            >
                                                {item.attributeSize}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                    height: "100px",
                                                }}
                                            >
                                                {item.sellPrice.toLocaleString()}
                                                ₫
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                    height: "100px",
                                                }}
                                            >
                                                {item.quantity}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                    height: "100px",
                                                }}
                                            >
                                                {(
                                                    item.sellPrice *
                                                    item.quantity
                                                ).toLocaleString()}
                                                ₫
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="text-right">
                                <p>
                                    Tạm tính:{" "}
                                    {amount && amount.toLocaleString()} đ
                                </p>
                                <p>
                                    Giảm giá: -{" "}
                                    {sale
                                        ? (
                                              (amount * sale) /
                                              100
                                          ).toLocaleString()
                                        : 0}{" "}
                                    đ
                                </p>
                                <h5 className="text-danger">
                                    Tổng cộng: {total && total.toLocaleString()}{" "}
                                    đ
                                </h5>
                            </div>
                        </Card.Body>
                    </Card>

                    <div className="row">
                        <div className="col-md-6">
                            <Card className="mb-4 order-card">
                                <Card.Body>
                                    <h5 className="text-primary">
                                        <FaMoneyCheckAlt className="mr-2" />{" "}
                                        Trạng thái thanh toán
                                    </h5>
                                    <p
                                        className={`text-${
                                            order.isPending
                                                ? "success"
                                                : "danger"
                                        }`}
                                    >
                                        {order.isPending ? (
                                            <>
                                                <FaCheckCircle className="mr-2" />{" "}
                                                Đã thanh toán
                                            </>
                                        ) : (
                                            <>
                                                <FaTimesCircle className="mr-2" />{" "}
                                                Chưa thanh toán
                                                {order.payment === null && (
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={
                                                            handleShowModal
                                                        } // Show modal when clicking payment button
                                                    >
                                                        Thanh toán
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </p>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-6">
                            <Card className="mb-4 order-card">
                                <Card.Body>
                                    <h5 className="text-primary">
                                        Trạng thái đơn hàng
                                    </h5>
                                    <p className="text-info">
                                        {order && order.orderStatusName}
                                    </p>
                                    <p className="text-info">
                                        {order &&
                                        order.shipDate &&
                                        order.orderStatusName ==
                                            "Đang vận chuyển"
                                            ? `Ngày nhận dự kiến: ${new Date(
                                                  order.shipDate
                                              ).toLocaleDateString("vi-VN", {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                              })}`
                                            : ""}
                                    </p>
                                    <p
                                        className="text"
                                        style={{ fontWeight: "bolder" }}
                                    >
                                        {order.description && (
                                            <>Lí do hủy : {order.description}</>
                                        )}
                                    </p>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>

                    {/* Delivery Method */}
                    <Card className="mb-4 order-card">
                        <Card.Body>
                            <h5 className="text-primary">
                                Phương thức thanh toán
                            </h5>
                            <p className="text-info">{order.payment}</p>
                        </Card.Body>
                    </Card>
                </div>

                {/* Customer Information */}
                <div className="col-lg-4">
                    <Card className="mb-4 order-card">
                        <Card.Body>
                            <h5 className="text-danger">Thông tin mua hàng</h5>
                            <p>Ngày mua hàng:{order.createdAt} </p>
                            <p>Người nhận: {order.fullName}</p>
                            <p>Email: {order.email}</p>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4 order-card">
                        <Card.Body>
                            <h5 className="text-danger">Địa chỉ nhận hàng</h5>
                            <p>SDT: {order.phone}</p>
                            <p>DC: {order.address}</p>
                        </Card.Body>
                    </Card>

                    {/* Buttons for actions */}
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button
                        variant="primary"
                        onClick={() => handlePaymentMethod("COD")}
                    >
                        Thanh toán khi giao hàng
                    </Button>
                    <Button
                        variant="secondary"
                        style={{ backgroundColor: "blue" }}
                        onClick={() => handlePaymentMethod("TRANSFER")}
                    >
                        Chuyển khoản
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default OrderDetail;
