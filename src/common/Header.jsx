import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Dropdown from "../components/admin/dropdown/Dropdown";
import "../static/css/style.css";
import avt from "../static/images/default-avatar-2.png";
import logo from "../static/images/logo-5.jpg";
import user_image from "../static/images/puma.jpg";

const user_menu = [
    {
        icon: "bx bx-user",
        content: "Tài khoản",
        url: "/profile",
    },
    {
        icon: "bx bx-log-out-circle bx-rotate-180",
        content: "Đăng xuất",
        url: "/",
    },
];
// const token = localStorage.getItem("token");

const not_menu = [
    {
        icon: "bx bx-user",
        content: "Đăng nhập",
        url: "/sign-in",
    },
    {
        icon: "bx bx-cog",
        content: "Đăng kí",
        url: "/register",
    },
];

const Header = (props) => {
    const history = useHistory();

    const submitHandler = (e) => {
        e.preventDefault();
        const keyword = e.target.keyword.value.trim();
        if (keyword) {
            // eslint-disable-next-line react/prop-types
            props.searchHandler(keyword);
            history.push("/search-page");
        }
    };

    // const [user, setUser] = useState(null);
    const { user } = props;
    const [curr_user, setCurrUser] = useState({
        display_name: "Tài khoản",
        image: user_image,
    });

    useEffect(() => {
        // const storedUser = JSON.parse(localStorage.getItem("user"));
        // console.log(storedUser);
        if (props.user) {
            setCurrUser({
                display_name: user.fullName || "Tài khoản",
                image: user.image || user_image,
            });
        } else {
            setCurrUser({
                display_name: "Tài khoản",
                image: user_image,
            });
        }
    }, []);

    const signOutHandler = () => {
        props.refresh(false);
        toast.success("Tài khoản đã được đăng xuất.");
        localStorage.removeItem("token");
        setCurrUser({
            display_name: "Tài khoản",
            image: user_image,
        });
        props.userHandler(null);
    };

    return (
        <div className="mini-card fixed z-99 w-full !p-0 !px-10 !rounded-[0px]">
            <nav className="navbar navbar-expand-md !p-0">
                <div className="navbar-brand">
                    <img
                        src={logo}
                        className="!w-[80px] !h-[80px]"
                        alt="logo"
                    />
                </div>
                <div className="flex items-center flex-1">
                    <ul className="navbar-nav justify-center flex-2">
                        <li
                            className={`nav-item mr-2 mini-item text-[14px]${
                                props.header === 1 ? "active" : ""
                            }`}
                        >
                            <NavLink className="nav-link" to="/" exact>
                                Trang chủ
                            </NavLink>
                        </li>
                        <li
                            className={`nav-item mr-2 mini-item text-[14px]${
                                // eslint-disable-next-line react/prop-types
                                props.header === 2 ? "active" : ""
                            }`}
                        >
                            <NavLink className="nav-link" to="/store" exact>
                                Sản phẩm
                            </NavLink>
                        </li>
                        <li
                            className={`cart nav-item mr-2 mini-item text-[14px]${
                                // eslint-disable-next-line react/prop-types
                                props.header === 3 ? "active" : ""
                            }`}
                        >
                            <NavLink className="nav-link" to="/cart" exact>
                                Giỏ hàng
                            </NavLink>
                        </li>
                        {props.user && (
                            <li
                                className={`order nav-item mr-2 mini-item text-[14px]${
                                    // eslint-disable-next-line react/prop-types
                                    props.header === 5 ? "active" : ""
                                }`}
                            >
                                <NavLink className="nav-link" to="/order" exact>
                                    Đơn hàng
                                </NavLink>
                            </li>
                        )}
                        <li
                            className={`nav-item mr-2 mini-item text-[14px]${
                                // eslint-disable-next-line react/prop-types
                                props.header === 4 ? "active" : ""
                            }`}
                        >
                            <NavLink className="nav-link" to="/blog" exact>
                                Chính sách
                            </NavLink>
                        </li>
                        <li
                            className={`nav-item mr-2 mini-item text-[14px]${
                                // eslint-disable-next-line react/prop-types
                                props.header === 4 ? "active" : ""
                            }`}
                        >
                            <NavLink className="nav-link" to="/wish-list" exact>
                                Yêu thích
                            </NavLink>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center flex-1 justify-between">
                        {/* Tìm kiếm */}
                        <form
                            className="form-inline d-flex my-2 my-lg-0 mr-3"
                            onSubmit={submitHandler}
                        >
                            <input
                                className="form-control mr-sm-2"
                                type="search"
                                aria-label="Search"
                                name="keyword"
                            />
                            <button type="submit">
                                <i
                                    className="fa fa-search ml-1"
                                    aria-hidden="true"
                                    style={{ fontSize: "12px" }}
                                ></i>
                            </button>
                        </form>

                        {/* Dropdown Tên Tài Khoản */}
                        <Dropdown
                            customToggle={() => (
                                <div className="topnav__right-user flex flex-wrap justify-center">
                                    <div className="topnav__right-user__image !mr-0">
                                        <img src={avt} alt="user avatar" />
                                    </div>
                                    <div className="topnav__right-user__name">
                                        {user?.fullName}
                                    </div>
                                </div>
                            )}
                            contentData={user ? user_menu : not_menu}
                            renderItems={(item, index) => (
                                <NavLink
                                    to={item?.url}
                                    key={index}
                                    exact
                                    onClick={
                                        item.url === "/" ? signOutHandler : null
                                    }
                                >
                                    <div className="notification-item">
                                        <i className={item?.icon}></i>
                                        <span>{item?.content}</span>
                                    </div>
                                </NavLink>
                            )}
                        />
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;
