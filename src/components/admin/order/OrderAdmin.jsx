import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getAllOrderAndPagination,
    getAllOrderStatus,
    getAllOrdersByPayment,
    getOrderById,
    getOrderByOrderStatusAndYearAndMonth,
    getOrderDetailByOrderId,
    updateCancel,
    updateProcess,
    updateShip,
    updateSuccess,
} from "../../../api/OrderApi";
import formatDate from "../../../utils/convertDate";
import Badge from "../badge/Badge";
import "../table/table.css";
import { getAllShipments } from "../../../api/Shipment";
import { orderStatus } from "../../../enum/active";

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
    // const [code, setCode] = useState(null);
    const [description, setDescription] = useState(null);
    const [reason, setReason] = useState(null);
    const [shipDate, setShipDate] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("ALL");

    const [size, setSize] = useState(10);

    const shipmentHandler = (value) => {
        setShipment(value);
    };

    // const codeHandler = (value) => {
    //     console.log(value);
    //     setCode(value);
    // };

    const descriptionHandler = (value) => {
        console.log(value);
        setDescription(value);
    };

    const reasonHandler = (value) => {
        console.log(value);
        setReason(value);
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

    const [flagProcess, setFlagProcess] = useState(false);

    const handleCloseFirst = () => {
        setShowFirst(false);
        setFlagProcess(false);
    };
    const handleShowFirst = (orderId, statusCode, paymentCode) => {
        getOrderById(orderId)
            .then((resp) => setTemp(resp.data.data))
            .catch((error) => console.log(error));

        getOrderDetailByOrderId(orderId)
            .then((resp) => setAttribute(resp.data.content))
            .catch((error) => console.log(error));

        setShowFirst(true);
        setObj({
            orderId,
            statusCode,
            paymentCode,
        });
    };

    const handleCloseSecond = () => {
        setShowSecond(false);
        setShipment(null);
        // setCode(null);
        setShipDate(null);
    };
    const handleShowSecond = (orderId, statusCode, paymentCode) => {
        setShowSecond(true);
        setObj({
            orderId,
            statusCode,
            paymentCode,
        });
    };

    const [flagSuccess, setFlagSuccess] = useState(false);

    const handleCloseThird = () => {
        setShowThird(false);
        setFlagSuccess(false);
    };
    const handleShowThird = (orderId, statusCode, paymentCode) => {
        getOrderById(orderId)
            .then((resp) => setTemp(resp.data))
            .catch((error) => console.log(error));
        setShowThird(true);
        setObj({
            orderId,
            statusCode,
            paymentCode,
        });
    };

    const handleCloseFouth = () => {
        setShowFouth(false);
        setReason(null);
        setDescription(null);
    };
    const handleShowFouth = (orderId, statusCode, paymentCode) => {
        setShowFouth(true);
        setObj({
            orderId,
            statusCode,
            paymentCode,
        });
    };
    const [status, setStatus] = useState("ALL");
    const [orderStatuses, setOrderStatuses] = useState([]);
    const [shipments, setShipments] = useState([]);

    const [obj, setObj] = useState({});
    const [total, setTotal] = useState();
    const [page, setPage] = useState(0);
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [temp, setTemp] = useState();
    const [attribute, setAttribute] = useState([]);

    const { register, handleSubmit, setValue, getValues, watch } = useForm({
        defaultValues: {
            status: "ALL",
            year: "",
            month: "",
            from: "",
            to: "",
            payment: "ALL",
        },
    });

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
    }, [
        page,
        size,
        watch("status"),
        watch("payment"),
        watch("from"),
        watch("to"),
    ]);

    const onLoad = () => {
        getAllOrderAndPagination(
            getValues("status"),
            getValues("payment"),
            getValues("from"),
            getValues("to"),
            page,
            size
        )
            .then((res) => {
                setOrders(res.data.content);
                setTotal(res.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });
    };

    useEffect(() => {
        getAllOrderStatus()
            .then((resp) => setOrderStatuses(resp.data.content))
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });
    }, []);

    useEffect(() => {
        getAllShipments()
            .then((resp) => setShipments(resp.data.content))
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });
    }, []);

    const updateStatusHandlerFirst = (orderId, statusCode, paymentCode) => {
        handleShowFirst(orderId, statusCode, paymentCode);
    };

    const updateStatusHandlerSecond = (orderId, statusCode, paymentCode) => {
        handleShowSecond(orderId, statusCode, paymentCode);
    };

    const updateStatusHandlerThird = (orderId, statusCode, paymentCode) => {
        handleShowThird(orderId, statusCode, paymentCode);
    };

    const updateStatusHandlerFouth = (orderId, statusCode, paymentCode) => {
        handleShowFouth(orderId, statusCode, paymentCode);
    };

    const confirmUpdateProcess = () => {
        const data = {
            id: obj.orderId,
            status: obj.statusCode,
            shipment: "",
            payment: obj.paymentCode,
            // code: code,
            description:
                reason && description ? `${reason} - ${description}` : "",
            shipDate: shipDate,
        };

        updateProcess(data)
            .then(() => {
                setPage(0);
                getAllOrderAndPagination(
                    getValues("status"),
                    getValues("payment"),
                    getValues("from"),
                    getValues("to"),
                    page,
                    size
                )
                    .then((res) => {
                        setOrders(res.data.content);
                        setTotal(res.data.totalPages);
                    })
                    .catch((error) => {
                        console.log(error);
                        toast.error(error.response.data.message);
                    });
                toast.success("Cập nhật thành công.");
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });

        setFlagProcess(false);
        setShowFirst(false);
    };

    const confirmUpdateShip = () => {
        const data = {
            id: obj.orderId,
            status: obj.statusCode,
            shipment: shipment,
            // code: code,
            description:
                reason && description ? `${reason} - ${description}` : "",
            shipDate: shipDate,
        };

        updateShip(data)
            .then(() => {
                setPage(0);
                getAllOrderAndPagination(
                    getValues("status"),
                    getValues("payment"),
                    getValues("from"),
                    getValues("to"),
                    page,
                    size
                )
                    .then((res) => {
                        setOrders(res.data.content);
                        setTotal(res.data.totalPages);
                    })
                    .catch((error) => {
                        console.log(error);
                        toast.error(error.response.data.message);
                    });
                toast.success("Cập nhật thành công.");
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });
        setShipment(null);
        // setCode(null);
        setShipDate(null);
        setShowSecond(false);
    };

    const confirmUpdateSuccess = () => {
        const data = {
            id: obj.orderId,
            status: obj.statusId,
            shipment: shipment,
            // code: code,
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
                    .catch((error) => {
                        console.log(error);
                        toast.error(error.response.data.message);
                    });
                toast.success("Cập nhật thành công.");
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });

        setFlagSuccess(null);
        setShowThird(false);
    };

    const confirmUpdateCancel = () => {
        const data = {
            id: obj.orderId,
            status: obj.statusCode,
            shipment: null,
            // code: code,
            description: `${reason} - ${description}`,
            shipDate: null,
        };

        updateCancel(data)
            .then(() => {
                setPage(0);
                getAllOrderAndPagination(
                    getValues("status"),
                    getValues("payment"),
                    getValues("from"),
                    getValues("to"),
                    page,
                    size
                )
                    .then((res) => {
                        setOrders(res.data.content);
                        setTotal(res.data.totalPages);
                    })
                    .catch((error) => {
                        console.log(error);
                        toast.error(error.response.data.message);
                    });
                toast.success("Cập nhật thành công.");
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });

        setReason(null);
        setDescription(null);
        setShowFouth(false);
    };

    const getAllOrderByStatus = (value) => {
        setStatus(value);
        setPage(0);
        setYear("");
        setMonth("");
        getAllOrderAndPagination(value, paymentMethod, page, size)
            .then((res) => {
                setOrders(res.data.content);
                setTotal(res.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });
    };

    const getAllOrdersByPaymentStatus = (paymentMethod) => {
        setPaymentMethod(paymentMethod);
        console.log(paymentMethod);
        setPage(0);
        const sanitizedPaymentMethod =
            paymentMethod === "null" ? null : paymentMethod;
        getAllOrdersByPayment(sanitizedPaymentMethod, 0, 20)
            .then((res) => {
                console.log(res);
                if (res.data) {
                    setOrders(res.data.content || []);
                    setTotal(res.data.totalPages || 0);
                }
            })
            .catch((error) => {
                console.error("Lỗi khi tải dữ liệu:", error);
            });
    };
    // const getAllOrderByOrderStatusAndYearAndMonth = (value) => {
    //     setMonth(value);
    //     setFrom("");
    //     setTo("");
    //     getOrderByOrderStatusAndYearAndMonth(status, year, value, page, size)
    //         .then((res) => {
    //             setOrders(res.data.content);
    //             setTotal(res.data.totalPages);
    //         })
    //         .catch((error) => console.log(error.response.data.message));
    // };

    useEffect(() => {
        if (
            (getValues("year") &&
                getValues("status") &&
                getValues("payment")) ||
            (getValues("month") && getValues("status") && getValues("payment"))
        ) {
            getOrderByOrderStatusAndYearAndMonth(
                getValues("status"),
                getValues("payment"),
                getValues("year"),
                getValues("month"),
                page,
                size
            )
                .then((res) => {
                    setOrders(res.data.content);
                    setTotal(res.data.totalPages);
                })
                .catch((error) => toast.error(error.response.data.message));
        }
    }, [
        page,
        size,
        watch("year"),
        watch("month"),
        watch("status"),
        watch("payment"),
    ]);

    const changeYearHandler = (value) => {
        setYear(value);
    };

    const searchHandler = handleSubmit((data) => {
        // if (from.length === 0 || to.length === 0) {
        //   toast.warning("Chọn ngày cần tìm kiếm.");
        // } else {
        // if (from > to) {
        //     toast.warning("Chọn ngày tìm kiếm không hợp lệ.");
        // } else {
        //     let a = from.split("-");
        //     let strFrom = a[2] + "-" + a[1] + "-" + a[0];
        //     let b = to.split("-");
        //     let strTo = b[2] + "-" + b[1] + "-" + b[0];
        //     console.log(strFrom + " " + strTo);
        //     getOrderByOrderStatusBetweenDate(status, strFrom, strTo, page, 8)
        //         .then((res) => {
        //             setOrders(res.data.content);
        //             setTotal(res.data.totalPages);
        //         })
        //         .catch((error) => console.log(error.response.data.message));
        // }
        // }

        console.log(data, "data");
    });

    const flagProcessHandler = (e) => {
        const { checked } = e.target;
        setFlagProcess(checked);
    };

    const flagSuccessHandler = (e) => {
        const { checked } = e.target;
        setFlagSuccess(checked);
    };

    return (
        <>
            <div className="card flex flex-col justify-between !mx-[25px] overflow-y-hidden">
                <form onSubmit={searchHandler}>
                    <div className="card__header">
                        <h3>Đơn hàng</h3>
                    </div>
                    <div className="mb-5">
                        <div className="row">
                            <div className="col-sm-4 mt-2">
                                <select
                                    className="form-control"
                                    {...register("status")}
                                >
                                    <option value="ALL">Tất cả</option>
                                    {orderStatuses?.map((item) => (
                                        <option
                                            key={item._id}
                                            value={item.code}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-4 mt-2">
                                <select
                                    className="form-control"
                                    {...register("year")}
                                >
                                    <option value="">Chọn năm</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                </select>
                            </div>
                            <div className="col-sm-4 mt-2">
                                <select
                                    className="form-control"
                                    {...register("month")}
                                >
                                    <option value="">Chọn tháng</option>
                                    {months?.map((item, index) => (
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
                                    className="border w-full !rounded-[6px] !text-[15px]"
                                    {...register("from")}
                                />
                            </div>

                            <div className="col-sm-4 mt-2">
                                <input
                                    type="date"
                                    name=""
                                    id=""
                                    className="border w-full !rounded-[6px] !text-[15px]"
                                    {...register("to")}
                                />
                            </div>
                            <div className="col-sm-4 mt-2">
                                <select
                                    className="form-control"
                                    {...register("payment")}
                                >
                                    <option value="ALL">Tất cả</option>
                                    <option value="COD">
                                        Thanh toán khi giao hàng (COD)
                                    </option>
                                    <option value="BANK">
                                        Chuyển khoản qua ngân hàng
                                    </option>
                                    <option value="VNAPY">
                                        Chuyển khoản qua VNPay
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="card__body">
                        {orders && (
                            <div>
                                <div className="table-wrapper">
                                    <table className="table table-striped table-bordered table-hover">
                                        <thead className="thead-dark">
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
                                                    Ngày mua
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="text-center align-middle"
                                                >
                                                    Hình thức
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="text-center align-middle"
                                                >
                                                    Thanh toán
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="text-center align-middle"
                                                >
                                                    Tổng tiền
                                                </th>
                                                {paymentMethod !== "VNPAY" && (
                                                    <th
                                                        scope="col"
                                                        className="text-center align-middle"
                                                    >
                                                        <Badge
                                                            type={
                                                                orderStatus[
                                                                    "PENDING_CONFIRM"
                                                                ]
                                                            }
                                                            content={
                                                                "Chờ xác nhận"
                                                            }
                                                        />
                                                    </th>
                                                )}
                                                <th
                                                    scope="col"
                                                    className="text-center align-middle"
                                                >
                                                    <Badge
                                                        type={
                                                            orderStatus[
                                                                "PROCESSING"
                                                            ]
                                                        }
                                                        content={"Đang xử lí"}
                                                    />
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="text-center align-middle"
                                                >
                                                    <Badge
                                                        type={
                                                            orderStatus[
                                                                "SHIPPING"
                                                            ]
                                                        }
                                                        content={
                                                            "Đang vận chuyển"
                                                        }
                                                    />
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="text-center align-middle"
                                                >
                                                    <Badge
                                                        type={
                                                            orderStatus[
                                                                "DELIVERED"
                                                            ]
                                                        }
                                                        content={"Đã giao"}
                                                    />
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="text-center align-middle"
                                                >
                                                    <Badge
                                                        type={
                                                            orderStatus[
                                                                "CANCELLED"
                                                            ]
                                                        }
                                                        content={"Hủy"}
                                                    />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders
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
                                                ?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td
                                                            className="text-center align-middle font-bold"
                                                            scope="row"
                                                        >
                                                            <NavLink
                                                                to={`/admin/detail-order/${item._id}`}
                                                                exact
                                                            >
                                                                {index +
                                                                    1 +
                                                                    page * size}
                                                            </NavLink>
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            {formatDate(
                                                                item.createdAt,
                                                                true
                                                            )}
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            {item.payment
                                                                ? item.payment
                                                                : "Chưa chọn phương thức thanh toán"}
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <Badge
                                                                type={
                                                                    pendingStatus[
                                                                        item
                                                                            .isPending
                                                                    ]
                                                                }
                                                                content={
                                                                    item.isPending
                                                                        ? "Đã thanh toán"
                                                                        : "Chưa thanh toán"
                                                                }
                                                            />
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            {item.total.toLocaleString()}{" "}
                                                            ₫
                                                        </td>
                                                        {
                                                            <td className="text-center align-middle">
                                                                {item.payment !==
                                                                    "VNPAY" && (
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name={
                                                                            index
                                                                        }
                                                                        checked={
                                                                            item
                                                                                .orderStatus
                                                                                .code ==
                                                                            "PENDING_CONFIRM"
                                                                        }
                                                                        value="COD"
                                                                    />
                                                                )}
                                                            </td>
                                                        }
                                                        <td className="text-center align-middle">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name={index}
                                                                checked={
                                                                    item
                                                                        .orderStatus
                                                                        .code ===
                                                                    "PROCESSING"
                                                                }
                                                                value="PROCESSING"
                                                                onChange={(e) =>
                                                                    updateStatusHandlerFirst(
                                                                        item._id,
                                                                        e.target
                                                                            .value,
                                                                        item.payment
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name={index}
                                                                checked={
                                                                    item
                                                                        .orderStatus
                                                                        .code ===
                                                                    "SHIPPING"
                                                                }
                                                                value="SHIPPING"
                                                                onChange={(e) =>
                                                                    updateStatusHandlerSecond(
                                                                        item._id,
                                                                        e.target
                                                                            .value,
                                                                        item.payment
                                                                    )
                                                                }
                                                                disabled={
                                                                    item
                                                                        .orderStatus
                                                                        .code !==
                                                                        "PROCESSING" &&
                                                                    item
                                                                        .orderStatus
                                                                        .code !==
                                                                        "SHIPPING"
                                                                }
                                                            />
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name={index}
                                                                checked={
                                                                    item
                                                                        .orderStatus
                                                                        .code ===
                                                                    "DELIVERED"
                                                                }
                                                                value="DELIVERED"
                                                                onChange={(e) =>
                                                                    updateStatusHandlerThird(
                                                                        item._id,
                                                                        e.target
                                                                            .value,
                                                                        item.payment
                                                                    )
                                                                }
                                                                disabled={
                                                                    item
                                                                        .orderStatus
                                                                        .code !==
                                                                        "SHIPPING" &&
                                                                    item
                                                                        .orderStatus
                                                                        .code !==
                                                                        "DELIVERED"
                                                                }
                                                            />
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name={index}
                                                                checked={
                                                                    item
                                                                        .orderStatus
                                                                        .code ===
                                                                    "CANCELLED"
                                                                }
                                                                value="CANCELLED"
                                                                onChange={(e) =>
                                                                    updateStatusHandlerFouth(
                                                                        item._id,
                                                                        e.target
                                                                            .value,
                                                                        item.payment
                                                                    )
                                                                }
                                                                disabled={
                                                                    item
                                                                        .orderStatus
                                                                        .code ===
                                                                    "DELIVERED"
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                <nav
                    aria-label="Page navigation"
                    className="flex items-center justify-between mt-3"
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
                                    onClick={() => onChangePage(page + 1)}
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
                            value={size}
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
            <Modal show={showFirst} onHide={handleCloseFirst}>
                <Modal.Header>
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
                            <span>{temp?.fullName}</span>
                        </div>
                        <div className="flex mb-3">
                            <span className="font-bold min-w-[130px]">
                                Email:
                            </span>
                            <span>{temp?.email}</span>
                        </div>
                        <div className="flex mb-3">
                            <span className="font-bold min-w-[130px]">
                                Số điện thoại:
                            </span>
                            <span>{temp?.phone}</span>
                        </div>
                        <div className="flex mb-3">
                            <span className="font-bold min-w-[130px]">
                                Địa chỉ nhận hàng:
                            </span>
                            <span>{temp?.address}</span>
                        </div>
                        <p className="font-bold">Sản phẩm mua:</p>
                        <div className="flex flex-col gap-2 !ml-3">
                            {attribute?.map((item, index) => (
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
                        <div className="flex mb-3 mt-3">
                            <span className="font-bold min-w-[90px]">
                                Tổng tiền:
                            </span>
                            <span>{temp?.total?.toLocaleString()} VNĐ</span>
                        </div>
                    </Alert>
                    <Form.Check
                        type="checkbox"
                        label="Đã xác nhận đơn hàng."
                        defaultChecked={flagProcess}
                        onChange={(e) => flagProcessHandler(e)}
                    />
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
                            Tổng tiền đơn hàng:{" "}
                            {temp && temp.total.toLocaleString()} đ
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
                            style={{ height: 40, marginBottom: 20 }}
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
