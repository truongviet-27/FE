// import React, { useEffect, useState } from "react";
// import { Button, Form, Modal } from "react-bootstrap";
// import Alert from "react-bootstrap/Alert";
// import { useHistory, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { getOrderById, getOrderDetailByOrderId, updateProcess, updateShip } from "../../../api/OrderApi";

// const OrderDetail = () => {
//   const history = useHistory();
//   const [orderDetail, setOrderDetail] = useState([]);
//   const [order, setOrder] = useState({});
//   const { id } = useParams();
//   const [amount, setAmount] = useState();
//   const [sale, setSale] = useState();
//   const [total, setTotal] = useState();
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [shipment, setShipment] = useState("");
//   const [code, setCode] = useState("");
//   const [shipDate, setShipDate] = useState("");

//   const [showFirst, setShowFirst] = useState(false);
//   const [flagProcess, setFlagProcess] = useState(false);

//   useEffect(() => {
//     onLoad();
//   }, []);

//   const onLoad = () => {
//     getOrderById(id).then((resp) => {
//       setOrder(resp.data);
//       setSale(resp.data.discount ? resp.data.discount : 0);
//       setTotal(resp.data.total);
//     });

//     getOrderDetailByOrderId(id).then((resp) => {
//       setOrderDetail(resp.data);
//       const result = resp.data.reduce(
//         (price, item) => price + item.sellPrice * item.quantity,
//         0
//       );
//       setAmount(result);
//     });
//   };

//   const goBack = () => {
//     history.goBack();
//   };

//   const handleShowFirst = () => {
//       setShowFirst(true);
//   };

//   const flagProcessHandler = (e) => {
//     const { checked } = e.target;
//     setFlagProcess(checked);
//   };

//   const handleCloseFirst = () => {
//     setShowFirst(false);
//     setFlagProcess(false);
//   };

//   const confirmUpdateProcess = () => {
//       const data = {
//         id: id,
//         status: 1,
//         shipment: null,
//         payment: null,
//         code: null,
//         description: null,
//         shipDate: null,
//       };

//       updateProcess(data)
//         .then((resp) => {
//           onLoad()
//           toast.success("Cập nhật thành công.");
//         })
//       .catch((error) => toast.error(error.response.data.message));

//       setFlagProcess(false);
//       setShowFirst(false);
//   };

//   const handleShowModal = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);

//   const handleUpdateShip = async () => {
//     if (!shipment || !code || !shipDate) {
//       alert("Vui lòng nhập đầy đủ thông tin vận chuyển.");
//       return;
//     }

