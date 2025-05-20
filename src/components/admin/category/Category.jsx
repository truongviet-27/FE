import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getCategoryAdmin } from "../../../api/CategoryApi";
import formatDate from "../../../utils/convertDate";
import { toast } from "react-toastify";
import Badge from "../badge/Badge";
import { active } from "../../../enum/active";
import { useForm } from "react-hook-form";

const Category = () => {
    const [category, setCategory] = useState();
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState();
    const [size, setSize] = useState(10);

    const { register, handleSubmit, getValues, setValue, watch } = useForm({
        defaultValues: {
            query: "",
            search: "",
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
    }, [page, size, page, size, watch("query"), watch("search")]);

    const onLoad = () => {
        getCategoryAdmin(page, size, getValues("query"), getValues("search"))
            .then((resp) => {
                setCategory(resp.data.content);
                setTotal(resp.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message);
            });
    };

    const onSubmitHandler = handleSubmit((data) => {
        console.log(data, "data");
    });

    return (
        <div className="card flex flex-col justify-between !mx-[25px] overflow-y-hidden">
            <form onSubmit={onSubmitHandler}>
                <div className="card__header mb-5 flex justify-between items-center">
                    <NavLink
                        to="/admin/category/add-category"
                        className="btn btn-primary"
                        style={{ borderRadius: 50 }}
                    >
                        Thêm loại sản phẩm
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
                            <option value={"name-asc"}>Sắp xếp A-Z</option>
                            <option value={"name-desc"}>Sắp xếp Z-A</option>
                        </select>
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
                                Tên
                            </th>
                            <th
                                scope="col"
                                className="text-center align-middle"
                            >
                                Mô tả
                            </th>
                            <th
                                scope="col"
                                className="text-center align-middle"
                            >
                                Ngày tạo
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
                        {category?.map((item, index) => (
                            <tr key={index}>
                                <td
                                    className="text-center align-middle font-medium"
                                    scope="row"
                                >
                                    {index + 1 + page * size}
                                </td>
                                <td className="text-center align-middle font-medium">
                                    {item.name}
                                </td>
                                <td className="text-center align-middle font-medium">
                                    {item.description}
                                </td>
                                <td className="text-center align-middle font-medium">
                                    {formatDate(item.createdAt)}
                                </td>
                                <td className="text-center align-middle font-medium">
                                    <Badge
                                        type={active[item.isActive]}
                                        content={
                                            item.isActive
                                                ? "Hoạt động"
                                                : "Không hoạt động"
                                        }
                                    />
                                </td>
                                <td className="text-center align-middle font-medium">
                                    <NavLink
                                        to={`/admin/category/category-detail/${item._id}`}
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

export default Category;
