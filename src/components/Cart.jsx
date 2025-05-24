import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import 'font-awesome/css/font-awesome.min.css';
import { toast } from "react-toastify";
import {
    getCartItemByAccountId,
    isEnoughCartItem,
    modifyCartItem,
    modifyCartItemFromNotUserFromDetail,
    removeCartItem,
} from "../api/CartApi";

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

    console.log(props.cartItem, "cartItem");

    const onLoad = () => {
        if (props?.user) {
            if ((props.cartItem ?? []).length > 0) {
                const carts = props.cartItem.map((item) => {
                    return {
                        attributeId: item.attribute._id,
                        quantity: item.quantity,
                        lastPrice: item.lastPrice,
                    };
                });

                console.log(carts, "carts");
                modifyCartItemFromNotUserFromDetail(carts).then(() => {
                    getCartItemByAccountId(localStorage.getItem("id")).then(
                        (resp) => {
                            setCart(
                                resp.data.content.map((item) => ({
                                    ...item,
                                    checked: false,
                                }))
                            );
                            props.outStockHandler(resp.data.content);
                        }
                    );
                });
                return;
            }
            getCartItemByAccountId(localStorage.getItem("id")).then((resp) => {
                setCart(
                    resp.data.content.map((item) => ({
                        ...item,
                        checked: false,
                    }))
                );
                props.outStockHandler(resp.data.content);
            });
        } else {
            setCart(
                props.cartItem?.map((item) => ({ ...item, checked: false }))
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
                    .then((res) => {
                        toast.success(res.data.message);
                        onLoad();
                    })
                    .catch((error) =>
                        toast.warning(error.response.data.message)
                    );
            } else {
                const res = cart.map((item) =>
                    item.attribute._id === attr
                        ? { ...item, quantity: quantity }
                        : item
                );
                const flag = res.filter((item) => item.quantity > 0);
                setCart(flag);
                props.cartHandler(flag);
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
                    .then((res) => {
                        toast.success(res.data.message);
                        onLoad();
                    })
                    .catch((error) =>
                        toast.warning(error.response.data.message)
                    );
            } else {
                const res = cart.map((item) =>
                    item.attribute._id === attr
                        ? { ...item, quantity: quantity }
                        : item
                );
                const attributes = res.filter((item) => item.quantity > 0);
                setCart(attributes);
                props.cartHandler(attributes);
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
                (item) => item.attribute._id !== itemToRemove.attribute._id
            );
            setCart(res);
            props.cartHandler(res);
        }
    };

    const checkOutHandler = () => {
        if (props.user) {
            if (props.buy.length === 0) {
                toast.warning("Bạn vẫn chưa chọn sản phẩm nào để mua.");
            } else {
                for (let j = 0; j < props.buy.length; j++) {
                    for (let i = 0; i < cart.length; i++) {
                        if (props.buy[j] == cart[i]._id) {
                            isEnoughCartItem(cart[i]?.attribute._id)
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
        } else {
            toast.warning("Vui lòng đăng nhập!!!");
        }
    };

    const buyHandler = (e) => {
        const id = e.target.value;
        console.log(id, "xxxxxxxxxxx");
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
                                <th
                                    className="text-center align-middle"
                                    scope="col"
                                >
                                    Chọn
                                </th>
                                <th
                                    className="text-center align-middle"
                                    scope="col"
                                >
                                    Ảnh
                                </th>
                                <th
                                    className="text-center align-middle"
                                    scope="col"
                                >
                                    Tên
                                </th>
                                <th
                                    className="text-center align-middle"
                                    scope="col"
                                >
                                    Size
                                </th>
                                <th
                                    className="text-center align-middle"
                                    scope="col"
                                >
                                    Đơn giá
                                </th>
                                <th
                                    className="text-center align-middle"
                                    scope="col"
                                >
                                    Số lượng
                                </th>
                                <th
                                    className="text-center align-middle"
                                    scope="col"
                                >
                                    Thành tiền
                                </th>
                                <th
                                    className="text-center align-middle"
                                    scope="col"
                                >
                                    Xoá
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart?.map((item, index) => (
                                <tr key={item._id}>
                                    <td className="text-center align-middle font-bold">
                                        <input
                                            className="form-check-input ml-1"
                                            type="checkbox"
                                            value={item?._id}
                                            id="defaultCheck1"
                                            onClick={buyHandler}
                                        />
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        <div
                                            className="flex items-center justify-center h-[80px]"
                                            onClick={() => {
                                                history.push(
                                                    `/product-detail/${item.product._id}`
                                                );
                                            }}
                                        >
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
                                    <td
                                        className="text-center align-middle font-bold hover:!text-blue-600"
                                        onClick={() => {
                                            history.push(
                                                `/product-detail/${item.product._id}`
                                            );
                                        }}
                                    >
                                        {item?.product?.name}
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        {item?.attribute?.size}
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        {item?.lastPrice?.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        đ
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        <div className="flex items-center justify-center gap-2">
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
                                    <td className="text-center align-middle font-bold">
                                        {(
                                            item?.quantity * item?.lastPrice
                                        ).toLocaleString("vi-VN")}
                                        đ
                                    </td>
                                    <td className="text-center align-middle font-bold">
                                        <div className="flex items-center justify-center">
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
