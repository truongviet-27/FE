import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { NavLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllProvince } from "../api/AddressApi";
import { getCartItemByAccountId } from "../api/CartApi";
import { createOrder } from "../api/OrderApi";
import { getVoucherByCode } from "../api/VoucherApi";
import Spinner from "./spinner/Spinner";
import formatDate from "../utils/convertDate";
import { generatePaymentUrl } from "../api/Payment";

const Checkout = (props) => {
    const [amount, setAmount] = useState();
    const [cart, setCart] = useState([]);
    const [info, setInfo] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();
    const [voucher, setVoucher] = useState("");
    const [flag, setFlag] = useState(false);
    const [sub, setSub] = useState();
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("Thanh toán khi giao hàng(COD)");
    const [showFirst, setShowFirst] = useState(false);
    const [obj, setObj] = useState({});
    const [voucherItem, setVoucherItem] = useState();

    const handleCloseFirst = () => {
        setShowFirst(false);
    };
    const handleShowFirst = (data) => {
        setObj(data);
        setShowFirst(true);
    };
    const history = useHistory();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
    } = useForm();

    useEffect(() => {
        onLoad();
    }, [props.user]);

    const textHandler = (value) => {
        setText(value);
    };

    console.log(getValues(), "getValues");
    const onLoad = () => {
        getAllProvince().then((resp) => setInfo(resp.data));
        if (props.user) {
            getCartItemByAccountId(props.user.userId).then((resp) => {
                setCart(
                    resp.data.content.filter((item) =>
                        props.buy.includes(item._id + "")
                    )
                );
                const result = resp.data.content
                    .filter((item) => props.buy.includes(item._id + ""))
                    .reduce(
                        (price, item) => price + item.lastPrice * item.quantity,
                        0
                    );
                setAmount(result);
            });
            const flag = {
                address: props.user.address,
                name: props.user.fullName,
                phone: props.user.phone,
                email: props.user.email,
                payment: "COD",
            };
            reset(flag);
        } else {
            setCart(
                props.cartItem.filter((item) =>
                    props.buy.includes(item.id + "")
                )
            );
            const result = props.cartItem
                .filter((item) => props.buy.includes(item.id + ""))
                .reduce(
                    (price, item) =>
                        price +
                        (item.price * item.quantity * (100 - item.discount)) /
                            100,
                    0
                );
            setAmount(result);
        }
        props.user ? console.log(props.user) : console.log("");
    };

    const voucherHandler = (value) => {
        setVoucher(value);
    };

    const useVoucherHandler = () => {
        if (flag) {
            toast.warning("Voucher đã được áp dụng.");
        } else {
            getVoucherByCode(voucher)
                .then((resp) => {
                    setAmount(
                        (prevState) =>
                            (prevState * (100 - resp.data.data.discount)) / 100
                    );
                    setFlag(true);
                    toast.success("Áp dụng voucher thành công.");
                    setSub((amount * resp.data.data.discount) / 100);
                    setVoucherItem(resp.data.data);
                })
                .catch((error) => toast.error(error.response.data.message));
        }
    };

    const refreshVoucherHandler = () => {
        setFlag(false);
        setVoucher("");
        setSub("");
        setVoucherItem();
        onLoad();
    };
    const onLoadDistrictHandler = (id) => {
        const resp = info.filter((item) => item.name === id);
        setDistrict(resp[0].districts);
    };

    const onLoadWardHandler = (id) => {
        const resp = district.filter((item) => item.name === id);
        setWard(resp[0].wards);
    };

    const onSubmitHandler = (data) => {
        setLoading(true);
        console.log(data, cart, "data");

        if (voucher) {
            const order = {
                address: `${data.address}, ${data.ward}, ${data.district}, ${data.province}`,
                fullName: data.name,
                phone: data.phone,
                email: data.email,
                note: data.note,
                total: amount,
                isPayment: false,
                payment: data.payment,
                voucherId: voucherItem._id,
                orderDetails: cart.map((item) => ({
                    _id: item._id,
                    quantity: item.quantity,
                    originPrice: item.attribute.price,
                    sellPrice: item.lastPrice,
                    attributeId: item.attribute._id,
                })),
            };

            console.log(order, "order");

            createOrder(order)
                .then((res) => {
                    generatePaymentUrl({ orderId: res.data.data._id })
                        .then(() => {
                            console.log("Redirect trang thanh toán");
                        })
                        .catch((err) => toast.error(err.message));
                })
                .catch(() => {
                    toast.error(
                        "Sản phẩm không tồn tại hoặc số lượng không đủ"
                    );
                    history.push("/cart");
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(true);

            const order = {
                fullName: data.name,
                phone: data.phone,
                address: `${data.address}, ${data.ward}, ${data.district}, ${data.province}`,
                email: data.email,
                total: amount,
                note: data.note,
                isPayment: false,
                payment: data.payment,
                orderDetails: cart.map((item) => ({
                    _id: item._id,
                    quantity: item.quantity,
                    originPrice: item.attribute.price,
                    sellPrice: item.lastPrice,
                    attributeId: item.attribute._id,
                })),
            };

            createOrder(order)
                .then((res) => {
                    generatePaymentUrl({ orderId: res.data.data._id })
                        .then((res) => {
                            window.location.href = res.data.data;
                        })
                        .catch((err) => toast.error(err.message));
                })
                .catch(() => {
                    toast.success(
                        "Sản phẩm không tồn tại hoặc số lượng không đủ"
                    );
                    history.push("/cart");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const totalPrice = useMemo(() => {
        return cart.reduce((acc, cur) => {
            return acc + cur.lastPrice * cur.quantity;
        }, 0);
    }, [cart]); // 🟢 thêm cart vào dependency array

    return (
        <div className="pb-3 container-fluid !mb-20 !px-20">
            <div className="py-3 col-10 offset-1 text-center">
                <h2 className="text-danger">Thông tin mua hàng</h2>
                {loading && <Spinner></Spinner>}
            </div>
            <div className="border rounded-2xl">
                <div className="flex flex-col-reverse lg:flex-row gap-8 xl:gap-14 !px-20 xl:!px-10 2xl:!px-20 !py-10">
                    <div className="lg:w-full xl:w-4/7 2xl:w-5/8">
                        <form
                            className="needs-validation"
                            onSubmit={handleSubmit(handleShowFirst)}
                        >
                            <h4 className="mb-3">Địa chỉ nhận hàng</h4>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label
                                        htmlFor="firstName"
                                        className="form-label"
                                    >
                                        Tỉnh Thành
                                    </label>
                                    <select
                                        className="form-control"
                                        {...register("province", {
                                            required: true,
                                        })}
                                        required
                                        onChange={(e) =>
                                            onLoadDistrictHandler(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option
                                            selected
                                            disabled
                                            hidden
                                        ></option>
                                        {info?.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <label
                                        htmlFor="lastName"
                                        className="form-label"
                                    >
                                        Quận Huyện
                                    </label>
                                    <select
                                        className="form-control"
                                        {...register("district", {
                                            required: true,
                                        })}
                                        required
                                        onChange={(e) =>
                                            onLoadWardHandler(e.target.value)
                                        }
                                    >
                                        <option
                                            selected
                                            disabled
                                            hidden
                                        ></option>
                                        {district?.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-sm-12 mt-2">
                                    <label
                                        htmlFor="lastName"
                                        className="form-label"
                                    >
                                        Phường Xã
                                    </label>
                                    <select
                                        className="form-control"
                                        {...register("ward", {
                                            required: true,
                                        })}
                                        required
                                    >
                                        <option
                                            selected
                                            disabled
                                            hidden
                                        ></option>
                                        {ward?.map((item, index) => (
                                            <option
                                                value={item.name}
                                                key={index}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-12 mt-2">
                                    <label
                                        htmlFor="address"
                                        className="form-label"
                                    >
                                        Địa chỉ
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows={3}
                                        defaultValue={""}
                                        {...register("address", {
                                            required: true,
                                            pattern: /^\s*\S+.*/,
                                        })}
                                    />
                                    {errors.address && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            Địa chỉ không hợp lệ!
                                        </div>
                                    )}
                                </div>

                                <div className="col-sm-6 mt-2">
                                    <label
                                        htmlFor="lastName"
                                        className="form-label"
                                    >
                                        Họ tên
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        {...register("name", {
                                            required: true,
                                            pattern: /^\s*\S+.*/,
                                        })}
                                    />
                                    {errors.name && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            Họ tên không hợp lệ!
                                        </div>
                                    )}
                                </div>
                                <div className="col-sm-6 mt-2">
                                    <label
                                        htmlFor="lastName"
                                        className="form-label"
                                    >
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        {...register("phone", {
                                            required: true,
                                            pattern: /^0[0-9]{9}$/,
                                        })}
                                    />
                                    {errors.phone && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            Số điện thoại không hợp lệ!
                                        </div>
                                    )}
                                </div>
                                <div className="col-sm-12 mt-2">
                                    <label
                                        htmlFor="lastName"
                                        className="form-label"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        {...register("email", {
                                            required: true,
                                            pattern:
                                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        })}
                                    />
                                    {errors.email && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            Email không hợp lệ!
                                        </div>
                                    )}
                                </div>
                                <div className="col-12 mt-2">
                                    <label
                                        htmlFor="address"
                                        className="form-label"
                                    >
                                        Ghi chú
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows={3}
                                        defaultValue={""}
                                        {...register("note", {
                                            required: false,
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <button
                                    className="order-btn btn btn-primary btn-lg mt-4"
                                    type="submit"
                                >
                                    Đặt hàng
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="lg:w-full xl:w-3/7 2xl:w-3/8">
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="flex items-center mb-3 gap-2">
                                    <span className="text-dark">
                                        Giỏ hàng của bạn
                                    </span>
                                    <span className="badge bg-primary rounded-pill">
                                        {cart.length}
                                    </span>
                                </h4>
                                <NavLink
                                    to="/cart"
                                    className={`${
                                        cart.length === 0
                                            ? "mb-2 mr-5 disabled"
                                            : "mb-2 mr-5"
                                    } font-medium`}
                                    exact
                                >
                                    Quay về giỏ hàng
                                </NavLink>
                            </div>
                            <ul className="list-group mb-3">
                                {cart?.map((item, index) => (
                                    <li
                                        className="list-group-item !flex !items-start justify-between"
                                        key={item._id}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <img
                                                    className="w-[50px] h-[50px] border rounded-[6px]"
                                                    src={
                                                        item?.imageUrls[0]?.url
                                                    }
                                                    style={{
                                                        width: "60px",
                                                        height: "70px",
                                                    }}
                                                    alt="ảnh"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="!mr-4">
                                                    <span className="text-[15px] font-medium">
                                                        {item?.product?.name}
                                                    </span>
                                                </div>
                                                <span>
                                                    <span className="text-[15px] font-medium">
                                                        Size:
                                                    </span>{" "}
                                                    {item?.attribute?.size}
                                                </span>
                                                <div className="text-muted flex gap-1 text-[14px]">
                                                    <span>
                                                        {item.lastPrice.toLocaleString()}
                                                    </span>
                                                    <span>x</span>
                                                    <span>{item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-[15px] font-medium">
                                            <span>
                                                {(
                                                    item.lastPrice *
                                                    item.quantity
                                                ).toLocaleString()}
                                            </span>
                                            <span>{"VNĐ"}</span>
                                        </div>
                                    </li>
                                ))}
                                <li className="list-group-item flex bg-light">
                                    <div className="text-success">
                                        <div className="flex justify-between">
                                            <div>
                                                <h6 className="my-2">
                                                    Mã giảm giá
                                                </h6>
                                                <input
                                                    className="form-control my-2"
                                                    value={voucher}
                                                    disabled={flag}
                                                    type="text"
                                                    onChange={(e) =>
                                                        voucherHandler(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            {!!voucherItem && (
                                                <div className="mt-2 text-black">
                                                    <div className="flex justify-between gap-4">
                                                        <span className="font-medium">
                                                            Mã giảm giá:{" "}
                                                        </span>
                                                        <span>
                                                            {voucherItem?.code}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between gap-4">
                                                        <span className="font-medium">
                                                            Giảm giá:
                                                        </span>
                                                        <span>
                                                            {
                                                                voucherItem?.discount
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between gap-4">
                                                        <span className="font-medium">
                                                            Thời hạn:{" "}
                                                        </span>
                                                        <span>
                                                            {formatDate(
                                                                voucherItem?.expireDate
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-3 mt-2 mb-3">
                                            <button
                                                type="button"
                                                className="btn btn-primary mr-3"
                                                onClick={useVoucherHandler}
                                            >
                                                Áp dụng
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={refreshVoucherHandler}
                                            >
                                                Làm mới
                                            </button>
                                        </div>
                                    </div>
                                </li>

                                <li className="list-group-item d-flex justify-content-between font-medium">
                                    <span>Tổng tiền (VNĐ)</span>
                                    <strong>
                                        {amount &&
                                            (
                                                amount + (sub ?? 0)
                                            ).toLocaleString()}
                                    </strong>
                                </li>
                                {sub && (
                                    <li className="list-group-item d-flex justify-content-between font-medium">
                                        <span>Giá giảm (VNĐ)</span>
                                        <strong>
                                            - {sub.toLocaleString()}
                                        </strong>
                                    </li>
                                )}
                                {sub && (
                                    <li className="list-group-item d-flex justify-content-between font-medium">
                                        <span>Thành tiền (VNĐ)</span>
                                        <strong>
                                            {amount && amount.toLocaleString()}
                                        </strong>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="!mt-10">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-dark">
                                    Phương thức thanh toán
                                </span>
                                <span className="badge bg-primary rounded-pill"></span>
                            </h4>
                            <div className="flex flex-col mb-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        className="form-check-input !mt-0"
                                        type="radio"
                                        value="COD"
                                        {...register("payment", {
                                            required: true,
                                        })}
                                        onChange={(e) =>
                                            textHandler(e.target.value)
                                        }
                                    />
                                    <label className="form-check-label">
                                        Thanh toán khi giao hàng(COD) <br />
                                    </label>
                                </div>
                                {text === "COD" && (
                                    <div className="alert alert-dark">
                                        <p>
                                            Bạn được KIỂM TRA hàng và thanh toán
                                            khi nhận được hàng
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        className="form-check-input !mt-0"
                                        type="radio"
                                        value="BANK"
                                        {...register("payment", {
                                            required: true,
                                        })}
                                        onChange={(e) =>
                                            textHandler(e.target.value)
                                        }
                                    />
                                    <label className="form-check-label">
                                        Chuyển khoản qua ngân hàng <br />
                                    </label>
                                </div>
                                {text === "BANK" && (
                                    <img
                                        src={`https://img.vietqr.io/image/ICB-100870483156-compact2.png?amount=${totalPrice}&accountName=${encodeURIComponent(
                                            "NGUYEN TRUONG VIET"
                                        )}&addInfo=${encodeURIComponent(
                                            `TK: ${props.user.username} - SĐT: ${props.user.phone}`
                                        )}`}
                                        alt="QR"
                                        className="!w-[300px] !h-[350px] border mt-1 mb-2 rounded-2xl"
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    className="form-check-input !mt-0"
                                    type="radio"
                                    value="VNPAY"
                                    {...register("payment", { required: true })}
                                    onChange={(e) =>
                                        textHandler(e.target.value)
                                    }
                                />
                                <label className="form-check-label">
                                    Thanh toán qua ví VNPay <br />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showFirst} onHide={handleCloseFirst}>
                <Modal.Header
                    closeButton
                    onHide={() => {
                        setShowFirst(false);
                    }}
                >
                    <Modal.Title style={{ textAlign: "center" }}>
                        Bạn đã chắc chắn chưa?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading && (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p>Đang xử lý đơn hàng...</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => onSubmitHandler(obj)}
                        disabled={loading} // Khi loading, không cho phép bấm nút xác nhận
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCloseFirst}
                        disabled={loading}
                    >
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Checkout;
