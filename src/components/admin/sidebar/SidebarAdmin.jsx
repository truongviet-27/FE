import React, { useEffect } from "react";
import "./sidebar.css";
import { Link, useLocation } from "react-router-dom";

const sidebar_items_1 = [
  {
    "display_name": "Dashboard",
    "route": "/admin/dashboard",
    "icon": "bx bx-category-alt"
  },
  {
    "display_name": "Tài khoản",
    "route": "/admin/account",
    "add": "admin/add-account",
    "modify": "admin/account-detail",
    "icon": "bx bx-user-pin"
  },
  {
    "display_name": "Sản phẩm",
    "route": "/admin/products",
    "add": "admin/add-product",
    "modify": "admin/product-detail",
    "icon": "bx bx-package"
  },
  {
    "display_name": "Đơn hàng",
    "route": "/admin/orders",
    "add": "admin/add-order",
    "modify": "admin/order-detail",
    "sub": "admin/detail-order",
    "icon": "bx bx-cart"
  },
  {
    "display_name": "Voucher",
    "route": "/admin/vouchers",
    "add": "admin/add-voucher",
    "modify": "admin/voucher-detail",
    "icon": "bx bx-bar-chart-alt"
  },
  {
    "display_name": "Loại sản phẩm",
    "route": "/admin/categories",
    "add": "admin/add-category",
    "modify": "admin/category-detail",
    "icon": "bx bx-list-ol"
  },
  {
    "display_name": "Khuyến mãi",
    "route": "/admin/sale",
    "add": "admin/add-sale",
    "modify": "admin/sale-detail",
    "icon": "bx bx-gift"
  },
  {
    "display_name": "Thương hiệu",
    "route": "/admin/brand",
    "add": "admin/add-brand",
    "modify": "admin/brand-detail",
    "icon": "bx bx-store-alt"
  },
  {
    "display_name": "Hộp thoại",
    "route": "/admin/chat",
    "add": "admin/chat",
    "modify": "admin/chat",
    "icon": "bx bx-user-pin"
  }
]

const SidebarItem = ({ title, icon, active }) => {
  const activeClass = active ? "active" : "";
  return (
    <div className="sidebar__item">
      <div className={`sidebar__item-inner ${activeClass}`}>
        <i className={icon}></i>
        <span>{title}</span>
      </div>
    </div>
  );
};

const Sidebar = (props) => {
  const location = useLocation();
  const sidebar_items = sidebar_items_1

  useEffect(() => {
    console.log("USER++++++=" + props.user);
  }, []);

  const activeItem = sidebar_items.findIndex(
    (item) =>
      item.route === location.pathname ||
      item.add === location.pathname ||
      item.modify === location.pathname.substring(0, location.pathname.lastIndexOf("/")) ||
      item.sub === location.pathname.substring(0, location.pathname.lastIndexOf("/"))
  );

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        {/* <img src={logo} alt="store logo" /> */}
      </div>
      {sidebar_items.map((item, index) => (
        <Link to={item.route} key={index}>
          <SidebarItem
            title={item.display_name}
            icon={item.icon}
            active={index === activeItem}
          ></SidebarItem>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
