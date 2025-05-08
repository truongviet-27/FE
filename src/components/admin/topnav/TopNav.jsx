import React, { useState, useEffect } from "react";
import "./topnav.css";
import Dropdown from "../dropdown/Dropdown";
import avt from "../../../static/images/default-avatar-2.png";
import { Link, NavLink, useHistory } from "react-router-dom";

import user_menu from "../../../assets/JsonData/user_menus.json";
import {
    loadNotification,
    readNotification,
    pushNotification,
} from "../../../api/NotificationApi";
import { toast } from "react-toastify";

const TopNav = (props) => {
    const [notifications, setNotifications] = useState([]);
    const [key, setKey] = useState("");
    const [user, setUser] = useState(null);
    const [curr_user, setCurrUser] = useState({
        display_name: "Tài khoản",
        // image: user_image,
    });
    const history = useHistory();
    const renderNotificationItem = (item, index) => (
        <NavLink
            to={
                item.type == 3
                    ? `/product-detail/${item.product.id}`
                    : `/admin/search/${item.order.id}`
            }
            exact
            key={index}
            onClick={() => readHandler(item.id)}
        >
            <div className="notification-item">
                <i className="bx bx-package"></i>
                <span
                    className={item.type === 1 ? "text-primary" : "text-danger"}
                >
                    {item.content}
                </span>
            </div>
        </NavLink>
    );

    const loadData = async () => {
        await loadNotification()
            .then((resp) => setNotifications(resp.data))
            .catch((error) => console.log(error));

        await pushNotification()
            .then((resp) => {
                resp.data.map((item) =>
                    item.type == 1
                        ? toast.info(item.content)
                        : toast.warning(item.content)
                );
            })
            .catch((error) => console.log(error));
    };
    useEffect(() => {
        window.setInterval(loadData, 10000);
    }, []);
    const readHandler = (id) => {
        readNotification(id)
            .then(() => console.log(id))
            .catch((error) => console.log(error));
    };
    const renderUserToggle = (user) => (
        <div className="topnav__right-user">
            <div className="topnav__right-user__image">
                <img src={avt} alt="avt" />
            </div>
            <div className="topnav__right-user__name">{user.display_name}</div>
        </div>
    );

    // const loadData = async () => {
    //   await loadNotification()
    //     .then((resp) => setNotifications(resp.data))
    //     .catch((error) => console.log(error));

    //   await pushNotification()
    //     .then((resp) => {
    //       resp.data.map((item) => (
    //         item.type == 1 ? toast.success(item.content) : toast.warning(item.content)
    //       ))
    //     })
    //     .catch((error) => console.log(error));
    // };

    // useEffect(() => {
    //   window.setInterval(loadData, 1000);
    // }, []);

    const renderUserMenu = (item, index) => (
        <Link to={"/sign-in"} key={index} onClick={signOutHandler}>
            <div className="notification-item">
                <i className={item.icon}></i>
                <span>{item.content}</span>
            </div>
        </Link>
    );

    const signOutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        props.userHandler(null);
        history.push("/sign-in");
    };

    // const readHandler = (id) => {
    //   readNotification(id)
    //     .then(() => console.log(id))
    //     .catch((error) => console.log(error));
    // }
    // const curr_user = {
    //   display_name: props.user.fullName,
    //   image: user_image,
    // };
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        console.log(storedUser);
        if (storedUser) {
            console.log("TEN" + storedUser.display_name);
            setUser(storedUser); // Cập nhật trạng thái `user` một lần.
            props.userHandler(storedUser);
            setCurrUser({
                display_name: storedUser.fullName || "Tài khoản",
                // image: storedUser.image || user_image,
            });
        }
    }, []); // Chỉ chạy một lần khi component được mount.

    const searchHandler = (key) => {
        history.push(`/search/${key}`);
    };

    const keyHanlder = (value) => {
        setKey(value);
    };

    return (
        <div className="topnav border-b border-gray-300">
            <div className="topnav__search">
                <input
                    type="text"
                    placeholder="Search here..."
                    onChange={(e) => keyHanlder(e.target.value)}
                />
                <i className="bx bx-search"></i>
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    {/* dropdown here */}
                    <Dropdown
                        customToggle={() => renderUserToggle(curr_user)}
                        contentData={user_menu}
                        renderItems={(item, index) =>
                            renderUserMenu(item, index)
                        }
                    />
                </div>
                <div className="topnav__right-item">
                    <Dropdown
                        icon="bx bx-bell"
                        badge={notifications.length}
                        contentData={notifications}
                        renderItems={(item, index) =>
                            renderNotificationItem(item, index)
                        }
                    />
                    {/* dropdown here */}
                </div>
            </div>
        </div>
    );
};

export default TopNav;