//     setIsUpdating(true);
//     try {
//       await updateShip({ id, shipment, code, shipDate });
//       toast.success("Cập nhật trạng thái đơn hàng thành công!")
//       onLoad();
//       handleCloseModal();
//     } catch (error) {
//       alert("Cập nhật thất bại. Vui lòng thử lại.");
//       console.error(error);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <div className="container-fluid row padding mb-5 card" style={{ marginTop: "25px" }}>
//       <button style={{ width: 60 }} onClick={goBack}>
//         <i
//           className="fa fa-arrow-left"
//           style={{ fontSize: 18 }}
//           aria-hidden="true"
//         ></i>
//       </button>
//       <div className="col-12 welcome mb-5 mt-5">
//         <div className="col-10 offset-1 text-center ">
//           <p
//             className="display-4 text-danger"
//             style={{ fontSize: "34px", fontWeight: "bolder" }}
//           >
//             Đơn hàng #{order && order.id}
//           </p>
//         </div>
//         <div className="col-12 row mb-5 mt-5">
//           <div className="col-6 text ">
//             <p className="display-4 text-primary" style={{ fontSize: "24px" }}>
//               Thông tin mua hàng
//             </p>
//             <p>Ngày tạo: {order && order.createdAt}</p>
//             <p>Người nhận: {order && order.fullName}</p>
//             <p>Email: {order && order.email}</p>
//           </div>
//           <div className="col-6 text ">
//             <p className="display-4 text-primary" style={{ fontSize: "24px" }}>
//               Địa chỉ nhận hàng
//             </p>
//             <p>SDT: {order && order.phone}</p>
//             <p>DC: {order && order.address}</p>
//           </div>
//         </div>
//         <div className="col-12 mb-5">
//           <p className="display-4 text-primary" style={{ fontSize: "24px" }}>
//             Chi tiết đơn hàng
//           </p>
//           <table className="table table-striped table-bordered">
//             <thead>
//               <tr>
//                 <th scope="col">Tên sản phẩm</th>
//                 <th scope="col">Size</th>
//                 <th scope="col">Giá</th>
//                 <th scope="col">Số lượng</th>
//                 <th scope="col">Tổng</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orderDetail.map((item, index) => (
//                 <tr key={index}>
//                   <th scope="row">{item.attribute.name}</th>
//                   <td>{item.attribute.size}</td>
//                   <td>{item.sellPrice.toLocaleString()}₫</td>
//                   <td>{item.quantity}</td>
//                   <td>{(item.sellPrice * item.quantity).toLocaleString()}₫</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="row mb-5">
//             <div className="col-12 text ">
//               <p style={{ fontWeight: "bolder" }}>
//                 Tạm tính: {amount && amount.toLocaleString()} đ
//               </p>
//               <p style={{ fontWeight: "bolder" }}>
//                 Giảm giá: - {sale ? ((amount * sale) / 100).toLocaleString() : 0} đ
//               </p>
//               <p className="text-danger" style={{ fontWeight: "bolder" }}>
//                 Tổng cộng: {total && total.toLocaleString()} đ
//               </p>
//             </div>
//           </div>
//           <div className="row mb-5">
//             <div className="col text ">
//               <p
//                 className="display-4 text-primary"
//                 style={{ fontSize: "24px" }}
//               >
//                 Trạng thái thanh toán
//               </p>
//               <p className="text-danger" style={{ fontWeight: "bolder" }}>
//                 {order.isPending ? "Đã thanh toán" : "Chưa thanh toán"}
//               </p>
//             </div>
//             <div className="col text " style={{ marginLeft: "500px" }}>
//               <p
//                 className="display-4 text-primary"
//                 style={{ fontSize: "24px" }}
//               >
//                 Trạng thái đơn hàng
//               </p>
//               <p className="text-danger" style={{ fontWeight: "bolder" }}>
//                 {order.orderStatusName}
//               </p>
//             </div>
//             {/* {order.orderStatusName !== "Đã giao" && order.orderStatusName !== "Đã hủy" && (
//               <div className="d-flex justify-content-center mb-3">
//                 {order.orderStatusName !== "Đang vận chuyển" && (
//                   <>
//                     <button className="btn btn-success mx-2" onClick={handleShowModal}>
//                       Xác nhận đơn hàng
//                     </button>
//                     <button className="btn btn-danger mx-2" onClick={handleShowModal}>
//                       Hủy đơn hàng
//                     </button>
//                   </>
//                 )}
//               </div>
//             )} */}
//             {order.orderStatusName !== "Đã giao" && order.orderStatusName !== "Đã hủy" && (
//               <div className="d-flex justify-content-center mb-3">
//                 {order.orderStatusName === "Chờ xác nhận" && (
//                   <button className="btn btn-success mx-2" onClick={()=> handleShowFirst(id, 1)}>
//                     Xác nhận đơn hàng
//                   </button>
//                 )}
//                 {order.orderStatusName === "Đang xử lý" && (
//                   <button className="btn btn-primary mx-2" onClick={handleShowModal}>
//                     Xác nhận vận chuyển
//                   </button>
//                 )}
//                 {order.orderStatusName === "Đang vận chuyển" && (
//                   <button className="btn btn-warning mx-2" onClick={handleShowModal}>
//                     Xác nhận đã giao hàng
//                   </button>
//                 )}
//                 {order.orderStatusName !== "Đang vận chuyển" && (
//                   <button className="btn btn-danger mx-2" onClick={handleShowModal}>
//                     Hủy đơn hàng
//                   </button>
//                 )}
//               </div>
//             )}

//           </div>
//         </div>
//       </div>

