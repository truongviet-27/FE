import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
    loadNotification,
    pushNotification,
    readNotification,
} from "../../../api/NotificationApi";
import user_menu from "../../../assets/JsonData/user_menus.json";
import avt from "../../../static/images/default-avatar-2.png";
import Dropdown from "../dropdown/Dropdown";
import user_image from "../../../static/images/puma.jpg";
import "./topnav.css";

const TopNav = (props) => {
    const [notifications, setNotifications] = useState([]);
    const [key, setKey] = useState("");
    const [curr_user, setCurrUser] = useState({
        display_name: "Tài khoản",
        image: user_image,
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

    console.log(props.user, "user");

    const renderUserToggle = (user) => (
        <div className="topnav__right-user">
            <div className="topnav__right-user__image">
                <img src={avt} alt="avt" />
            </div>
            <div className="topnav__right-user__name">
                {props?.user?.fullName}
            </div>
        </div>
    );

    const renderUserMenu = (item, index) => (
        <Link
            to={item.path}
            key={index}
            onClick={index === 3 && signOutHandler}
        >
            <div className="notification-item">
                <i className={item.icon}></i>
                <span>{item.content}</span>
            </div>
        </Link>
    );

    const signOutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        Cookies.remove("refreshToken");
        toast.success("Tài khoản đã được đăng xuất.");
        props.userHandler(null);
    };

    const searchHandler = (key) => {
        history.push(`/search/${key}`);
    };

    const keyHanlder = (value) => {
        setKey(value);
    };

    return (
        <div className="topnav border-b border-gray-300 !justify-end">
            {/* <div className="topnav__search">
                <input
                    type="text"
                    placeholder="Search here..."
                    onChange={(e) => keyHanlder(e.target.value)}
                />
                <i className="bx bx-search" onClick={searchHandler}></i>
            </div> */}
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
