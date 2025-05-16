import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { getAllOrder, cancelOrder, getAllOrderStatus } from "../api/OrderApi";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Alert from "react-bootstrap/Alert";
import formatDate from "../utils/convertDate";

const Order = (props) => {
    const [order, setOrder] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [status, setStatus] = useState("");
    const [show, setShow] = useState(false);
    const [obj, setObj] = useState({});
    const [total, setTotal] = useState();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [showFouth, setShowFouth] = useState(false);
    const [description, setDescription] = useState(null);
    const [reason, setReason] = useState(null);
    const history = useHistory();

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

    const descriptionHandler = (value) => {
        setDescription(value);
    };

    const confirmUpdateCancel = () => {
        const data = {
            id: obj.orderId,
            description: `${reason} - ${description}`,
        };

        cancelOrder(data)
            .then(() => {
                toast.success("Cập nhật thành công.");
                setStatus(obj.statusId);
                setPage(0);
                getAllOrderByStatus(obj.statusId)
                    .then((res) => {
                        setOrder(res.data.content);
                        setTotal(res.data.totalPages);
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => toast.error(error.response.data.message));

        setReason(null);
        setDescription(null);
        setShowFouth(false);
    };

    const reasonHandler = (value) => {
        setReason(value);
    };
    useEffect(() => {
        onLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size]);

    useEffect(() => {
        getAllOrderStatus()
            .then((resp) => setOrderStatus(resp.data.content))
            .catch((error) => console.log(error.response.data.Errors));
    }, []);

    const onLoad = () => {
        getAllOrder(localStorage.getItem("id"), status, page, size)
            .then((res) => {
                setOrder(res.data.content);
                setTotal(res.data.totalPages);
            })
            .catch((error) => console.log(error.response.data.Errors));
    };

    const getAllOrderByStatus = (value) => {
        setPage(0);
        setStatus(value);
        getAllOrder(props.user.userId, value, page, size)
            .then((res) => {
                setOrder(res.data.content);
                setTotal(res.data.totalPages);
            })
            .catch((error) => console.log(error.response.data.Errors));
    };

    return (
        <>
            <div className="col-12">
                <div className="container-fluid mb-5 mt-5">
                    <div className="mini-card !mb-0">
                        <h4 className="text-danger !mb-0"> Đơn hàng của bạn</h4>
                    </div>
                    <div className="mb-5">
                        <div className="col-12 mb-3 mt-3 mini-card">
                            <div className="form-check form-check-inline mr-5">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    value=""
                                    onChange={(event) =>
                                        getAllOrderByStatus(event.target.value)
                                    }
                                    checked={status == ""}
                                />
                                <label className="form-check-label">
                                    Tất cả
                                </label>
                            </div>
                            {orderStatus?.map((item, index) => (
                                <div
                                    className="form-check form-check-inline mr-5 ml-5"
                                    key={index}
                                >
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        value={item._id}
                                        onChange={(event) =>
                                            getAllOrderByStatus(
                                                event.target.value
                                            )
                                        }
                                        checked={status == item._id}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="inlineRadio2"
                                    >
                                        {item.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <table className="table table-striped table-bordered table-hover mt-2 text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Mã đơn hàng
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Ngày tạo
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Tình trạng thanh toán
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Trạng thái đơn hàng
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Đơn vị vận chuyển
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Ngày giao hàng
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Tổng tiền
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-center align-middle"
                                    >
                                        Hủy
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.map((item, index) => (
                                    <tr key={index}>
                                        <td
                                            className="text-center align-middle font-bold"
                                            scope="row"
                                        >
                                            <NavLink
                                                to={`/order/detail/${item._id}`}
                                                exact
                                            >
                                                {item.code}
                                            </NavLink>
                                        </td>
                                        <td className="text-center align-middle font-bold">
                                            {formatDate(item.createdAt, true)}
                                        </td>
                                        <td
                                            className={`text-center align-middle font-bold ${
                                                item.isPending
                                                    ? "text-success"
                                                    : "text-danger"
                                            }`}
                                        >
                                            {item.isPending
                                                ? "Đã thanh toán"
                                                : "Chưa thanh toán"}
                                        </td>
                                        <td className="text-center align-middle font-bold">
                                            {item?.orderStatus?.name}
                                        </td>
                                        <td className="text-center align-middle font-bold">
                                            {item?.shipment?.name}
                                        </td>
                                        <td className="text-center align-middle font-bold">
                                            {formatDate(item?.shipDate)}
                                        </td>
                                        <td className="text-center align-middle font-bold">
                                            {item.total.toLocaleString()} ₫
                                        </td>
                                        <td className="text-center align-middle font-bold">
                                            <button
                                                className="btn btn-light !cursor-not-allowed"
                                                onClick={() =>
                                                    handleShowFouth(item.id, 5)
                                                }
                                                disabled={[
                                                    "CANCELLED",
                                                    "DELIVERED",
                                                ].includes(
                                                    item?.orderStatus?.code
                                                )}
                                            >
                                                <i
                                                    className="fa fa-ban text-danger"
                                                    aria-hidden="true"
                                                ></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        <nav
                            aria-label="Page navigation"
                            className="flex items-center justify-between !mt-10"
                        >
                            <div className="w-[100px]" />

                            <div className="flex-1 flex justify-center items-center">
                                <div className="flex pagination gap-2">
                                    <li
                                        className={
                                            page === 0
                                                ? "page-item disabled"
                                                : "page-item"
                                        }
                                    >
                                        <button
                                            className="page-link"
                                            style={{ borderRadius: 50 }}
                                            onClick={() => onChangePage(0)}
                                        >
                                            {`<<`}
                                        </button>
                                    </li>
                                    {rows}
                                    <li
                                        className={
                                            page === total - 1
                                                ? "page-item disabled"
                                                : "page-item"
                                        }
                                    >
                                        <button
                                            className="page-link"
                                            style={{ borderRadius: 50 }}
                                            onClick={() =>
                                                onChangePage(page + 1)
                                            }
                                        >
                                            {`>>`}
                                        </button>
                                    </li>
                                </div>
                            </div>

                            <div className="w-[100px] flex justify-end">
                                <select
                                    className="py-2 pl-2 border border-gray-100 rounded-[6px]"
                                    onChange={(e) => setSize(e.target.value)}
                                    defaultChecked={size}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
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
        </>
    );
};

export default Order;