//       {/* Modal for shipment details */}
//       <Modal show={showFirst} onHide={handleCloseFirst}>
//         <Modal.Header closeButton>
//           <Modal.Title style={{ textAlign: "center" }}>
//             Xác nhận cập nhật?
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Alert variant="success">
//             <Alert.Heading>
//               Gọi điện cho khách hàng xác nhận những thông tin
//             </Alert.Heading>
//             <hr />
//             <p className="font-weight-bold">
//               Tên khách hàng: {order && order.fullName}
//             </p>
//             <p className="font-weight-bold">
//               Số điện thoại: {order && order.phone}
//             </p>
//             <p className="font-weight-bold">
//               Địa chỉ nhận hàng: {order && order.address}
//             </p>
//             <p className="font-weight-bold">Sản phẩm mua:</p>
//             {orderDetail?.length > 0 &&
//               orderDetail.map((item, index) => (
//                 <p key={index}>
//                   {item.attribute.name} - Size {item.attribute.size} - Số lượng{" "}
//                   {item.quantity}
//                 </p>
//               ))}
//           </Alert>
//           <Form.Group className="mb-3" controlId="formBasicCheckbox">
//             <Form.Check
//               type="checkbox"
//               label="Đã xác nhận đơn hàng."
//               defaultChecked={flagProcess}
//               onChange={(e) => flagProcessHandler(e)}
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="danger"
//             disabled={!flagProcess}
//             onClick={confirmUpdateProcess}
//           >
//             Xác nhận
//           </Button>
//           <Button variant="primary" onClick={handleCloseFirst}>
//             Đóng
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Cập nhật trạng thái vận chuyển</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="form-group">
//             <label htmlFor="shipment">Hãng vận chuyển:</label>
//             <Form.Select
//               style={{ height: 40, width: 300, marginBottom: 20 }}
//               onChange={(e) => setShipment(e.target.value)}
//             >
//               <option value={null}></option>
//               <option value="ViettelPost">ViettelPost</option>
//               <option value="J&T">J&T</option>
//               <option value="Gojek">Gojek</option>
//               <option value="AhaMove">AhaMove</option>
//             </Form.Select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="code">Mã vận chuyển:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="code"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="shipDate">Ngày giao hàng dự kiến:</label>
//             <input
//               type="date"
//               className="form-control"
//               id="shipDate"
//               value={shipDate}
//               onChange={(e) => setShipDate(e.target.value)}
//             />
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Đóng
//           </Button>
//           <Button variant="primary" onClick={handleUpdateShip} disabled={isUpdating}>
//             {isUpdating ? "Đang xử lý..." : "Cập nhật"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default OrderDetail;

import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getOrderById,
    getOrderDetailByOrderId,
    updateProcess,
    updateSuccess,
    updateCancel,
    updateShip,
} from "../../../api/OrderApi";
import formatDate from "../../../utils/convertDate";

