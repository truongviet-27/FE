import React, { useState, useEffect } from "react";
import { getAllProducts, filterProducts, toggleLikeProduct } from "../api/ProductApi";
import { getBrands } from "../api/BrandApi";
import { getCategory } from "../api/CategoryApi";
import { NavLink } from "react-router-dom";
import { Collapse } from "antd";
import "./sidebar/sidebar.css";
import { toast } from "react-toastify";


const { Panel } = Collapse;
const prices = [
  {
    display_name: "Dưới 1 triệu",
    value: "0",
    icon: "bx bx-category-alt",
    min: 0,
    max: 1000000,
  },
  {
    display_name: "1.000.000 - 2.000.000",
    value: "1",
    icon: "bx bx-category-alt",
    min: 1000000,
    max: 2000000,
  },
  {
    display_name: "2.000.000 - 3.000.000",
    value: "2",
    icon: "bx bx-category-alt",
    min: 2000000,
    max: 3000000,
  },
  {
    display_name: "3.000.000 - 4.000.000",
    value: "3",
    icon: "bx bx-category-alt",
    min: 3000000,
    max: 4000000,
  },
  {
    display_name: "Trên 4 triệu",
    value: "4",
    icon: "bx bx-category-alt",
    min: 4000000,
    max: 10000000,
  },
];

const count = 12;
const defaultBrand = [1, 2, 3, 4, 5, 6, 7];
const defaultCategory = [1, 2, 3, 4, 5, 6, 7];

