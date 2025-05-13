import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
    getAccounts,
    getTotalPage,
    getAccountByRole,
} from "../../../api/AccountApi";

import Badge from "../badge/Badge";
import { toast } from "react-toastify";

const roleName = {
    CUSTOMER: "success",
    ADMIN: "danger",
};

const active = {
    true: "primary",
    false: "danger",
};
const Account = () => {
    const [account, setAccount] = useState();
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState();
    const [role, setRole] = useState("TẤT CẢ");
    const [size, setSize] = useState(10);

    var rows = new Array(total).fill(0).map((zero, index) => (
        <li
            className={page === index ? "page-item active" : "page-item"}
            key={index}
        >
            <button
                className="page-link"
                style={{ borderRadius: 50 }}
                onClick={() => onChangePage(index + 1)}
            >
                {index + 1}
            </button>
        </li>
    ));

    const onChangePage = (page) => {
        setPage(page);
    };
    useEffect(() => {
        onLoad();
    }, [page, size]);

    const onLoad = () => {
        getAccounts(page, size)
            .then((resp) => {
                setAccount(resp.data.content);
                setTotal(resp.data.totalPages);
            })
            .catch((error) => toast.warning(error.response.data.message));

        // getTotalPage()
        //     .then((resp) => setTotal(resp.data.content))
        //     .catch((error) => console.log(error));
    };

    console.log(role, "role");

    const getAccountByRoleHandler = (value) => {
        setRole(value);
        if (value === "TẤT CẢ") {
            setPage(0);
            onLoad();
        } else {
            setPage(0);
            getAccountByRole(page, size, value)
                .then((resp) => setAccount(resp.data.content))
                .catch((error) => toast.warning(error.response.data.message));
        }
    };
    return (
        <div className="card flex flex-col justify-between !mx-[25px] overflow-y-hidden">
            <div>
                <div className="card__header mb-5">
                    <NavLink
                        to="/admin/account/add-account"
                        className="btn btn-primary"
                        style={{ borderRadius: 50 }}
                    >
                        Thêm tài khoản
                    </NavLink>
                </div>
                <div>
                    <div className="mb-3 mt-3">
                        <div className="form-check form-check-inline mr-5 ml-1">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                value="TẤT CẢ"
                                onChange={(event) =>
                                    getAccountByRoleHandler(event.target.value)
                                }
                                checked={role === "TẤT CẢ"}
                            />
                            <label className="form-check-label">Tất cả</label>
                        </div>
                        <div className="form-check form-check-inline mr-5 ml-1">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                value="ADMIN"
                                onChange={(event) =>
                                    getAccountByRoleHandler(event.target.value)
                                }
                                checked={role === "ADMIN"}
                            />
                            <label className="form-check-label">ADMIN</label>
                        </div>
                        <div className="form-check form-check-inline mr-5 ml-1">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                value="CUSTOMER"
                                onChange={(event) =>
                                    getAccountByRoleHandler(event.target.value)
                                }
                                checked={role === "CUSTOMER"}
                            />
                            <label className="form-check-label">
                                Khách hàng
                            </label>
                        </div>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Username</th>
                                <th scope="col">Họ tên</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">SDT</th>
                                <th scope="col">Email</th>
                                <th scope="col">Vai trò</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {account?.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">
                                        {index + 1 + page * size}
                                    </th>
                                    <th scope="row">{item.username}</th>
                                    <td style={{ width: "200px" }}>
                                        {item?.userDetail.fullName}
                                    </td>
                                    <td>{item?.userDetail?.gender}</td>
                                    <td>{item?.userDetail?.phone}</td>
                                    <td>{item?.email}</td>
                                    <td>
                                        <Badge
                                            type={roleName[item.role]}
                                            content={item.role}
                                        />
                                    </td>
                                    <td>
                                        <Badge
                                            type={active[item.isActive]}
                                            content={
                                                item.isActive
                                                    ? "Hoạt động"
                                                    : "Không hoạt động"
                                            }
                                        />
                                    </td>
                                    <td>
                                        <NavLink
                                            to={`/admin/account/account-detail/${item._id}`}
                                            exact
                                        >
                                            <i
                                                className="fa fa-pencil-square-o"
                                                aria-hidden="true"
                                            ></i>
                                        </NavLink>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <nav
                aria-label="Page navigation"
                className="flex items-center justify-between mt-3"
            >
                <div className="w-[100px]" />

                <div className="flex-1 flex justify-center items-center">
                    <div className="flex pagination gap-2">
                        <li
                            className={
                                page === 0 ? "page-item disabled" : "page-item"
                            }
                        >
                            <button
                                className="page-link"
                                style={{ borderRadius: 50 }}
                                onClick={() => onChangePage(0)}
                            >
                                {`<<`}
                            </button>
                        </li>
                        {rows}
                        <li
                            className={
                                page === total - 1
                                    ? "page-item disabled"
                                    : "page-item"
                            }
                        >
                            <button
                                className="page-link"
                                style={{ borderRadius: 50 }}
                                onClick={() => onChangePage(page + 1)}
                            >
                                {`>>`}
                            </button>
                        </li>
                    </div>
                </div>

                <div className="w-[100px] flex justify-end">
                    <select
                        className="py-2 pl-2 border border-gray-100 rounded-[6px]"
                        onChange={(e) => setSize(e.target.value)}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </nav>
        </div>
    );
};

export default Account;
