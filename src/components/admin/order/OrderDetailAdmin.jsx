import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import {
    FaCheckCircle,
    FaClipboardList,
    FaCreditCard,
    FaMoneyCheckAlt,
    FaTimesCircle,
} from "react-icons/fa"; // Icons
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getOrderById,
    getOrderDetailByOrderId,
    updateCancel,
    updateProcess,
    updateShip,
    updateSuccess,
} from "../../../api/OrderApi";
import { getAllShipments } from "../../../api/Shipment";
import formatDate from "../../../utils/convertDate";
import convertStatusOrder from "../../../utils/convertStatusOrder";
import convertStatusColor from "../../../utils/convertStatusColor";

const OrderDetail = () => {
    const history = useHistory();
    const { id } = useParams();
    const [orderDetail, setOrderDetail] = useState([]);
    const [order, setOrder] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    const [shipment, setShipment] = useState("");
    const [shipDate, setShipDate] = useState("");

    const [showFirst, setShowFirst] = useState(false);
    const [showSecond, setShowSecond] = useState(false);
    const [showThird, setShowThird] = useState(false);
    const [showFouth, setShowFouth] = useState(false);

    const [flagProcess, setFlagProcess] = useState(false);
    const [flagSuccess, setFlagSuccess] = useState(false);

    const [description, setDescription] = useState(null);
    const [reason, setReason] = useState(null);

    const [shipments, setShipments] = useState([]);

    const [obj, setObj] = useState({});

    const shipmentHandler = (value) => {
        setShipment(value);
    };

    const shipDateHandler = (value) => {
        const inputDate = new Date(value);
        const today = new Date();

        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffInMs = inputDate - today;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays > 2) {
            setShipDate(inputDate);
        } else {
            toast.warning(
                "Ngày vận chuyển phải lớn hơn ngày hiện tại ít nhất 2 ngày!"
            );
            setShipDate("");
        }
    };

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = () => {
        getOrderById(id).then((resp) => {
            setOrder(resp.data.data);
        });

        getOrderDetailByOrderId(id).then((resp) => {
            setOrderDetail(resp.data.content);
        });
    };

    useEffect(() => {
        getAllShipments()
            .then((resp) => setShipments(resp.data.content))
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });
    }, []);

    const goBack = () => {
        history.goBack();
    };

    const reasonHandler = (value) => {
        console.log(value);
        setReason(value);
    };

    const descriptionHandler = (value) => {
        console.log(value);
        setDescription(value);
    };

    const flagProcessHandler = (e) => {
        const { checked } = e.target;
        setFlagProcess(checked);
    };

    const handleShowFirst = (orderId, statusCode, paymentCode) => {
        setObj({ orderId, statusCode });
        setShowFirst(true);
    };

    const handleCloseFirst = () => {
        setShowFirst(false);
        setFlagProcess(false);
    };

    const handleShowSecond = (orderId, statusCode, paymentCode) => {
        setObj({ orderId, statusCode });
        setShowSecond(true);
    };
    const handleCloseSecond = () => {
        setShowSecond(false);
    };

    const handleShowThird = (orderId, statusCode, paymentCode) => {
        setObj({ orderId, statusCode });
        setShowThird(true);
    };

    const handleCloseThird = () => {
        setShowThird(false);
        setFlagSuccess(false);
    };

    const handleShowFouth = (orderId, statusCode, paymentCode) => {
        setObj({ orderId, statusCode });
        setShowFouth(true);
    };

    const handleCloseFouth = () => {
        setShowFouth(false);
        setReason(null);
        setDescription(null);
    };

    const flagSuccessHandler = (e) => {
        const { checked } = e.target;
        setFlagSuccess(checked);
    };

    const confirmUpdateProcess = () => {
        const data = {
            id: id,
            status: obj.statusCode,
            shipment: "",
            payment: order.payment,
            description:
                reason && description ? `${reason} - ${description}` : "",
            shipDate: shipDate,
        };

        updateProcess(data)
            .then((res) => {
                onLoad();
                toast.success(res.data.message);
            })
            .catch((error) => toast.error(error.response.data.message));

        setFlagProcess(false);
        setShowFirst(false);
    };

    const confirmUpdateShip = async () => {
        if (!shipment || !shipDate) {
            alert("Vui lòng nhập đầy đủ thông tin vận chuyển.");
            return;
        }

        setIsUpdating(true);
        try {
            const data = {
                id: id,
                status: obj.statusCode,
                shipment: shipment,
                description:
                    reason && description ? `${reason} - ${description}` : "",
                shipDate: shipDate,
            };
            const res = await updateShip(data);
            toast.success(res.data.message);
            onLoad();
            handleCloseSecond();
        } catch (error) {
            alert("Cập nhật thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const confirmUpdateSuccess = async () => {
        const data = {
            id: id,
            status: obj.statusCode,
        };
        try {
            await updateSuccess(data)
                .then((res) => {
                    onLoad();
                    toast.success(res.data.message);
                })
                .catch((error) => toast.error(error.response.data.message));

            setFlagSuccess(null);
            setShowThird(false);
        } catch (error) {
            alert("Cập nhật thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const confirmUpdateCancel = () => {
        const data = {
            id: id,
            status: obj.statusCode,
            shipment: null,
            description: `${reason} - ${description}`,
            shipDate: null,
        };

        updateCancel(data)
            .then((res) => {
                onLoad();
                toast.success(res.data.message);
            })
            .catch((error) => toast.error(error.response.data.message));

        setReason(null);
        setDescription(null);
        setShowFouth(false);
    };

    return (
        <div
            className="card flex flex-col justify-between !mx-[25px]"
            style={{ marginTop: "25px" }}
        >
            <div className="col-12 flex items-center justify-between text-center mb-5">
                <button style={{ width: 60 }} onClick={goBack}>
                    <i
                        className="fa fa-arrow-left"
                        style={{ fontSize: 18 }}
                        aria-hidden="true"
                    ></i>
                </button>
                <h2 className="text-danger !mb-0">Đơn hàng #{order?.code}</h2>
                <div className="w-[60px]"></div>
            </div>
            <div className="col-12 welcome">
                <div className="col-12 row mb-4">
                    <div className="col-6 text ">
                        <p
                            className="display-4 text-primary !font-bold"
                            style={{ fontSize: "24px" }}
                        >
                            Thông tin mua hàng
                        </p>
                        <div className="flex gap-2 mb-3">
                            <span className="font-bold">Ngày tạo:</span>{" "}
                            <span>{formatDate(order?.createdAt, true)}</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                            <span className="font-bold">Người nhận:</span>{" "}
                            <span>{order?.fullName}</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                            <span className="font-bold">Email:</span>
                            <span>{order?.email}</span>
                        </div>
                    </div>
                    <div className="col-6 text ">
                        <p
                            className="display-4 text-primary !font-bold"
                            style={{ fontSize: "24px" }}
                        >
                            Địa chỉ nhận hàng
                        </p>
                        <div className="flex gap-2 mb-3">
                            <span className="font-bold">SĐT:</span>
                            <span>{order?.phone}</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                            <span className="font-bold">ĐC:</span>
                            <span>{order?.address}</span>
                        </div>
                    </div>
                </div>
                <div className="col-12 !mb-0 border-t-1 border-gray-300 pt-4">
                    <p
                        className="display-4 text-primary !font-bold"
                        style={{ fontSize: "24px" }}
                    >
                        Chi tiết đơn hàng
                    </p>
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Hình ảnh</th>
                                <th scope="col">Size</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetail?.map((item, index) => (
                                <tr key={index}>
                                    <td
                                        scope="row"
                                        className="text-center align-middle font-bold"
                                    >
                                        {item?.product?.name}
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        <div className="flex items-center justify-center h-[80px]">
                                            <img
                                                className="img-fluid"
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                }}
                                                src={item?.imageUrls[0]?.url}
                                                alt=""
                                            />
                                        </div>
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        {item?.attribute?.size}
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        {item?.sellPrice?.toLocaleString()}₫
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        {item?.quantity}
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        {(
                                            item?.sellPrice * item?.quantity
                                        )?.toLocaleString()}
                                        ₫
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex flex-col items-end !mt-4 !mb-4 text-[18px]">
                        <p style={{ fontWeight: "bolder" }}>
                            Tạm tính:{" "}
                            {(
                                order?.total /
                                (1 - (order?.voucher?.discount ?? 0) / 100)
                            )?.toLocaleString()}{" "}
                            đ
                        </p>
                        {order?.voucher?.discount ? (
                            <p style={{ fontWeight: "bolder" }}>
                                Giảm giá: -{" "}
                                {(
                                    order?.total /
                                    (1 - (order?.voucher?.discount ?? 0) / 100)
                                )?.toLocaleString()}{" "}
                                đ
                            </p>
                        ) : (
                            <p style={{ fontWeight: "bolder" }}>
                                Giảm giá: 0 đ
                            </p>
                        )}
                        <h5 className="text-danger !font-bold">
                            Tổng cộng: {order?.total?.toLocaleString()} đ
                        </h5>
                    </div>
                    {/* <div className="flex mb-5 justify-between">
                        <div className="">
                            <p
                                className="display-4 text-primary !font-bold"
                                style={{ fontSize: "24px" }}
                            >
                                Trạng thái thanh toán
                            </p>
                            <p
                                className="text-danger"
                                style={{ fontWeight: "bolder" }}
                            >
                                {order?.isPayment
                                    ? "Đã thanh toán"
                                    : "Chưa thanh toán"}
                            </p>
                        </div>
                        <div className="">
                            <p
                                className="display-4 text-primary !font-bold"
                                style={{ fontSize: "24px" }}
                            >
                                Trạng thái đơn hàng
                            </p>
                            <p
                                className="text-danger"
                                style={{ fontWeight: "bolder" }}
                            >
                                {order?.orderStatus?.name}
                            </p>
                            <p
                                className="text"
                                style={{ fontWeight: "bolder" }}
                            >
                                {order?.reason && (
                                    <>Lí do hủy : {order?.reason}</>
                                )}
                            </p>
                        </div>
                    </div> */}
                    <div className="flex flex-col justify-between md:flex-row !pt-10 mb-5 border-t-1 border-b-1 border-gray-300">
                        <div className="mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FaMoneyCheckAlt className="mb-2 text-primary text-[22px]" />
                                    <h5 className="text-primary !mb-1">
                                        Trạng thái thanh toán
                                    </h5>
                                </div>
                                <p
                                    className={`text-${
                                        order.isPayment ? "success" : "danger"
                                    }`}
                                >
                                    {order.isPayment ? (
                                        <div className="flex gap-2 items-center font-bold">
                                            <FaCheckCircle className="mr-2" />{" "}
                                            Đã thanh toán
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 items-center font-bold">
                                            <FaTimesCircle className="mr-2" />{" "}
                                            Chưa thanh toán
                                        </div>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FaClipboardList className="mb-2 text-primary text-[22px]" />
                                    <h5 className="text-primary !mb-1">
                                        Trạng thái đơn hàng
                                    </h5>
                                </div>
                                <p className="text-info">
                                    {convertStatusColor(
                                        order?.orderStatus?.code
                                    )}
                                </p>
                                <p className="text-info">
                                    {order?.shipDate &&
                                    order.orderStatus?.name == "SHIPPING"
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
                        <div className="mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FaCreditCard className="mb-2 text-primary text-[22px]" />
                                    <h5 className="text-primary !mb-1">
                                        Phương thức thanh toán
                                    </h5>
                                </div>
                                <p className="font-bold">{order.payment}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        {order?.orderStatus?.code !== "DELIVERED" &&
                            order?.orderStatus?.code !== "CANCELLED" && (
                                <div className="d-flex justify-content-center !mb-0">
                                    {order?.orderStatus?.code ===
                                        "PENDING_CONFIRM" && (
                                        <button
                                            className="btn btn-success mx-2"
                                            onClick={() =>
                                                handleShowFirst(
                                                    id,
                                                    "PROCESSING"
                                                )
                                            }
                                        >
                                            Xác nhận đơn hàng
                                        </button>
                                    )}
                                    {order?.orderStatus?.code ===
                                        "PROCESSING" && (
                                        <button
                                            className="btn btn-primary mx-2"
                                            onClick={() => {
                                                handleShowSecond(
                                                    id,
                                                    "SHIPPING"
                                                );
                                            }}
                                        >
                                            Xác nhận vận chuyển
                                        </button>
                                    )}
                                    {order?.orderStatus?.code ===
                                        "SHIPPING" && (
                                        <button
                                            className="btn btn-warning mx-2"
                                            onClick={() => {
                                                handleShowThird(
                                                    id,
                                                    "DELIVERED"
                                                );
                                            }}
                                        >
                                            Xác nhận đã giao hàng
                                        </button>
                                    )}
                                    {order?.orderStatus?.code !== "DELIVERED" && !order.isPayment && (
                                            <button
                                                className="btn btn-danger mx-2"
                                                onClick={() => {
                                                    handleShowFouth(
                                                        id,
                                                        "CANCELLED"
                                                    );
                                                }}
                                            >
                                                Hủy đơn hàng
                                            </button>
                                        )}
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {/* Modal for shipment details */}
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
                        <div className="flex mb-3">
                            <span className="font-bold min-w-[130px]">
                                Tên khách hàng:
                            </span>
                            <span>{order?.fullName}</span>
                        </div>
                        <div className="flex mb-3">
                            <span className="font-bold min-w-[130px]">
                                Email:
                            </span>
                            <span>{order?.email}</span>
                        </div>
                        <div className="flex mb-3">
                            <span className="font-bold min-w-[130px]">
                                Số điện thoại:
                            </span>
                            <span>{order?.phone}</span>
                        </div>
                        <div className="flex mb-3">
                            <span className="font-bold min-w-[130px]">
                                Địa chỉ nhận hàng:
                            </span>
                            <span>{order?.address}</span>
                        </div>
                        <p className="font-bold">Sản phẩm mua:</p>
                        <div className="flex flex-col gap-2 !ml-3">
                            {orderDetail?.map((item, index) => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-2 border-b border-gray-300 pb-2"
                                >
                                    <div className="border border-gray-400">
                                        <img
                                            src=""
                                            alt="Ảnh"
                                            className="!w-[70px] !h-[70px]"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-2">
                                            <span className="font-bold min-w-[110px]">
                                                Tên sản phẩm:
                                            </span>
                                            <span>{item?.product?.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="font-bold min-w-[110px]">
                                                Size:
                                            </span>
                                            <span>
                                                {" "}
                                                {item?.attribute?.size}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="font-bold min-w-[110px]">
                                                Số lượng:
                                            </span>
                                            <span>{item?.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex mb-3 mt-3">
                            <span className="font-bold min-w-[90px]">
                                Tổng tiền:
                            </span>
                            <span>{order?.total?.toLocaleString()} VNĐ</span>
                        </div>
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
                        <Alert.Heading>
                            Cập nhật thông tin vận đơn
                        </Alert.Heading>
                        <hr />
                        <Form.Label
                            style={{ marginRight: 30, marginBottom: 10 }}
                        >
                            Đơn vị vận chuyển
                        </Form.Label>
                        <Form.Select
                            style={{ height: 40, marginBottom: 20 }}
                            onChange={(e) => shipmentHandler(e.target.value)}
                        >
                            <option value={null}></option>
                            {shipments.map((shipment) => {
                                return (
                                    <option
                                        key={shipment._id}
                                        value={shipment._id}
                                    >
                                        {shipment.name}
                                    </option>
                                );
                            })}
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
                            <Form.Label
                                style={{ marginRight: 30, marginBottom: 10 }}
                            >
                                Ngày nhận dự kiến
                            </Form.Label>
                            <Form.Control
                                style={{ height: 40 }}
                                type="date"
                                onChange={(e) =>
                                    shipDateHandler(e.target.value)
                                }
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
                            Tổng tiền đơn hàng: {order?.total?.toLocaleString()}{" "}
                            đ
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
                        <Form.Label
                            style={{ marginRight: 30, marginBottom: 10 }}
                        >
                            Lí do hủy đơn
                        </Form.Label>
                        <Form.Select
                            style={{ height: 40, width: 420, marginBottom: 20 }}
                            onChange={(e) => reasonHandler(e.target.value)}
                        >
                            <option value={null}></option>
                            <option value="Đặt trùng">Đặt trùng</option>
                            <option value="Thêm bớt sản phẩm">
                                Thêm bớt sản phẩm
                            </option>
                            <option value="Không còn nhu cầu">
                                Không còn nhu cầu
                            </option>
                            <option value="Lí do khác">Lí do khác</option>
                        </Form.Select>
                        <Form>
                            <Form.Label
                                style={{ marginRight: 30, marginBottom: 10 }}
                            >
                                Mô tả
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                onChange={(e) =>
                                    descriptionHandler(e.target.value)
                                }
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

export default OrderDetail;
