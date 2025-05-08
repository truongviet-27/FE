import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getVouchers } from "../../../api/VoucherApi";
import formatDate from "../../../utils/convertDate";

const Voucher = () => {
    const [voucher, setVoucher] = useState();
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState();
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
        getVouchers(page, size).then((resp) => {
            setVoucher(resp.data.content);
            setTotal(resp.data.totalPages);
        });
    };

    return (
        <div className="card flex flex-col justify-between !mx-[25px] overflow-y-hidden">
            <div className="">
                <div className="card__header mb-5">
                    <NavLink
                        to="/admin/voucher/add-voucher"
                        className="btn btn-primary"
                        style={{ borderRadius: 50 }}
                    >
                        Thêm voucher
                    </NavLink>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Code</th>
                            <th scope="col">Giảm giá(%)</th>
                            <th scope="col">Lượt sử dụng</th>
                            <th scope="col">Ngày hết hạn</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Cập nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                        {voucher?.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1 + page * size}</th>
                                <td>{item.code}</td>
                                <td>{item.discount}</td>
                                <td>{item.count}</td>
                                <td>{formatDate(item.expireDate, true)}</td>
                                <td>
                                    {item.isActive
                                        ? "Hoạt động"
                                        : "Không hoạt động"}
                                </td>
                                <td>
                                    {" "}
                                    <NavLink
                                        to={`/admin/voucher/voucher-detail/${item._id}`}
                                        exact
                                    >
                                        <i
                                            className="fa fa-pencil-square-o"
                                            aria-hidden="true"
                                        ></i>
                                    </NavLink>{" "}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                        value={size}
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

export default Voucher;