const OrderDetail = () => {
    const history = useHistory();
    const [orderDetail, setOrderDetail] = useState([]);
    const [order, setOrder] = useState({});
    const { id } = useParams();
    const [amount, setAmount] = useState();
    const [sale, setSale] = useState();
    const [total, setTotal] = useState();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [shipment, setShipment] = useState("");
    const [code, setCode] = useState("");
    const [shipDate, setShipDate] = useState("");
    const [showFirst, setShowFirst] = useState(false);
    const [flagProcess, setFlagProcess] = useState(false);
    const [flagSuccess, setFlagSuccess] = useState(false);
    const [showThird, setShowThird] = useState(false);

    const [orders, setOrders] = useState([]);

    const [showSecond, setShowSecond] = useState(false);

    const [showFouth, setShowFouth] = useState(false);

    const [description, setDescription] = useState(null);
    const [reason, setReason] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("");

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = () => {
        getOrderById(id).then((resp) => {
            setOrder(resp.data.data);
            setSale(resp.data.data.discount ? resp.data.data.discount : 0);
            setTotal(resp.data.total);
        });

        getOrderDetailByOrderId(id).then((resp) => {
            setOrderDetail(resp.data.content);
            const result = resp.data.content.reduce(
                (price, item) => price + item.sellPrice * item.quantity,
                0
            );
            setAmount(result);
        });
    };

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

    const handleShowFirst = () => {
        setShowFirst(true);
    };
    const handleCloseFouth = () => {
        setShowFouth(false);
        setReason(null);
        setDescription(null);
    };

    const flagProcessHandler = (e) => {
        const { checked } = e.target;
        setFlagProcess(checked);
    };

    const handleCloseFirst = () => {
        setShowFirst(false);
        setFlagProcess(false);
    };
    const handleCloseThird = () => {
        setShowThird(false);
        setFlagSuccess(false);
    };

    const flagSuccessHandler = (e) => {
        const { checked } = e.target;
        setFlagSuccess(checked);
    };
    const confirmUpdateProcess = () => {
        const data = {
            id: id,
            status: 1,
            shipment: null,
            payment: null,
            code: null,
            description: null,
            shipDate: null,
        };

        updateProcess(data)
            .then((resp) => {
                onLoad();
                toast.success("Cập nhật thành công.");
            })
            .catch((error) => toast.error(error.response.data.message));

        setFlagProcess(false);
        setShowFirst(false);
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleUpdateShip = async () => {
        if (!shipment || !shipDate) {
            alert("Vui lòng nhập đầy đủ thông tin vận chuyển.");
            return;
        }

        setIsUpdating(true);
        try {
            await updateShip({ id, shipment, code, shipDate });
            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            onLoad();
            handleCloseModal();
        } catch (error) {
            alert("Cập nhật thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };
    const confirmUpdateSuccess = async () => {
        try {
            await updateSuccess({ id })
                .then((resp) => {
                    onLoad();
                    toast.success("Cập nhật thành công.");
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
            status: 5,
            shipment: shipment,
            code: code,
            description: `${reason} - ${description}`,
            shipDate: shipDate,
        };

        updateCancel(data)
            .then((resp) => {
                onLoad();
                toast.success("Cập nhật thành công.");
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
                <div className="col-12 row mb-5">
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
                <div className="col-12 mb-5">
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
                                        {item?.attribute?.product?.name}
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        <div className="flex items-center justify-center h-[80px]">
                                            <img
                                                className="img-fluid"
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                }}
                                                src={item?.image}
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
                    <div className="flex flex-col items-end !mt-4 !mb-14 text-[18px]">
                        <p style={{ fontWeight: "bolder" }}>
                            Tạm tính:{" "}
                            {(
                                order?.total /
                                (1 - (order?.voucher?.discount ?? 0) / 100)
                            )?.toLocaleString()}{" "}
                            đ
                        </p>
                        {
                            <p style={{ fontWeight: "bolder" }}>
                                Giảm giá: -{" "}
                                {(
                                    order?.total /
                                    (1 - (order?.voucher?.discount ?? 0) / 100)
                                )?.toLocaleString()}{" "}
                                đ
                            </p>
                        }
                        <p
                            className="text-danger"
                            style={{ fontWeight: "bolder" }}
                        >
                            Tổng cộng: {order?.total?.toLocaleString()} đ
                        </p>
                    </div>
                    <div className="flex mb-5 justify-between">
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
                                {order?.isPending
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
                                {order?.description && (
                                    <>Lí do hủy : {order.description}</>
                                )}
                            </p>
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
                                                handleShowFirst(id, 1)
                                            }
                                        >
                                            Xác nhận đơn hàng
                                        </button>
                                    )}
                                    {order?.orderStatus?.code ===
                                        "PROCESSING" && (
                                        <button
                                            className="btn btn-primary mx-2"
                                            onClick={handleShowModal}
                                        >
                                            Xác nhận vận chuyển
                                        </button>
                                    )}
                                    {order?.orderStatus?.code ===
                                        "SHIPPING" && (
                                        <button
                                            className="btn btn-warning mx-2"
                                            onClick={() => setShowThird(true)}
                                        >
                                            Xác nhận đã giao hàng
                                        </button>
                                    )}
                                    {order?.orderStatus?.code !==
                                        "SHIPPING" && (
                                        <button
                                            className="btn btn-danger mx-2"
                                            onClick={() => setShowFouth(true)}
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
                                            <span>
                                                {item.attribute.product.name}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="font-bold min-w-[110px]">
                                                Size:
                                            </span>
                                            <span> {item.attribute.size}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="font-bold min-w-[110px]">
                                                Số lượng:
                                            </span>
                                            <span>{item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật trạng thái vận chuyển</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="shipment">Hãng vận chuyển:</label>
                        <Form.Select
                            style={{ height: 40, width: 300, marginBottom: 20 }}
                            onChange={(e) => setShipment(e.target.value)}
                        >
                            <option value={null}></option>
                            <option value="ViettelPost">ViettelPost</option>
                            <option value="J&T">J&T</option>
                            <option value="Gojek">Gojek</option>
                            <option value="AhaMove">AhaMove</option>
                        </Form.Select>
                    </div>
                    {/* <div className="form-group">
            <label htmlFor="code">Mã vận chuyển:</label>
            <input
              type="text"
              className="form-control"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div> */}
                    <div className="form-group">
                        <label htmlFor="shipDate">
                            Ngày giao hàng dự kiến:
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="shipDate"
                            value={shipDate}
                            onChange={(e) => setShipDate(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdateShip}
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Đang xử lý..." : "Cập nhật"}
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
                            <option value="Gojek">Không còn nhu cầu</option>
                            <option value="AhaMove">Lí do khác</option>
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
