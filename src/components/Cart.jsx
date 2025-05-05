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

const Cart = (props) => {
  const [cart, setCart] = useState([]);
  const history = useHistory();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const showModal = (item) => {
    setItemToRemove(item);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (itemToRemove) {
      removeCartItemHandler(itemToRemove.id, itemToRemove.quantity);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = () => {
    if (props.user) {
      getCartItemByAccountId(props.user.id).then((resp) => {
        setCart(resp.data.map((item) => ({ ...item, checked: false })));
        props.outStockHandler(resp.data);
      });
    } else {
      setCart(props.cartItem.map((item) => ({ ...item, checked: false })));
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
          accountId: props.user.id,
          attributeId: attr,
          quantity: quantity,
        };

        modifyCartItem(data)
          .then(() => onLoad())
          .catch((error) => toast.warning(error.response.data.message));
      } else {
        isEnoughCartItem(attr, quantity)
          .then(() => {
            const res = cart.map((item) =>
              item.id === attr ? { ...item, quantity: quantity } : item
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
          accountId: props.user.id,
          attributeId: attr,
          quantity: quantity,
        };

        modifyCartItem(data)
          .then(() => onLoad())
          .catch((error) => toast.warning(error.response.data.message));
      } else {
        isEnoughCartItem(attr, quantity)
          .then(() => {
            const res = cart.map((item) =>
              item.id === attr ? { ...item, quantity: quantity } : item
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

  const removeCartItemHandler = (attr, quantity) => {
    if (props.user) {
      const data = {
        accountId: props.user.id,
        attributeId: attr,
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
      const res = cart.filter((item) => item.id !== attr);
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
          if (props.buy[j] == cart[i].id) {
            isEnoughCartItem(cart[i].id, cart[i].quantity)
              .then((resp) => console.log(resp.data))
              .catch((error) => {
                toast.warn(error.response.data.message)
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
    const index = cart.findIndex((item) => item.id == id);
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
          <h4 className="text-danger">Giỏ hàng của bạn</h4>
        </div>
        <div className="">
          <table className="table table-striped table-bordered">
            <thead>
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
              {cart &&
                cart.map((item, index) => (
                  <tr key={index}>
                    <th>
                      <input
                        className="form-check-input ml-1 mt-5"
                        type="checkbox"
                        value={item.id}
                        id="defaultCheck1"
                        onClick={buyHandler}
                      />
                    </th>
                    <th>
                      <img
                        className="img-fluid"
                        style={{ width: "100px", height: "100px" }}
                        src={item.image}
                        alt=""
                      />
                    </th>
                    <td>
                      <h6 className="card-title mt-5 bolder">{item.name}</h6>
                    </td>
                    <td>
                      <h6 className="card-title mt-5 bolder">{item.size}</h6>
                    </td>
                    <td>
                      <h6 className="card-title mt-5 bolder">
                        {(
                          (item.price * (100 - item.discount)) /
                          100
                        ).toLocaleString()}{" "}
                        đ
                      </h6>
                    </td>
                    <td>
                      <div className="mt-5">
                        <button
                          className="btn btn-outline-dark"
                          onClick={() =>
                            modifyCartItemHandler(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity == 0}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          name="quantity"
                          className="text-center"
                          style={{ width: "40px" }}
                          value={item.quantity}
                          onChange={(e) =>
                            modifyCartItemHandler(item.id, e.target.value)
                          }
                          min={1}
                        />
                        <button
                          className="btn btn-outline-dark"
                          onClick={() =>
                            addCartItemHandler(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <h6 className="card-title mt-5 bolder">
                        {(
                          item.quantity *
                          ((item.price * (100 - item.discount)) / 100)
                        ).toLocaleString()}{" "}
                        đ
                      </h6>
                    </td>
                    {/* <td>
                      <button
                        className="border-0 pl-4"
                        style={{ backgroundColor: "white", backgroundColor: "inherit" }}
                        onClick={() =>
                          removeCartItemHandler(item.id, item.quantity)
                        }
                      >
                        <i
                          className="fa fa-trash-o mt-5 text-danger"
                          style={{
                            fontSize: "24px", backgroundColor: "transparent", margin: "0",
                            padding: "0"
                          }}
                        />
                      </button>
                    </td> */}
                    <td>
                      <button
                        className="border-0 pl-4"
                        style={{ backgroundColor: 'white', backgroundColor: 'inherit' }}
                        onClick={() => showModal(item)}  // Pass the current item to show the modal
                      >
                        <i
                          className="fa fa-trash-o mt-5 text-danger"
                          style={{
                            fontSize: '24px', backgroundColor: 'transparent', margin: '0',
                            padding: '0',
                          }}
                        />
                      </button>

                      {/* Modal Confirmation */}
                      <Modal
                        title="Xác nhận xóa"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Xác nhận"
                        cancelText="Hủy"
                      >
                        <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
                      </Modal>
                    </td>

                  </tr>
                ))}
            </tbody>
          </table>
          <hr className="my-4" />
          <div className="row container-fluid d-flex justify-content-end">
            <div
              className="btn btn-primary mb-3 btn-lg" style={{ width: "145px" }}
              onClick={checkOutHandler}
            >
              Mua hàng
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
