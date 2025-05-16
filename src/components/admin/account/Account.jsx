import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAccounts } from "../../../api/AccountApi";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Badge from "../badge/Badge";
import { active } from "../../../enum/active";

const roleName = {
    CUSTOMER: "success",
    ADMIN: "danger",
};
const Account = () => {
    const [account, setAccount] = useState();
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState();
    const [size, setSize] = useState(10);

    const { register, handleSubmit, getValues, setValue, watch } = useForm({
        defaultValues: {
            query: "",
            search: "",
            inlineRadioOptions: "ALL",
        },
    });

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
    }, [
        page,
        size,
        watch("query"),
        watch("search"),
        watch("inlineRadioOptions"),
    ]);

    const onLoad = () => {
        getAccounts(
            page,
            size,
            getValues("query"),
            getValues("search"),
            getValues("inlineRadioOptions")
        )
            .then((resp) => {
                setAccount(resp.data.content);
                setTotal(resp.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });

        // getTotalPage()
        //     .then((resp) => setTotal(resp.data.content))
        //     .catch((error) => console.log(error));
    };

    // const getAccountByRoleHandler = (value) => {
    //     setRole(value);
    //     if (value === "ALL") {
    //         setPage(0);
    //         onLoad();
    //     } else {
    //         setPage(0);
    //         getAccountByRole(page, size, value)
    //             .then((resp) => setAccount(resp.data.content))
    //             .catch((error) => {
    //                 console.log(error);
    //                 toast.error(error.response.data.message);
    //             });
    //     }
    // };

    const onSubmitHandler = handleSubmit((data) => {
        console.log(data, "data");
    });
    return (
        <div className="card flex flex-col justify-between !mx-[25px] overflow-y-hidden">
            <form onSubmit={onSubmitHandler}>
                <div className="card__header mb-5 flex justify-between items-center">
                    <NavLink
                        to="/admin/account/add-account"
                        className="btn btn-primary"
                        style={{ borderRadius: 50 }}
                    >
                        Thêm tài khoản
                    </NavLink>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-[6px] mr-2 !pr-2">
                            <input
                                type="text"
                                placeholder="Search here..."
                                onChange={(e) =>
                                    setValue("search", e.target.value)
                                }
                                className="border-0 py-2 pl-2 rounded-[6px] focus:outline-none !text-[14px]"
                                {...register("search")}
                            />
                            <i className="bx bx-search" />
                        </div>
                        <select className="form-control" {...register("query")}>
                            <option value={""}>--- Lọc ---</option>
                            <option value={"isActive-true"}>Hoạt động</option>
                            <option value={"isActive-false"}>
                                Không hoạt động
                            </option>
                            <option value={"username-asc"}>Sắp xếp A-Z</option>
                            <option value={"username-desc"}>Sắp xếp Z-A</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div className="mb-3 mt-3">
                        <div className="form-check form-check-inline mr-5 ml-1">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                value="ALL"
                                onChange={(event) =>
                                    setValue(
                                        "inlineRadioOptions",
                                        event.target.value
                                    )
                                }
                                checked={watch("inlineRadioOptions") === "ALL"}
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
                                    setValue(
                                        "inlineRadioOptions",
                                        event.target.value
                                    )
                                }
                                checked={
                                    watch("inlineRadioOptions") === "ADMIN"
                                }
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
                                    setValue(
                                        "inlineRadioOptions",
                                        event.target.value
                                    )
                                }
                                checked={
                                    watch("inlineRadioOptions") === "CUSTOMER"
                                }
                            />
                            <label className="form-check-label">
                                Khách hàng
                            </label>
                        </div>
                    </div>
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    STT
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Username
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Họ tên
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Giới tính
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    SDT
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Vai trò
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Trạng thái
                                </th>
                                <th
                                    scope="col"
                                    className="text-center align-middle"
                                >
                                    Cập nhật
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {account?.map((item, index) => (
                                <tr key={index}>
                                    <td
                                        className="text-center align-middle font-bold"
                                        scope="row"
                                    >
                                        {index + 1 + page * size}
                                    </td>
                                    <td
                                        className="text-center align-middle"
                                        scope="row"
                                    >
                                        {item.username}
                                    </td>
                                    <td
                                        className="text-center align-middle"
                                        style={{ width: "200px" }}
                                    >
                                        {item?.userDetail.fullName}
                                    </td>
                                    <td className="text-center align-middle">
                                        {item?.userDetail?.gender}
                                    </td>
                                    <td className="text-center align-middle">
                                        {item?.userDetail?.phone}
                                    </td>
                                    <td className="text-center align-middle">
                                        {item?.email}
                                    </td>
                                    <td className="text-center align-middle">
                                        <Badge
                                            type={roleName[item.role]}
                                            content={item.role}
                                        />
                                    </td>
                                    <td className="text-center align-middle">
                                        <Badge
                                            type={active[item.isActive]}
                                            content={
                                                item.isActive
                                                    ? "Hoạt động"
                                                    : "Không hoạt động"
                                            }
                                        />
                                    </td>
                                    <td className="text-center align-middle">
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
            </form>
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
