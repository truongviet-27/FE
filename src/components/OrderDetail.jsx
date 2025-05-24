// import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import { Alert, Button, Modal, Form } from "react-bootstrap";
import {
    FaCheckCircle,
    FaClipboardList,
    FaCreditCard,
    FaMoneyCheckAlt,
    FaTimesCircle,
    FaTruck,
} from "react-icons/fa"; // Icons
import { toast } from "react-toastify";
import {
    getOrderById,
    getOrderDetailByOrderId,
    updateOrderReturn,
} from "../api/OrderApi";
import "../index.css";
import formatDate from "../utils/convertDate";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Rating } from "react-simple-star-rating";
import {
    getReviewAttributeByOrderDetailId,
    reviewProduct,
} from "../api/AttributeApi";
import { generatePaymentUrl } from "../api/Payment";
import convertStatusOrder from "../utils/convertStatusOrder";

const OrderDetail = (props) => {
    const [orderDetail, setOrderDetail] = useState([]);
    const [order, setOrder] = useState({});
    const [amount, setAmount] = useState();
    const [sale, setSale] = useState();
    const [total, setTotal] = useState();
    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);
    const [showThird, setShowThird] = useState(false);
    const [description, setDescription] = useState(null);
    const [attributeId, setAttributeId] = useState(null);
    const [orderDetailId, setOrderDetailId] = useState(null);
    const [productId, setProductId] = useState(null);
    const [isViewReview, setIsViewReview] = useState(false);
    const [orderStatusReturn, setOrderStatusReturn] = useState(false);

    const history = useHistory();

    const url = new URL(window.location.href);
    const orderId = url.pathname.split("/").pop();

    const [rating, setRating] = useState(0);

    const handleRating = (rate) => {
        setRating(rate);
    };

    const descriptionHandler = (value) => {
        setDescription(value);
    };

    const handleReviewAttribute = () => {
        reviewProduct({
            orderDetailId,
            attributeId,
            rating,
            description,
            productId,
        })
            .then(() => {
                toast.success("Cập nhật thành công.");
                setShowThird(false);
            })
            .catch((error) => toast.error(error.response.data.message));
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleCloseThird = () => {
        setShowThird(false);
    };

    const handleShowThird = (orderDetailId, attributeId, productId) => {
        console.log("xxxxxxxxxxxxx");
        getReviewAttributeByOrderDetailId(orderDetailId)
            .then((res) => {
                if (res.data.data) {
                    setRating(res.data.data.rating);
                    setDescription(res.data.data.description);
                    setIsViewReview(true);
                } else {
                    setRating(null);
                    setDescription("");
                    setIsViewReview(false);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
        setOrderDetailId(orderDetailId);
        setAttributeId(attributeId);
        setProductId(productId);
        setShowThird(true);
    };

    const handlePaymentMethod = (method) => {
        setPaymentMethod(method);
        if (method === "VNPAY") {
            generatePaymentUrl({ orderId })
                .then((res) => {
                    window.location.href = res.data.data;
                })
                .catch((err) => toast.error(err.message));
            handleCloseModal();
        }
    };

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = () => {
        getOrderById(orderId).then((resp) => {
            setOrder(resp.data.data);
            setSale(
                resp.data.data?.voucher?.discount
                    ? resp.data.data?.voucher?.discount
                    : 0
            );
            setTotal(resp.data.data?.total);
        });
        getOrderDetailByOrderId(orderId).then((resp) => {
            setOrderDetail(resp.data.content);
            const result = resp.data.content.reduce(
                (price, item) => price + item.sellPrice * item.quantity,
                0
            );
            setAmount(result);
        });
    };

    const handleShowModalReturn = () => {
        console.log("xxxxxxxxxxxxxx");
        setOrderStatusReturn(true);
    };
    const handleCloseModalReturn = () => {
        setOrderStatusReturn(false);
    };

    const handleOrderReturn = async () => {
        const data = {
            orderId: order._id,
            status: "RETURN",
        };
        updateOrderReturn(data)
            .then((res) => {
                toast.success(res.data.message);
                setOrderStatusReturn(false);
                getOrderById(orderId).then((resp) => {
                    setOrder(resp.data.data);
                    setSale(
                        resp.data.data?.voucher?.discount
                            ? resp.data.data?.voucher?.discount
                            : 0
                    );
                    setTotal(resp.data.data?.total);
                });
            })
            .catch((error) => {
                console.log(error, "error");
                toast.error(error.response.data.message);
            });
    };

    return (
        <div className="!px-10 mt-4">
            <div className="row">
                {/* Order Information */}
                <div className="col-lg-8">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3 text-[19px]">
                            <FaTruck className="mr-2 text-primary" />
                            <span className="text-primary font-bold">
                                Chi tiết đơn hàng
                            </span>
                        </div>
                        <table className="table table-striped table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th className="text-center align-middle">
                                        Tên sản phẩm
                                    </th>
                                    <th className="text-center align-middle">
                                        Ảnh sản phẩm
                                    </th>
                                    <th className="text-center align-middle">
                                        Size
                                    </th>
                                    <th className="text-center align-middle">
                                        Giá
                                    </th>
                                    <th className="text-center align-middle">
                                        Số lượng
                                    </th>
                                    <th className="text-center align-middle">
                                        Tổng
                                    </th>

                                    <th className="text-center align-middle">
                                        Đánh giá
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetail.map((item, index) => (
                                    <tr key={item._id} className="table-row">
                                        <td
                                            className="text-center align-middle font-medium hover:!text-blue-600"
                                            onClick={() => {
                                                history.push(
                                                    `/product-detail/${item.product._id}`
                                                );
                                            }}
                                        >
                                            {item.product.name}
                                        </td>
                                        <td className="text-center align-middle font-medium">
                                            <div className="flex justify-center items-center">
                                                <img
                                                    src={
                                                        item?.imageUrls[0]?.url
                                                    }
                                                    className="!w-[70px] !h-[70px]"
                                                    onClick={() => {
                                                        history.push(
                                                            `/product-detail/${item.product._id}`
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="text-center align-middle font-medium">
                                            {item.attribute.size}
                                        </td>
                                        <td className="text-center align-middle font-medium">
                                            {item.sellPrice.toLocaleString(
                                                "vi-VN"
                                            )}
                                            ₫
                                        </td>
                                        <td className="text-center align-middle font-medium">
                                            {item.quantity}
                                        </td>
                                        <td className="text-center align-middle font-medium">
                                            {(
                                                item.sellPrice * item.quantity
                                            ).toLocaleString("vi-VN")}
                                            ₫
                                        </td>
                                        <td className="text-center align-middle font-medium">
                                            {order?.orderStatus?.code ===
                                                "DELIVERED" && (
                                                <div
                                                    className="!text-[15px] py-2 hover:text-red-600 hover:underline rounded-2xl"
                                                    onClick={() => {
                                                        handleShowThird(
                                                            item._id,
                                                            item.attribute._id,
                                                            item.product._id
                                                        );
                                                    }}
                                                >
                                                    Đánh giá
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex flex-col gap-3 text-right">
                            <div className="flex gap-2 justify-end">
                                <span className="font-bold">Tạm tính:</span>{" "}
                                <span className="font-bold">
                                    {amount?.toLocaleString("vi-VN")}
                                </span>{" "}
                                <span className="font-bold">đ</span>
                            </div>
                            {sale ? (
                                <div className="flex gap-3 justify-end font-bold">
                                    <span className="font-bold">
                                        Giảm giá: -
                                    </span>
                                    <span className="font-bold">
                                        {sale
                                            ? (
                                                  (amount * sale) /
                                                  100
                                              ).toLocaleString("vi-VN")
                                            : 0}
                                    </span>
                                    <span className="font-bold">đ</span>
                                </div>
                            ) : (
                                <div className="flex gap-1 justify-end">
                                    <span className="font-bold">
                                        Giảm giá: 0
                                    </span>
                                    <span className="font-bold">đ</span>
                                </div>
                            )}

                            <h5 className="text-danger !font-bold">
                                Tổng cộng: {total?.toLocaleString("vi-VN")} đ
                            </h5>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between md:flex-row !pt-10 border-t-1 border-gray-300">
                        <div className="mb-4">
                            <div>
                                <div className="text-primary flex items-center gap-2">
                                    <FaMoneyCheckAlt
                                        className="mb-2"
                                        size={25}
                                    />
                                    <h5 className="text-primary">
                                        Trạng thái thanh toán
                                    </h5>
                                </div>
                                <p
                                    className={`text-${
                                        order.isPayment ? "success" : "danger"
                                    } !ml-8 mt-1`}
                                >
                                    {order.isPayment ? (
                                        <div className="flex gap-2 items-center font-bold">
                                            <FaCheckCircle className="mr-2" />{" "}
                                            Đã thanh toán
                                        </div>
                                    ) : order.isPayment === false ? (
                                        <div className="flex gap-2 items-center font-bold">
                                            <FaTimesCircle className="mr-2" />{" "}
                                            Chưa thanh toán
                                            {(order.payment === "BANK" ||
                                                order.payment === "VNPAY") && (
                                                <button
                                                    className="btn btn-success"
                                                    onClick={handleShowModal}
                                                >
                                                    Thanh toán
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 items-center font-bold">
                                            <FaTimesCircle className="mr-2" />
                                            Hoàn tiền
                                        </div>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div>
                                <div className="text-primary flex gap-2 items-center font-bold">
                                    <FaClipboardList
                                        className="mb-2"
                                        size={25}
                                    />
                                    <h5 className="text-primary ">
                                        Trạng thái đơn hàng
                                    </h5>
                                </div>
                                <div className="flex flex-col !ml-8">
                                    <p className="text-danger font-bold">
                                        {convertStatusOrder(
                                            order?.orderStatus?.code
                                        )}
                                    </p>
                                    <p className="font-bold">
                                        {order?.shipDate &&
                                        order.orderStatus?.code == "SHIPPING"
                                            ? `Ngày nhận dự kiến: ${new Date(
                                                  order?.shipDate
                                              ).toLocaleDateString("vi-VN", {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                              })}`
                                            : ""}
                                    </p>
                                    {order.reason && (
                                        <div className="text flex gap-2">
                                            <span className="font-bold">
                                                Lí do hủy:
                                            </span>
                                            <span>{order.reason}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div>
                                <div className="text-primary flex gap-2 items-center font-bold">
                                    <FaCreditCard className="mb-2" size={25} />
                                    <h5 className="text-primary">
                                        Phương thức thanh toán
                                    </h5>
                                </div>
                                <p className="font-bold !ml-8 mt-1">
                                    {order.payment}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Method */}
                </div>

                {/* Customer Information */}
                <div className="col-lg-4 border-t-1 border-gray-300 md:border-none !pt-10 md:!pt-0 !mb-10">
                    <div className="mb-4">
                        <div>
                            <h5 className="text-danger !mb-5">
                                Thông tin mua hàng
                            </h5>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="font-medium">
                                    Ngày mua hàng:
                                </span>
                                <span>{formatDate(order.createdAt, true)}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="font-medium">Người nhận:</span>
                                <span>{order.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="font-medium">Email:</span>
                                <span>{order.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div>
                            <h5 className="text-danger">Địa chỉ nhận hàng</h5>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="font-medium">SĐT:</span>
                                <span>{order.phone}</span>
                            </div>
                            <div className="flex gap-2 mb-3">
                                <span className="font-medium">ĐC:</span>
                                <span>{order.address}</span>
                            </div>
                        </div>
                    </div>

                    {order?.orderStatus?.code === "DELIVERED" && (
                        <div>
                            <button
                                className="!bg-red-500 border !border-red-600 text-white !rounded-[10px] !py-1 !px-4 !text-[15px]"
                                onClick={handleShowModalReturn}
                            >
                                Trả hàng
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="!mb-5">
                        <Button
                            variant="outline-primary"
                            className="!mr-4"
                            onClick={() => handlePaymentMethod("BANK")}
                        >
                            Chuyển khoản qua ngân hàng
                        </Button>
                        {paymentMethod === "BANK" && (
                            <img
                                src={`https://img.vietqr.io/image/ICB-100870483156-compact2.png?amount=${
                                    order.total
                                }&accountName=${encodeURIComponent(
                                    "NGUYEN TRUONG VIET"
                                )}&addInfo=${encodeURIComponent(
                                    `TK: ${order.user.username} - SĐT: ${props.user.phone}`
                                )}`}
                                alt="QR"
                                className="!w-[300px] !h-[350px] border mt-1 mb-2 rounded-2xl"
                            />
                        )}
                    </div>
                    <Button
                        variant="outline-primary"
                        onClick={() => handlePaymentMethod("VNPAY")}
                    >
                        Thanh toán qua VNPAY
                    </Button>
                </Modal.Body>
            </Modal>
            <Modal show={showThird} onHide={handleCloseThird}>
                <Modal.Header>
                    <Modal.Title style={{ textAlign: "center" }}>
                        Đánh giá sản phẩm
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="success">
                        <Alert.Heading>Đánh giá</Alert.Heading>
                        <hr />

                        <Form>
                            <div className="flex justify-center">
                                <Rating
                                    onClick={handleRating}
                                    initialValue={rating}
                                    size={40}
                                    transition
                                    allowFraction={false}
                                    SVGstyle={{ display: "inline-block" }}
                                    fillColor="#f59e0b"
                                    emptyColor="#9ca3af"
                                    readonly={isViewReview}
                                />
                            </div>
                            <Form.Label
                                style={{ marginRight: 30, marginBottom: 10 }}
                            >
                                Mô tả
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                onChange={(e) => {
                                    descriptionHandler(e.target.value);
                                }}
                                value={description}
                                disabled={isViewReview}
                            />
                        </Form>
                    </Alert>
                </Modal.Body>
                {!isViewReview && (
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleCloseThird}>
                            Đóng
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleReviewAttribute}
                            disabled={!rating || !description}
                        >
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>

            <Modal show={orderStatusReturn} onHide={handleCloseModalReturn}>
                <Modal.Header>
                    <Modal.Title style={{ textAlign: "center" }}>
                        Xác nhận hoàn trả
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn hoàn trả đơn hàng này không?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModalReturn}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={handleOrderReturn}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderDetail;
