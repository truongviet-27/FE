import React, { useEffect } from "react";
import "../assets/boxicons-2.0.7/css/boxicons.min.css";
import "../assets/css/grid.css";
import "../assets/css/index.css";
import { ToastContainer } from "react-toastify";
import { Switch, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Header from "../common/Header";
import Footer from "../common/Footer";
import SignIn from "../authen/SignIn";
import Search from "../components/Search";
import ForgotPassword from "../authen/ForgotPassword";
import Register from "../authen/Register";
import Profile from "../authen/Profile";
import Home from "../components/Home";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import ProductDetail from "../components/ProductDetail";
import Product from "../components/Product";
import Blog from "../components/blog/Blog";
import OrderDetail from "../components/OrderDetail";
import Order from "../components/Order";
import ChangePassword from "../authen/ChangePassword";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import DashboardAdmin from "../components/admin/dashboard/DashboardAdmin";
import ProductCreate from "../components/admin/product/ProductCreate";
import Sidebar from "../components/admin/sidebar/SidebarAdmin";
import TopNav from "../components/admin/topnav/TopNav";
import OrderAdmin from "../components/admin/order/OrderAdmin";
import Category from "../components/admin/category/Category";
import NewCategory from "../components/admin/category/NewCategory";
import Sale from "../components/admin/sale/Sale";
import NewSale from "../components/admin/sale/NewSale";
import Voucher from "../components/admin/voucher/Voucher";
import NewVoucher from "../components/admin/voucher/NewVoucher";
import Brand from "../components/admin/brand/Brand";
import NewBrand from "../components/admin/brand/NewBrand";
import OrderForm from "../components/admin/order/OrderForm";
import OrderDetailAdmin from "../components/admin/order/OrderDetailAdmin";
import EditProduct from "../components/admin/product/EditProduct";
import EditBrand from "../components/admin/brand/EditBrand";
import EditSale from "../components/admin/sale/EditSale";
import EditCategory from "../components/admin/category/EditCategory";
import EditVoucher from "../components/admin/voucher/EditVoucher";
import ReportMonth from "../components/admin/report/ReportMonth";
import ReportProduct from "../components/admin/report/ReportProduct";
import OrderMonth from "../components/admin/report/OrderMonth";
import OrderProduct from "../components/admin/report/OrderProduct";
import Detail from "../components/admin/product/Detail";
import SearchOrder from "../components/admin/order/SearchOrder";
import Error from "../components/admin/error/Error";
import ProductAdmin from "../components/admin/product/ProductAdmin";
import { styled } from "@mui/material";
import WishList from "../components/WishList";
import Account from "../components/admin/account/Account";
import NewAccount from "../components/admin/account/NewAccount";
import EditAccount from "../components/admin/account/EditAccount";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import ChatAI from "../component/ChatAI";

const UserLayout = () => {
    const [user, setUser] = useState(null);
    const [temp, setTemp] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [cartItem, setCartItem] = useState([]);
    const [outStock, setOutStock] = useState([]);
    const [buy, setBuy] = useState([]);
    const [size, setSize] = useState("");
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    const [year, setYear] = useState();

    const history = useHistory();

    const yearHandler = (value) => {
        setYear(value);
    };

    if (isAdminRoute) {
        if (user.role !== "ADMIN") {
            history.push("/admin/login");
        }
    }

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        console.log(savedUser);
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const userHandler = (user) => {
        setUser(user);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    };

    const refresh = (data) => {
        setTemp(data);
    };
    const searchHandler = (keyword) => {
        setKeyword(keyword);
    };

    const addHandler = (data) => {
        const res = cartItem.find((item) => item.id === data.id);
        if (res) {
            setCartItem(
                cartItem.map((item) =>
                    item.id === data.id
                        ? { ...res, quantity: res.quantity + data.quantity }
                        : item
                )
            );
        } else {
            setCartItem([...cartItem, data]);
        }
    };

    //cart
    const cartHandler = (data) => {
        setCartItem(data);
    };
    const outStockHandler = (data) => {
        setOutStock(data);
    };
    const buyHandler = (id) => {
        setBuy([...buy, id]);
    };
    const cancelBuyHandler = (id) => {
        const res = buy.filter((item) => item != id);
        setBuy(res);
    };
    const clearBuyHandler = () => {
        setBuy([]);
    };

    //checkout
    const clearHandler = () => {
        const res = cartItem.filter((item) => !buy.includes(item.id + ""));
        setCartItem(res);
    };

    const setCartItemHandler = (data) => {
        setCartItem(data);
    };

    return (
        // <div className={`${isAdminRoute ? "flex" : ""} col-10 offset-1`}>
        <div className={`${isAdminRoute ? "flex" : ""}`}>
            {!isAdminRoute && (
                <Header
                    className="header-content"
                    searchHandler={searchHandler}
                    user={user}
                    userHandler={userHandler}
                    refresh={refresh}
                />
            )}
            {isAdminRoute && <Sidebar user={user} />}
            <div className={`${isAdminRoute ? "flex-1" : ""} `}>
                {isAdminRoute && (
                    <TopNav user={user} userHandler={userHandler} />
                )}
                {/* <div className={`${isAdminRoute ? "content-wrapper" : ""} `}> */}
                <div className={`${isAdminRoute ? "!w-full" : ""} `}>
                    <Switch>
                        <Route path="/" exact>
                            <Home user={user}></Home>
                        </Route>

                        <Route path="/store" exact>
                            <Product user={user}></Product>
                        </Route>

                        <Route path="/sign-in" exact>
                            <SignIn userHandler={userHandler}></SignIn>
                        </Route>
                        <Route path="/change-password" exact>
                            <ChangePassword
                                userHandler={userHandler}
                            ></ChangePassword>
                        </Route>

                        <Route path="/wish-list" exact>
                            <WishList></WishList>
                        </Route>

                        <Route path="/register" exact>
                            <Register></Register>
                        </Route>

                        <Route path="/forgot-password" exact>
                            <ForgotPassword></ForgotPassword>
                        </Route>

                        <Route path="/profile" exact>
                            <Profile
                                user={user}
                                refresh={refresh}
                                userHandler={userHandler}
                            ></Profile>
                        </Route>

                        <Route path={`/product-detail/:id`} exact>
                            <ProductDetail
                                user={user}
                                addHandler={addHandler}
                            ></ProductDetail>
                        </Route>

                        <Route path="/search-page" exact>
                            <Search keyword={keyword} user={user}></Search>
                        </Route>

                        <Route path="/cart" exact>
                            <Cart
                                outStockHandler={outStockHandler}
                                buyHandler={buyHandler}
                                cancelBuyHandler={cancelBuyHandler}
                                clearBuyHandler={clearBuyHandler}
                                buy={buy}
                                user={user}
                                cartItem={cartItem}
                                cartHandler={cartHandler}
                            ></Cart>
                        </Route>

                        <Route path="/checkout" exact>
                            <Checkout
                                temp={temp}
                                buy={buy}
                                outStockHandler={outStockHandler}
                                user={user}
                                cartItem={cartItem}
                                clearHandler={clearHandler}
                                setCartItemHandler={setCartItemHandler}
                            ></Checkout>
                        </Route>
                        <Route path="/order/detail/:id" exact>
                            <OrderDetail user={user}></OrderDetail>
                        </Route>
                        <Route path="/order" exact>
                            <Order user={user}></Order>
                        </Route>
                        <Route path="/blog" exact>
                            <Blog></Blog>
                        </Route>
                        <Route path="/admin/dashboard" exact>
                            <DashboardAdmin className="dashboard-content"></DashboardAdmin>
                        </Route>
                        <Route path="/admin/account" exact>
                            <Account></Account>
                        </Route>

                        <Route path="/admin/product" exact>
                            <ProductAdmin></ProductAdmin>
                        </Route>
                        <Route path="/admin/product/add-product" exact>
                            <ProductCreate className="add-product"></ProductCreate>
                        </Route>
                        <Route path="/admin/order" exact>
                            <OrderAdmin></OrderAdmin>
                        </Route>
                        <Route path="/admin/category" exact>
                            <Category></Category>
                        </Route>
                        <Route path="/admin/category/add-category" exact>
                            <NewCategory></NewCategory>
                        </Route>
                        <Route path="/admin/sale" exact>
                            <Sale></Sale>
                        </Route>
                        <Route path="/admin/sale/add-sale" exact>
                            <NewSale></NewSale>
                        </Route>
                        <Route path="/admin/voucher" exact>
                            <Voucher></Voucher>
                        </Route>
                        <Route path="/admin/voucher/add-voucher" exact>
                            <NewVoucher></NewVoucher>
                        </Route>
                        <Route path="/admin/brand" exact>
                            <Brand></Brand>
                        </Route>
                        <Route path="/admin/brand/add-brand" exact>
                            <NewBrand></NewBrand>
                        </Route>
                        <Route path={`/admin/order-detail/:id`} exact>
                            <OrderForm></OrderForm>
                        </Route>
                        <Route path={`/admin/product/product-detail/:id`} exact>
                            <EditProduct></EditProduct>
                        </Route>
                        <Route path={`/admin/detail-order/:id`} exact>
                            <OrderDetailAdmin></OrderDetailAdmin>
                        </Route>
                        <Route path={`/admin/voucher/voucher-detail/:id`} exact>
                            <EditVoucher></EditVoucher>
                        </Route>
                        <Route path={`/admin/brand/brand-detail/:id`} exact>
                            <EditBrand></EditBrand>
                        </Route>
                        <Route
                            path={`/admin/category/category-detail/:id`}
                            exact
                        >
                            <EditCategory></EditCategory>
                        </Route>
                        <Route path={`/admin/sale/sale-detail/:id`} exact>
                            <EditSale></EditSale>
                        </Route>
                        <Route path={`/admin/report-product`} exact>
                            <ReportProduct></ReportProduct>
                        </Route>
                        <Route path={`/admin/order-product/:id`} exact>
                            <OrderProduct></OrderProduct>
                        </Route>
                        <Route path={`/admin/report-month/:id`} exact>
                            <ReportMonth
                                yearHandler={yearHandler}
                            ></ReportMonth>
                        </Route>
                        <Route path={`/admin/order-month/:id`} exact>
                            <OrderMonth year={year}></OrderMonth>
                        </Route>
                        <Route path={`/admin/product/product-view/:id`} exact>
                            <Detail></Detail>
                        </Route>
                        <Route path={`/admin/search/:id`} exact>
                            <SearchOrder></SearchOrder>
                        </Route>
                        <Route path={`/admin/error-page`} exact>
                            <Error></Error>
                        </Route>
                        <Route path={`/admin/account/add-account`} exact>
                            <NewAccount></NewAccount>
                        </Route>
                        <Route path={`/admin/account/account-detail/:id`} exact>
                            <EditAccount></EditAccount>
                        </Route>
                        {/* <Route path={`/chat/ai`} exact>
                            <ChatAI></ChatAI>
                        </Route> */}
                    </Switch>
                </div>
            </div>

            {!isAdminRoute && <Footer></Footer>}
            <ToastContainer></ToastContainer>
        </div>
    );
};
export default UserLayout;
