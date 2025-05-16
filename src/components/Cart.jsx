import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "antd";
// import 'font-awesome/css/font-awesome.min.css';
import {
    getCartItemByAccountId,
    modifyCartItem,
    removeCartItem,
    isEnoughCartItem,
} from "../api/CartApi";
import { toast } from "react-toastify";
import { useQuery } from "react-query";

const Cart = (props) => {
    const [cart, setCart] = useState([]);
    const history = useHistory();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    const showModal = (item) => {
        console.log(item, "item");
        setItemToRemove(item);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (itemToRemove) {
            removeCartItemHandler(itemToRemove, itemToRemove.quantity);
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        onLoad();
    }, [props.user]);

    const onLoad = () => {
        if (props?.user) {
            getCartItemByAccountId(localStorage.getItem("id")).then((resp) => {
                setCart(
                    resp.data.content.map((item) => ({
                        ...item,
                        checked: false,
                    }))
                );
                props.outStockHandler(resp.data);
            });
        } else {
            setCart(
                props.cartItem.map((item) => ({ ...item, checked: false }))
            );
            props.outStockHandler(props.cartItem);
        }
        props.clearBuyHandler();
    };

    const modifyCartItemHandler = (attr, quantity) => {
        if (quantity < 1) {
            toast.warning("Số lượng không hợp lệ.");
        } else {
            if (props.user) {
                const data = {
                    attributeId: attr,
                    quantity: quantity,
                };

                modifyCartItem(data)
                    .then(() => onLoad())
                    .catch((error) =>
                        toast.warning(error.response.data.message)
                    );
            } else {
                isEnoughCartItem(attr, quantity)
                    .then(() => {
                        const res = cart.map((item) =>
                            item.id === attr
                                ? { ...item, quantity: quantity }
                                : item
                        );
                        const flag = res.filter((item) => item.quantity > 0);
                        setCart(flag);
                        props.cartHandler(flag);
                    })
                    .catch((error) => {
                        const res = cart.map((item) =>
                            item.id === attr ? { ...item, quantity: 1 } : item
                        );
                        const flag = res.filter((item) => item.quantity > 0);
                        setCart(flag);
                        props.cartHandler(flag);
                        toast.warning(error.response.data.message);
                    });
            }
        }
    };

    const addCartItemHandler = (attr, quantity) => {
        if (quantity < 1) {
            toast.warning("Số lượng không hợp lệ.");
        } else {
            if (props.user) {
                const data = {
                    attributeId: attr,
                    quantity: quantity,
                };

                modifyCartItem(data)
                    .then(() => onLoad())
                    .catch((error) =>
                        toast.warning(error.response.data.message)
                    );
            } else {
                isEnoughCartItem(attr, quantity)
                    .then(() => {
                        const res = cart.map((item) =>
                            item.id === attr
                                ? { ...item, quantity: quantity }
                                : item
                        );
                        const flag = res.filter((item) => item.quantity > 0);
                        setCart(flag);
                        props.cartHandler(flag);
                    })
                    .catch((error) => {
                        toast.warning(error.response.data.message);
                    });
            }
        }
    };

    const removeCartItemHandler = (itemToRemove, quantity) => {
        if (props.user) {
            const data = {
                cartId: itemToRemove._id,
                accountId: props.user._id,
                attributeId: itemToRemove.attribute._id,
                quantity: quantity,
            };

            removeCartItem(data)
                .then(() => {
                    // Hiển thị thông báo thành công
                    toast.success("Xóa sản phẩm thành công!");
                    onLoad();
                })
                .catch((error) => toast.warning(error.response.data.message));
        } else {
            const res = cart.filter(
                (item) => item._id !== itemToRemove.attribute._id
            );
            setCart(res);
            props.cartHandler(res);
        }
    };

    const checkOutHandler = () => {
        if (props.buy.length === 0) {
            toast.warning("Bạn vẫn chưa chọn sản phẩm nào để mua.");
        } else {
            for (let j = 0; j < props.buy.length; j++) {
                for (let i = 0; i < cart.length; i++) {
                    if (props.buy[j] == cart[i]._id) {
                        isEnoughCartItem(cart[i]?._id, cart[i]?.quantity)
                            .then((resp) => resp.data)
                            .catch((error) => {
                                toast.warn(error.response.data.message);
                                history.push("/cart");
                            });
                    }
                }
            }
            history.push("/checkout");
        }
    };

    const buyHandler = (e) => {
        const id = e.target.value;
        const index = cart.findIndex((item) => item._id == id);
        const flag = cart[index].checked;
        if (flag) {
            cart[index] = {
                ...cart[index],
                checked: false,
            };
            props.cancelBuyHandler(id);
        } else {
            cart[index] = {
                ...cart[index],
                checked: true,
            };
            props.buyHandler(id);
        }
    };

    return (
        <div className="col-12">
            <div className="container-fluid mb-5 mt-5">
                <div className="mini-card">
                    <h4 className="text-danger !mb-0">Giỏ hàng của bạn</h4>
                </div>
                <div className="">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">Chọn</th>
                                <th scope="col">Ảnh</th>
                                <th scope="col">Tên</th>
                                <th scope="col">Size</th>
                                <th scope="col">Đơn giá</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Thành tiền</th>
                                <th scope="col">Xoá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart?.map((item, index) => (
                                <tr key={item._id}>
                                    <th>
                                        <div className="flex items-center justify-center h-[50px]">
                                            <input
                                                className="form-check-input ml-1"
                                                type="checkbox"
                                                value={item?._id}
                                                id="defaultCheck1"
                                                onClick={buyHandler}
                                            />
                                        </div>
                                    </th>
                                    <th>
                                        <div className="flex items-center justify-center h-[50px]">
                                            <img
                                                className="img-fluid"
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                }}
                                                src={item?.image}
                                                alt=""
                                            />
                                        </div>
                                    </th>
                                    <td>
                                        <div className="flex items-center justify-center h-[50px]">
                                            <h6 className="card-title bolder">
                                                {item?.product?.name}
                                            </h6>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center h-[50px]">
                                            <h6 className="card-title bolder">
                                                {item?.attribute?.size}
                                            </h6>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center h-[50px]">
                                            <h6 className="card-title bolder">
                                                {item?.lastPrice?.toLocaleString()}{" "}
                                                đ
                                            </h6>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center gap-2 h-[50px]">
                                            <button
                                                className="btn btn-outline-dark"
                                                onClick={() =>
                                                    modifyCartItemHandler(
                                                        item?.attribute._id,
                                                        item?.quantity - 1
                                                    )
                                                }
                                                disabled={item?.quantity == 0}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                name="quantity"
                                                className="text-center"
                                                style={{ width: "100px" }}
                                                value={item?.quantity}
                                                onChange={(e) =>
                                                    modifyCartItemHandler(
                                                        item.attribute._id,
                                                        e.target.value
                                                    )
                                                }
                                                min={1}
                                            />
                                            <button
                                                className="btn btn-outline-dark"
                                                onClick={() =>
                                                    addCartItemHandler(
                                                        item.attribute._id,
                                                        item?.quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center h-[50px]">
                                            <h6 className="card-title bolder">
                                                {(
                                                    item?.quantity *
                                                    item?.lastPrice
                                                ).toLocaleString()}{" "}
                                                đ
                                            </h6>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center h-[50px]">
                                            <button
                                                className="border-0 pl-4"
                                                style={{
                                                    backgroundColor: "white",
                                                }}
                                                onClick={() => showModal(item)}
                                            >
                                                <i
                                                    className="fa fa-trash-o text-danger"
                                                    style={{
                                                        fontSize: "24px",
                                                        backgroundColor:
                                                            "transparent",
                                                        margin: "0",
                                                        padding: "0",
                                                    }}
                                                />
                                            </button>
                                        </div>

                                        {/* Modal Confirmation */}
                                        <Modal
                                            title="Xác nhận xóa"
                                            visible={isModalVisible}
                                            onOk={handleOk}
                                            onCancel={handleCancel}
                                            okText="Xác nhận"
                                            cancelText="Hủy"
                                        >
                                            <p>
                                                Bạn có chắc chắn muốn xóa sản
                                                phẩm này khỏi giỏ hàng?
                                            </p>
                                        </Modal>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr className="my-4" />
                    <div className="row container-fluid d-flex justify-content-end">
                        <button
                            className="btn btn-primary mb-3 btn-lg"
                            style={{ width: "145px" }}
                            onClick={checkOutHandler}
                        >
                            Mua hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