const Product = (props) => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState({});
  const [categories, setCategories] = useState([])
  const [categoryIds, setCategory] = useState([]);
  const [brandIds, setBrand] = useState([]);
  const [price, setPrice] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(10000000);

  useEffect(() => {
    getBrands(0, 100).then((response) => {
      setBrands(response.data.content);
    });
  }, []);

  useEffect(() => {
    getCategory(0, 100).then((response) => {
      setCategories(response.data.content);
    });
  }, []);

  var rows = new Array(total).fill(0).map((zero, index) => (
    <li
      className={page === index ? "page-item active" : "page-item"}
      key={index}
    >
      <button className="page-link" onClick={() => onChangePage(index)}>
        {index + 1}
      </button>
    </li>
  ));
  const handleLike = (productId, currentLikeStatus) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vui lòng đăng nhập trước khi yêu thích sản phẩm");
      return;
    }

    toggleLikeProduct(productId, !currentLikeStatus, token)
      .then((response) => {
        getAllProducts(page, 12, true, token).then((response) => {

          setProducts(response.content);
          setTotal(response.totalPages);
        });
      })
      .catch((error) => {
        console.error("Lỗi khi thực hiện thao tác like: ", error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token") || null;
    if (categoryIds.length === 0 && brandIds.length === 0 && price.length === 0) {
      console.log("TOKEN HOME:", token);
      getAllProducts(page, 12, true, token).then((response) => {
        setProducts(response.content);  // Lưu các sản phẩm vào state
        setTotal(response.totalPages);
      });
    } else {
      const data = {
        page: page,
        count: count,
        categoryIds: categoryIds.length > 0 ? categoryIds : defaultCategory,
        brandIds: brandIds.length > 0 ? brandIds : defaultBrand,
        min: min,
        max: max,
      };
      filterProducts(data).then((resp) => {
        setProducts(resp.data.content);
        setTotal(resp.data.totalPages);
      }).catch((error) => {
        setProducts([]);
        setTotal(0);
        toast.error("Không tìm thấy sản phẩm ");
      });;
    }
  }, [page, categoryIds, brandIds, price, localStorage.getItem("token")]);

  const onChangePage = (page) => {
    setPage(page);
  };

  const chooseCategoryHandler = (value) => {
    console.log("VALUEE" + value)
    const index = categoryIds.indexOf(value);
    if (index > -1) {
      setCategory(categoryIds.filter((i) => i !== value));
    } else {
      setCategory([...categoryIds, value]);
    }
    onChangePage(0);
  };

  const chooseBrandHandler = (value) => {
    const index = brandIds.indexOf(value);
    if (index > -1) {
      setBrand(brandIds.filter((i) => i !== value));
    } else {
      setBrand([...brandIds, value]);
    }
    onChangePage(0);
  };
  const choosePriceHandler = (value) => {
    const index = price.indexOf(value);
    if (index > -1) {
      setPrice([]);
      setMin(0);
      setMax(10000000);
    } else {
      setPrice([value]);
      setMin(prices[value].min);
      setMax(prices[value].max);
    }
    onChangePage(0);
  };
  return (
    <div>
      <div className="mt-5">
        <div className="row">
          <div className="col-3">
            <Collapse defaultActiveKey={["1"]} accordion>
              <Panel header="Thương hiệu" key="1">
                <ul className="list-group">
                  {brands.map((item, index) => (
                    <div className="sidebar__item" key={index} onClick={() => chooseBrandHandler(item.id)}>
                      <div className={brandIds.includes(item.id) ? `sidebar__item-inner active` : `sidebar__item-inner`}>
                        <i className="bx bx-category-alt"></i>
                        <span>{item.name}</span>
                      </div>
                    </div>
                  ))}
                </ul>
              </Panel>
              <Panel header="Loại sản phẩm" key="2">
                <ul className="list-group">
                  {categories.map((item, index) => (
                    <div
                      className="sidebar__item"
                      key={index}
                      onClick={() => chooseCategoryHandler(item.id)}
                    >
                      <div
                        className={
                          categoryIds.includes(item.id)
                            ? `sidebar__item-inner active`
                            : `sidebar__item-inner`
                        }
                      >
                        <i className="bx bx-category-alt"></i>
                        <span>{item.name}</span>
                      </div>
                    </div>
                  ))}
                </ul>
              </Panel>
              <Panel header="Giá" key="3">
                <ul className="list-group">
                  {prices.map((item, index) => (
                    <div className="sidebar__item" key={index}>
                      <div
                        className={
                          price.includes(item.value)
                            ? `sidebar__item-inner active`
                            : `sidebar__item-inner`
                        }
                        onClick={() => choosePriceHandler(item.value)}
                      >
                        <i className={item.icon}></i>
                        <span>{item.display_name}</span>
                      </div>
                    </div>
                  ))}
                </ul>
              </Panel>
            </Collapse>
          </div>

          <div className="col">
            <div className="container-fluid padding">
              <div className="row welcome mini-card">
                <h4 className="title text-danger">Sản phẩm nổi bật</h4>
              </div>
              <div className="row padding">
                {products &&
                  products.map((item, index) => (
                    <div className="col-md-4 mb-3" key={index}>
                      <div className="card h-100">
                        <div className="d-flex justify-content-between position-absolute w-100">
                          <div className="label-new">
                            <span className="text-white small d-flex align-items-center px-2 py-1" style={{ backgroundColor: "yellowgreen" }} >
                              <i className="fa fa-star" aria-hidden="true"></i>
                              <span className="ml-1">Mới</span>
                            </span>
                          </div>
                        </div>
                        <NavLink to={`/product-detail/${item.id}`}>
                          <img
                            src={item.image}
                            style={{ width: 150, height: 150 }}
                            alt={item.name}
                          />
                        </NavLink>
                        <div className="card-body px-2 pb-2 pt-1">
                          <div className="d-flex justify-content-between">
                            <div>
                              <p className="h4 text-primary">
                                {(
                                  (item.price * (100 - item.discount)) / 100
                                ).toLocaleString()} Đ
                              </p>
                            </div>
                          </div>
                          <p className="text-warning d-flex align-items-center mb-2">
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                          </p>
                          <p className="mb-0">
                            <strong>
                              <NavLink
                                to={`/product-detail/${item.id}`}
                                className="text-secondary"
                              >
                                {item.name}
                              </NavLink>
                            </strong>
                          </p>
                          <p className="mb-1">
                            <small>
                              <NavLink to="#" className="text-secondary">
                                {item.brand}
                              </NavLink>
                            </small>
                          </p>
                          <div className="d-flex mb-3 justify-content-between">
                            <div>
                              <p className="mb-0 small">
                                <b>Yêu thích: </b> {item.view} lượt
                              </p>
                              <p className="mb-0 small">
                                <b>Giá gốc: </b> {item.price.toLocaleString()} Đ
                              </p>
                              <p className="mb-0 small text-danger">
                                <span className="font-weight-bold">
                                  Tiết kiệm:{(item.discount * item.price) / 100}
                                </span>{" "}
                                ({item.discount}%)
                              </p>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="col px-0">
                              <NavLink
                                to={`/product-detail/${item.id}`}
                                exact
                                className="btn btn-outline-primary btn-block"
                              >
                                Thêm vào giỏ
                                <i
                                  className="fa fa-shopping-basket"
                                  aria-hidden="true"
                                ></i>
                              </NavLink>
                            </div>
                            <div className="ml-2">
                              <NavLink
                                to="#"
                                className="btn btn-outline-success"
                                data-toggle="tooltip"
                                data-placement="left"
                                title="Add to Wishlist"
                                onClick={() => handleLike(item.id, item.liked)}
                              >
                                <i className={`fa fa-heart ${item.liked ? 'text-danger' : ''}`} aria-hidden="true"></i>
                              </NavLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination offset-5 mt-3">
                  <li className={page === 0 ? "page-item disabled" : "page-item"}>
                    <button
                      className="page-link"
                      style={{ borderRadius: 50 }}
                      onClick={() => onChangePage(0)}
                    >
                      {"<<"}
                    </button>
                  </li>
                  {rows}
                  <li
                    className={page === total ? "page-item disabled" : "page-item"}
                  >
                    <button
                      className="page-link"
                      style={{ borderRadius: 50 }}
                      onClick={() => onChangePage(total - 1)}
                    >
                      {`>>`}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Product;